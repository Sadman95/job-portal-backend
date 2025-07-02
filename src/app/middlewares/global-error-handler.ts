/* eslint-disable no-unused-vars */
/* eslint-disable no-console */
/* eslint-disable no-unused-expressions */
import { ErrorRequestHandler, NextFunction, Request, Response } from "express";
import { ZodError } from "zod";
import config from "../../config";
import ApiError from "../../errors/api-error";
import handleCastError from "../../errors/handle-cast-error";
import handleValidationError from "../../errors/handle-validation-error";
import handleZodError from "../../errors/handle-zod-error";
import { IGenericErrorMessage } from "../../interfaces/error.interface";
import { logger } from "../../shared/logger";
import path from "path";
import fs from "fs";

const globalErrorHandler: ErrorRequestHandler = (
	error,
	req: Request,
	res: Response,
	next: NextFunction
) => {
	if (!error) {
		next();
	}

	//file handle
	if (req.file) {
		const filePath = path.join(
			__dirname,
			"..",
			"..",
			"public",
			req.file.fieldname,
			req.file.filename
		);
		fs.unlink(filePath, (unlinkErr) => {
			if (unlinkErr) {
				logger.log("Error while deleting the file:", unlinkErr);
			}
		});
	}

	if (req.files) {
		const files = {
			data: req.files,
			[Symbol.iterator]: function () {
				let index = 0;
				const data = this.data;
				return {
					next: function () {
						if (Array.isArray(data)) {
							return index < data.length
								? { value: data[index++], done: false }
								: { done: true };
						}
						return { done: true };
					},
				};
			},
		};

		for (const file of files) {
			file && fs.unlinkSync(file.path);
		}
	}
	//file handle

	config.env === "development"
		? console.log(`🐱‍🏍 globalErrorHandler ~~`, { error })
		: logger.error(`🐱‍🏍 globalErrorHandler ~~`, error);

	let statusCode = 500;
	let message = "Something went wrong !";
	let errorMessages: IGenericErrorMessage[] = [];

	if (error?.name === "ValidationError") {
		const simplifiedError = handleValidationError(error);
		statusCode = simplifiedError.statusCode;
		message = simplifiedError.message;
		errorMessages = simplifiedError.errorMessages;
	} else if (error.name === "CastError") {
		const simplifiedError = handleCastError(error);
		statusCode = simplifiedError.statusCode;
		message = simplifiedError.message;
		errorMessages = simplifiedError.errorMessages;
	} else if (error instanceof ZodError) {
		const simplifiedError = handleZodError(error);
		statusCode = simplifiedError.statusCode;
		message = simplifiedError.message;
		errorMessages = simplifiedError.errorMessages;
	} else if (error instanceof ApiError) {
		statusCode = error?.statusCode;
		message = error.message;
		errorMessages = error?.message
			? [
					{
						path: "",
						message: error?.message,
					},
			  ]
			: [];
	} else if (error instanceof Error) {
		message = error?.message;
		errorMessages = error?.message
			? [
					{
						path: "",
						message: error?.message,
					},
			  ]
			: [];
	}

	res.status(statusCode).json({
		success: false,
		message: message,
		errorMessages: errorMessages,
		stack: config.env !== "production" ? error?.stack : undefined,
	});
};

export default globalErrorHandler;
