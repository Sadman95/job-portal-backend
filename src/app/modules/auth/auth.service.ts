import httpStatus from "http-status";
import { JwtPayload, Secret } from "jsonwebtoken";
import { Document, ObjectId } from "mongoose";
import * as OTPAuth from "otpauth";
import config from "../../../config";
import ApiError from "../../../errors/api-error";
import { JwtHelpers } from "../../../helpers/jwt-helpers";
import { generateRandomBase32 } from "../../../utils/generate-random-base32";
import { User } from "../user/user.model";
import { decodedUser } from "../user/user.utils";
import { ILoginUser, IRefreshTokenResponse, IRegUser } from "./auth.interface";
import { ITwoFA, TwoFAModel } from "./two-fa.model";

/*
 * Service
 */

/*
================
- POST 
- /auth/signup
================
*/
const signUpService = async (payload: IRegUser): Promise<Document> => {
	//check if user exists or not
	const isExist = await User.isUserExists({ email: payload.email });

	if (isExist) {
		throw new ApiError(
			httpStatus.CONFLICT,
			"User already exists, please login"
		);
	}

	const newUser = new User({
		username: payload.email.split("@")[0],
		...payload,
	});

	return await newUser.save();
};

/*
================
- POST 
- /auth/login
================
*/
const loginService = async (
	payload: ILoginUser
): Promise<{
	accessToken: string;
	refreshToken: string;
}> => {
	const { email, password } = payload;

	//check if user exists or not
	const isExist = await User.isUserExists({ email: email });

	if (!isExist) {
		throw new ApiError(httpStatus.NOT_FOUND, "User does not exist");
	}

	//compare password with saved password using bcrypt
	const isMatched = await User.isPasswordMatch(password, isExist?.password);

	if (!isMatched) {
		throw new ApiError(httpStatus.CONFLICT, "Password doesn't match'");
	}

	// verify 2fa
	const twoFA = await TwoFAModel.findOne({ userId: isExist._id });
	if (twoFA && twoFA.enabled) {
		throw new ApiError(
			httpStatus.UNAUTHORIZED,
			"2FA is enabled, please verify your token"
		);
	}

	//create accessToken & refreshToken
	const { _id: id } = isExist;

	const accessToken = JwtHelpers.generateJwtToken(
		{
			username: isExist.username,
			email: isExist.email,
			roles: isExist.roles,
		},
		config.jwt.jwt_secret as Secret,
		config.jwt.jwt_expires_in as string
	);
	const refreshToken = JwtHelpers.generateJwtToken(
		{
			username: isExist.username,
			email: isExist.email,
			roles: isExist.roles,
		},
		config.jwt.jwt_refresh_secret as Secret,
		config.jwt.jwt_refresh_expires_in as string
	);

	//update refreshToken in db
	await User.findByIdAndUpdate({ _id: id }, { refreshToken });

	return {
		accessToken,
		refreshToken,
	};
};

/*
==========================
- POST 
- /auth/rerefreshToken
==========================
*/
const refreshTokenService = async (
	token: string
): Promise<IRefreshTokenResponse | null> => {
	let verifiedToken: JwtPayload | null = null;

	try {
		verifiedToken = decodedUser(token, config.jwt.jwt_refresh_secret as Secret);
	} catch (error) {
		throw new ApiError(httpStatus.FORBIDDEN, "Invalid refresh token");
	}

	const { email } = verifiedToken;

	const isUserExist = await User.isUserExists({ email });
	if (!isUserExist) {
		throw new ApiError(httpStatus.NOT_FOUND, "User does not exist");
	}

	//generate new access token
	const newAccessToken = JwtHelpers.generateJwtToken(
		{
			username: isUserExist.username,
			email: isUserExist.email,
			roles: isUserExist.roles,
		},
		config.jwt.jwt_secret as Secret,
		config.jwt.jwt_expires_in as string
	);

	return {
		accessToken: newAccessToken,
	};
};

