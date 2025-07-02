import httpStatus from "http-status";
import fs from "fs";
import path from "path";
import crypto from "crypto";
import ApiError from "../../errors/api-error";
import multer from "multer";

var dir = "public";
const MAX_FILE_SIZE = 1024 * 1024 * 5;

export const upload = multer({
	storage: multer.diskStorage({
		destination: function (req, file, callback) {
			if (!fs.existsSync(dir)) {
				fs.mkdirSync(dir);
			}
			var subDir = `/${file.fieldname}`;

			if (!fs.existsSync(`${dir}/${subDir}`)) {
				fs.mkdirSync(`${dir}/${subDir}`);
			}
			callback(null, `${dir}/${subDir}`);
		},
		filename: function (req, file, callback) {
			callback(
				null,
				"/" +
					crypto.randomBytes(2).toString("hex") +
					path.extname(file.originalname)
			);
		},
	}),
	limits: {
		fileSize: MAX_FILE_SIZE,
	},
	fileFilter: (req, file, callback) => {
		const fileSize = parseInt(req.headers["content-length"] as string, 10);
		if (fileSize > MAX_FILE_SIZE) {
			return callback(
				new ApiError(
					httpStatus.FORBIDDEN,
					`File size limit exceeded ${MAX_FILE_SIZE / 1024 ** 2}MB.`
				)
			);
		}

		callback(null, true);
	},
});
