import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import { ResponseStatus } from "../../enums";
import sendResponse from "../../shared/send-response";

const notFoundHandler = (req: Request, res: Response, next: NextFunction) => {
	return sendResponse(res, {
		status: ResponseStatus.FAILED,
		statusCode: httpStatus.NOT_FOUND,
		success: false,
		message: "Resource not found",
	});
};

export default notFoundHandler;
