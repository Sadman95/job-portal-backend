import { Request, Response } from "express";
import httpStatus from "http-status";
import { JwtPayload } from "jsonwebtoken";
import { PAGINATION } from "../../../constants/pagination";
import { ResponseStatus, USER_ROLE } from "../../../enums";
import ApiError from "../../../errors/api-error";
import { queryHelper } from "../../../helpers/query-helper";
import { totalCount } from "../../../helpers/total-count";
import { IPaginationOptions } from "../../../interfaces/pagination.interface";
import catchAsync from "../../../shared/catch-async";
import pick from "../../../shared/pick";
import sendResponse from "../../../shared/send-response";
import { UserService } from "../user/user.service";
import {
	jobPostFilterableFields,
	jobPostSearchableFields,
} from "./job-post.constants";
import { IJobPostSchema } from "./job-post.interface";
import { JobService } from "./job-post.service";

/*
===========================
- POST 
- /jobs
===========================
*/
const createJobController = catchAsync(async (req: Request, res: Response) => {
	const payload = req.body;
	const employer = await UserService.getSingleUserService({
		email: req.user?.email,
	});
	await JobService.createJobService({
		...payload,
		createdBy: employer._id,
	});

	sendResponse<IJobPostSchema>(res, {
		statusCode: httpStatus.CREATED,
		success: true,
		status: ResponseStatus.SUCCESS,
		message: "Job created successfully",
	});
});

/*
===========================
- GET 
- /jobs
===========================
*/
const getAllJobsController = catchAsync(async (req: Request, res: Response) => {
	const filterableOptions = pick(req.query, jobPostFilterableFields) as Record<
		string,
		unknown
	>;
	const paginationOptions: IPaginationOptions = pick(req.query, PAGINATION);

	const { url, query, path } = req;

	const total = await totalCount("jobs");

	if (
		req.user!.roles.length == 1 &&
		req.user!.roles[0] === USER_ROLE.EMPLOYER
	) {
		const employer = await UserService.getSingleUserService({
			email: req.user?.email,
		});
		filterableOptions.createdBy = employer._id;
	}

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
});

/*
===========================
- GET 
- /jobs/:id
===========================
*/
const getSingleJobController = catchAsync(
	async (req: Request, res: Response) => {
		const jobId = req.params.id;
		const job = await JobService.getSingleJobService(jobId);

		sendResponse<IJobPostSchema>(res, {
			statusCode: httpStatus.OK,
			success: true,
			status: ResponseStatus.SUCCESS,
			data: job,
		});
	}
);

/*
===========================
- PATCH 
- /jobs/:id
===========================
*/
const updateJobController = catchAsync(async (req: Request, res: Response) => {
	const jobId = req.params.id;
	const user = req.user as JwtPayload;
	const userId = user?.userId;

	const updatedJob = await JobService.updateJobService(jobId, req.body, userId);

	sendResponse<IJobPostSchema>(res, {
		statusCode: httpStatus.OK,
		success: true,
		status: ResponseStatus.SUCCESS,
		message: "Job updated successfully",
		data: updatedJob,
	});
});

/*
===========================
- DELETE 
- /jobs/:id
===========================
*/
const deleteJobController = catchAsync(async (req: Request, res: Response) => {
	const jobId = req.params.id;
	const user = req.user as JwtPayload;
	const userId = user?.userId;

	await JobService.deleteJobService(jobId, userId);

	sendResponse(res, {
		statusCode: httpStatus.OK,
		success: true,
		status: ResponseStatus.SUCCESS,
		message: "Job deleted successfully",
	});
});

export const JobPostController = {
	createJobController,
	getAllJobsController,
	getSingleJobController,
	updateJobController,
	deleteJobController,
};
