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
import { JobService } from "../job-post/job-post.service";
import { UserService } from "../user/user.service";
import {
	jobApplicationFilterableFields,
	jobApplicationSearchableFields,
} from "./job-application.constants";
import { IJobApplication } from "./job-application.interface";
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
		const filterableOptions = pick(req.query, jobApplicationFilterableFields);
		const paginationOptions: IPaginationOptions = pick(req.query, PAGINATION);

		const { url, query, path } = req;

		const total = await totalCount("job-applications");

		const options = {
			filterableOptions,
			paginationOptions,
			searchableFields: jobApplicationSearchableFields,
			url,
			query,
			path,
			total,
		};

		const { pagination, links, ...restOptions } = queryHelper(options);

		const result = await JobApplicationService.getJobApplicationsService({
			...restOptions,
			rootSearchFields: ["candidateId"],
			jobPostSearchFields: [
				"jobPost._id",
				"jobPost.title",
				"jobPost.description",
				"jobPost.skills",
			],
		});

		if (!result) {
			throw new ApiError(httpStatus.NOT_FOUND, "No job application found");
		}

		sendResponse<IJobApplication[]>(res, {
			statusCode: httpStatus.OK,
			success: true,
			status: ResponseStatus.SUCCESS,
			meta: {
				pagination,
				limit: restOptions.limit,
				total,
			},
			links,
			data: result,
		});
	}
);

export const JobApplicationController = {
	applyJobApplicationController,
	getAllJobApplicationsController,
};
