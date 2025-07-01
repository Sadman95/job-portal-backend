import httpStatus from "http-status";
import { User } from "./user.model";
import { ObjectId } from "mongoose";
import ApiError from "../../../errors/api-error";

/* get user by id */
const getSingleUserService = async (id: ObjectId) => {
	const user = await User.isUserExists({ _id: id });
	if (!user) throw new ApiError(httpStatus.NOT_FOUND, "User not found");
	return user;
};

export const UserService = {
	getSingleUserService,
};
