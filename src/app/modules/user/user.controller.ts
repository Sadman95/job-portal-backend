import { Request, Response } from "express";
import httpStatus from "http-status";
import { JwtPayload } from "jsonwebtoken";
import { IUserSchema } from "./user.interface";
import { UserService } from "./user.service";
import mongoose from "mongoose";
import catchAsync from "../../../shared/catch-async";
import ApiError from "../../../errors/api-error";
import sendResponse from "../../../shared/send-response";
import { ResponseStatus } from "../../../enums";

/*
 * Controller
 */

/*
======================
- GET 
- /users/:id
======================
*/
const getSingleUserController = catchAsync(
	async (req: Request, res: Response) => {
		const { id } = req.params;

		const { userId } = req.user as JwtPayload;

		if (id !== userId) {
			throw new ApiError(httpStatus.UNAUTHORIZED, "Unauthorized access");
		}

		const result = await UserService.getSingleUserService({
			_id: new mongoose.Types.ObjectId(id),
		});

		result &&
			sendResponse<IUserSchema>(res, {
				status: ResponseStatus.SUCCESS,
				statusCode: httpStatus.OK,
				success: true,
				message: "User retrieved successfully",
				data: result,
			});
	}
);

export const UserController = {
	getSingleUserController,
};