/*
==========================
- GET 
- /auth/logout
==========================
*/
const logoutService = async (id: ObjectId): Promise<void> => {
	const isUserExist = await User.isUserExists({ _id: id });
	if (!isUserExist) {
		throw new ApiError(httpStatus.NOT_FOUND, "User does not exist");
	}

	//remove refreshToken from db
	await User.findByIdAndUpdate({ _id: id }, { refreshToken: "" });
};

/*
==========================
- PATCH 
- /auth/enable-2fa
==========================
*/
const enable2faService = async (payload: {
	email: string;
}): Promise<Pick<ITwoFA, "base32_secret" | "auth_url">> => {
	const isUserExist = await User.isUserExists({ email: payload.email });
	if (!isUserExist) {
		throw new ApiError(httpStatus.NOT_FOUND, "User does not exist");
	}

	const isVerified2fa = await TwoFAModel.findOne({
		userId: isUserExist._id,
		verified: true,
	});
	if (isVerified2fa) {
		throw new ApiError(
			httpStatus.BAD_REQUEST,
			"2FA is already enabled for this user"
		);
	}

	const base32secret = generateRandomBase32() as string;

	let totp = new OTPAuth.TOTP({
		issuer: "job-portal.com",
		label: "Job Portal",
		algorithm: "SHA1",
		digits: 6,
		secret: base32secret,
	});

	let otpauth_url = totp.toString();

	// let remaining = totp.remaining();
	// console.log("remaining: ", Math.round(remaining / 1000));

	const twoFA = {
		userId: isUserExist._id,
		base32_secret: base32secret,
		auth_url: otpauth_url,
		enabled: true,
	};

	const updatedTwoFA = await TwoFAModel.findOneAndUpdate(
		{
			userId: isUserExist._id,
		},
		twoFA,
		{
			new: true,
			upsert: true,
		}
	);

	const { auth_url, base32_secret } = updatedTwoFA;

	return {
		auth_url,
		base32_secret,
	};
};

/*
==========================
- PATCH 
- /auth/verify-2fa
==========================
*/
const verify2faService = async (payload: {
	email: string;
	token: string;
}): Promise<ITwoFA> => {
	const isUserExist = await User.isUserExists({ email: payload.email });
	if (!isUserExist) {
		throw new ApiError(httpStatus.NOT_FOUND, "User does not exist");
	}

	const twoFA = await TwoFAModel.findOne({ userId: isUserExist._id });

	if (!twoFA || !twoFA.enabled) {
		throw new ApiError(
			httpStatus.BAD_REQUEST,
			"2FA is not enabled for this user"
		);
	}

	let totp = new OTPAuth.TOTP({
		issuer: "job-portal.com",
		label: "Job Portal",
		algorithm: "SHA1",
		digits: 6,
		secret: twoFA.base32_secret,
	});

	const isValid = totp.validate({ token: payload.token, window: 1 });

	if (!isValid) {
		throw new ApiError(httpStatus.UNAUTHORIZED, "Invalid OTP");
	}

	const updatedTwoFA = await TwoFAModel.findOneAndUpdate(
		{
			userId: isUserExist._id,
		},
		{ enabled: true, verified: true },
		{ new: true }
	);

	if (!updatedTwoFA) {
		throw new ApiError(
			httpStatus.INTERNAL_SERVER_ERROR,
			"Failed to update 2FA status"
		);
	}

	return updatedTwoFA;
};

/*
==========================
- PATCH 
- /auth/disable-2fa
==========================
*/
const disable2faService = async (payload: {
	email: string;
}): Promise<ITwoFA> => {
	const isUserExist = await User.isUserExists({ email: payload.email });
	if (!isUserExist) {
		throw new ApiError(httpStatus.NOT_FOUND, "User does not exist");
	}

	const twoFA = await TwoFAModel.findOne({ userId: isUserExist._id });
	if (!twoFA) {
		throw new ApiError(httpStatus.NOT_FOUND, "2FA not found for this user");
	}

	twoFA.enabled = false;
	twoFA.verified = false;

	const updatedTwoFA = await twoFA.save();
	return updatedTwoFA;
};

export const AuthService = {
	signUpService,
	loginService,
	refreshTokenService,
	logoutService,
	enable2faService,
	verify2faService,
	disable2faService,
};
