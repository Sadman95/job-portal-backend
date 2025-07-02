import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import { Secret } from "jsonwebtoken";
import config from "../../config";
import ApiError from "../../errors/api-error";
import { decodedUser } from "../modules/user/user.utils";

/* auth validation */
export const checkAuth = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const { refresh_token, access_token } = req.cookies;
		const accessToken =
			req.headers.authorization?.split(" ")[1] || access_token;

		const token = refresh_token || accessToken;
		if (!token) {
			throw new ApiError(httpStatus.UNAUTHORIZED, "You aren't authorized");
		}
		let verifiedUser = null;
		const secret =
			token === refresh_token
				? config.jwt.jwt_refresh_secret
				: config.jwt.jwt_secret;

		verifiedUser = decodedUser(token, secret as Secret);

		if (!verifiedUser) {
			throw new ApiError(httpStatus.UNAUTHORIZED, "You aren't authorized");
		}

		req.user = verifiedUser;

		next();
	} catch (error) {
		next(error);
	}
};

/* auth-roles validation */
export const authenticateRoles = (...roles: string[]) => {
	return async (req: Request, res: Response, next: NextFunction) => {
		try {
			// Ensure the user is authenticated first
			if (!req.user) {
				throw new ApiError(httpStatus.UNAUTHORIZED, "Unauthorized access!");
			}

			// Check if the user role matches one of the allowed roles
			const isValidRole = roles
				.map((role) => role.toLowerCase())
				.some((r) =>
					req
						.user!.roles.map((userRole: string) => userRole.toLowerCase())
						.includes(r)
				);
			if (!isValidRole) {
				throw new ApiError(httpStatus.FORBIDDEN, "Access denied!");
			}

			next();
		} catch (error) {
			next(error);
		}
	};
};
