import { Request, Response } from "express";
import httpStatus from "http-status";
import { JwtPayload } from "jsonwebtoken";
import config from "../../../config";
import { ResponseStatus } from "../../../enums";
import ApiError from "../../../errors/api-error";
import catchAsync from "../../../shared/catch-async";
import sendResponse from "../../../shared/send-response";
import {
	ILoginUserResponse,
	IRefreshTokenResponse,
	IRegUser,
} from "./auth.interface";
import { AuthService } from "./auth.service";

/*
 * Controller
 */

/*
======================
- POST 
- /auth/signup
======================
*/
const signUpController = catchAsync(async (req: Request, res: Response) => {
	const { ...payload } = req.body as IRegUser;

	const signUpResponse = await AuthService.signUpService(payload);

	signUpResponse &&
		sendResponse<object>(res, {
			statusCode: httpStatus.CREATED,
			success: true,
			status: ResponseStatus.SUCCESS,
			message: "Account created successfully",
			links: {
				login: `/auth/login`,
			},
		});
});

/*
================
- POST 
- /auth/login
================
*/
const loginController = catchAsync(async (req: Request, res: Response) => {
	const { ...loginData } = req.body;

	const result = await AuthService.loginService(loginData);

	const { refreshToken, accessToken } = result;

	const cookieOptions = {
		httpOnly: true,
		secure: config.env === "production",
		maxAge:
			1000 *
			60 *
			60 *
			24 *
			parseInt(config.jwt.jwt_refresh_expires_in as string),
	};

	//set refresh token into cookie
	res.cookie("refresh_token", refreshToken, cookieOptions);

	result &&
		sendResponse<ILoginUserResponse>(res, {
			statusCode: httpStatus.OK,
			success: true,
			status: ResponseStatus.SUCCESS,
			message: "Login successful",
			data: {
				accessToken,
				refreshToken,
			},
			links: {
				home: `/`,
			},
		});
});

/*
========================
- POST 
- /auth/refreshToken
========================
*/
const refreshTokenController = catchAsync(
	async (req: Request, res: Response) => {
		const { refresh_token } = req.cookies;

		const result = await AuthService.refreshTokenService(refresh_token);

		const cookieOptions = {
			httpOnly: true,
			secure: config.env === "production",
		};

		//set refresh token into cookie
		res.cookie("refresh_token", refresh_token, cookieOptions);

		result &&
			sendResponse<IRefreshTokenResponse>(res, {
				statusCode: httpStatus.OK,
				success: true,
				message: "Login successfull",
				status: ResponseStatus.SUCCESS,
				data: result,
				links: {
					home: `/`,
				},
			});
	}
);

/*
=============================
- GET 
- /auth/logout
=============================
*/
const logoutController = catchAsync(async (req: Request, res: Response) => {
	const user = req.user as JwtPayload;
	if (!user) throw new ApiError(httpStatus.BAD_REQUEST, "Invalid request");
	else {
		let accessToken = req.headers.authorization?.split(" ")[1];
		const refreshToken = req.cookies.refresh_token;

		if (accessToken && req.headers.authorization) {
			accessToken = "";
			res.setHeader("authorization", `Bearer ${accessToken}`);
		}
		if (refreshToken) {
			res.clearCookie("refresh_token");
		}
		req.user = null;

		await AuthService.logoutService(user.userId);

		sendResponse(res, {
			statusCode: httpStatus.OK,
			success: true,
			status: ResponseStatus.SUCCESS,
			message: "Logout successfully",
			data: {
				accessToken,
				refreshToken: req.cookies.refresh_token,
				user: req.user,
			},
		});
	}
});

export const AuthController = {
	signUpController,
	loginController,
	refreshTokenController,
	logoutController,
};
