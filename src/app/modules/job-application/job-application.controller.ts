import { Request, Response } from "express";
import httpStatus from "http-status";
import { httpServer } from "../../..";
import { PAGINATION } from "../../../constants/pagination";
import { ResponseStatus } from "../../../enums";
import ApiError from "../../../errors/api-error";
import { queryHelper } from "../../../helpers/query-helper";
import { totalCount } from "../../../helpers/total-count";
import { IPaginationOptions } from "../../../interfaces/pagination.interface";
import socket from "../../../lib/socket";
import catchAsync from "../../../shared/catch-async";
import pick from "../../../shared/pick";
import sendResponse from "../../../shared/send-response";
import {
	jobPostFilterableFields,
	jobPostSearchableFields,
} from "../job-post/job-post.constants";
import { IJobPostSchema } from "../job-post/job-post.interface";
import { JobService } from "../job-post/job-post.service";
import { UserService } from "../user/user.service";
import { JobApplicationService } from "./job-application.service";

/*
===========================
- POST 
- /job-applications/:jobId
===========================
*/
const applyJobApplicationController = catchAsync(
	async (req: Request, res: Response) => {
		const existJob = await JobService.getSingleJobService(req.params.jobId);

		if (!existJob) {
			throw new ApiError(httpStatus.NOT_FOUND, "Job not found");
		}

		let payload = req.body;
		if (req.file) {
			payload.resume = req.file.fieldname + "/" + req.file.filename;
		}
		const candidate = await UserService.getSingleUserService({
			email: req.user?.email,
		});
		await JobApplicationService.applyToJobService({
			...payload,
			candidateId: candidate._id,
			jobId: existJob._id,
		});

		const employerId = existJob.createdBy?.toString();
		const employerSocketId = socket(httpServer).connectedUsers.get(employerId);

		if (employerSocketId) {
			socket(httpServer).io.to(employerSocketId).emit("job-application", {
				message: "New application received",
				jobTitle: existJob.title,
				candidateId: candidate._id,
				jobId: existJob._id,
			});
		}

		sendResponse(res, {
			statusCode: httpStatus.CREATED,
			success: true,
			status: ResponseStatus.SUCCESS,
			message: "Applied successfully",
		});
	}
);

/*
===========================
- GET 
- /job-applications/:jobId
===========================
*/
const getAllJobApplicationsController = catchAsync(
	async (req: Request, res: Response) => {
		const filterableOptions = pick(req.query, jobPostFilterableFields);
		const paginationOptions: IPaginationOptions = pick(req.query, PAGINATION);

		const { url, query, path } = req;

		const total = await totalCount("jobs");

		const options = {
			filterableOptions,
			paginationOptions,
			searchableFields: jobPostSearchableFields,
			url,
			query,
			path,
			total,
		};

		const { pagination, links, ...restOptions } = queryHelper(options);

		const result = await JobService.getAllJobsService(restOptions);

		if (!result) {
			throw new ApiError(httpStatus.NOT_FOUND, "No jobs found");
		}

		sendResponse<IJobPostSchema[]>(res, {
			statusCode: httpStatus.OK,
			success: true,
			status: ResponseStatus.SUCCESS,
			meta: result.meta,
			data: result.data,
		});
	}
);

export const JobApplicationController = {
	applyJobApplicationController,
	getAllJobApplicationsController,
};
