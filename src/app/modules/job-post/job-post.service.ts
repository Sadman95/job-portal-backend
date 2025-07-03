import httpStatus from "http-status";
import { Types } from "mongoose";
import ApiError from "../../../errors/api-error";
import { QueryOptions } from "../../../types";
import { JobPost } from "./job-post,model";
import { IJobPostSchema } from "./job-post.interface";

/*
 * Service
 */

/*
==============================
- POST 
- /jobs
==============================
*/
const createJobService = async (
	payload: IJobPostSchema
): Promise<IJobPostSchema> => {
	const job = await JobPost.create(payload);
	return job;
};

/*
==============================
- GET 
- /jobs
==============================
*/
const getAllJobsService = async (
	options: QueryOptions
): Promise<IJobPostSchema[] | null> => {
	const { filterConditions, sortConditions, skip, limit } = options;

	const results = await JobPost.aggregate([
		{
			$match: filterConditions,
		},
		{
			$sort: sortConditions,
		},
		{
			$skip: Number(skip),
		},
		{
			$limit: Number(limit),
		},
		{
			$lookup: {
				from: "users",
				localField: "createdBy",
				foreignField: "_id",
				as: "employerInfo",
				pipeline: [
					{
						$project: {
							_id: 0,
							username: 1,
							email: 1,
						},
					},
				],
			},
		},
		{
			$unwind: "$employerInfo",
		},
		{
			$project: {
				__v: 0,
			},
		},
	]);

	return results;
};

/*
==============================
- GET 
- /jobs/:id
==============================
*/
const getSingleJobService = async (id: string): Promise<IJobPostSchema> => {
	const job = await JobPost.findById(id);
	if (!job) {
		throw new ApiError(httpStatus.NOT_FOUND, "Job not found");
	}

	return job;
};

/*
==============================
- PATCH 
- /jobs/:id
==============================
*/
const updateJobService = async (
	jobId: string,
	payload: Partial<IJobPostSchema>,
	userId: Types.ObjectId
): Promise<IJobPostSchema> => {
	const job = await JobPost.findById(jobId);

	if (!job) {
		throw new ApiError(httpStatus.NOT_FOUND, "Job not found");
	}

	Object.assign(job, payload);
	await job.save();

	return job;
};

/*
==============================
- DELETE 
- /jobs/:id
==============================
*/
const deleteJobService = async (
	jobId: string,
	userId: Types.ObjectId
): Promise<void> => {
	const job = await JobPost.findById(jobId);

	if (!job) {
		throw new ApiError(httpStatus.NOT_FOUND, "Job not found");
	}

	await JobPost.findByIdAndDelete(jobId);
};

export const JobService = {
	createJobService,
	getAllJobsService,
	getSingleJobService,
	updateJobService,
	deleteJobService,
};
