import httpStatus from "http-status";
import { Types } from "mongoose";
import ApiError from "../../../errors/api-error";
import { QueryOptions } from "../../../types";
import { IJobApplication } from "./job-application.interface";
import { JobApplication } from "./job-application.model";

/*
 * Service
 */

/*
================
- POST 
- /auth/signup
================
*/

const applyToJobService = async (
	payload: IJobApplication
): Promise<IJobApplication> => {
	const { jobId, candidateId } = payload;

	if (!Types.ObjectId.isValid(jobId) || !Types.ObjectId.isValid(candidateId)) {
		throw new ApiError(httpStatus.BAD_REQUEST, "Invalid job or candidate ID");
	}

	// Check for duplicate application
	const alreadyApplied = await JobApplication.findOne({ jobId, candidateId });
	if (alreadyApplied) {
		throw new ApiError(httpStatus.CONFLICT, "Already applied to this job");
	}

	const result = await JobApplication.create({
		...payload,
		appliedAt: new Date(),
	});

	return result;
};

/*
==============================
- GET 
- /job-applications
==============================
*/
const getJobApplicationsService = async (
	options: QueryOptions & {
		searchTerm?: string;
		rootSearchFields?: string[];
		jobPostSearchFields?: string[];
	}
): Promise<IJobApplication[] | null> => {
	const {
		filterConditions,
		sortConditions,
		skip,
		limit,
		searchTerm,
		rootSearchFields = [],
		jobPostSearchFields = [],
	} = options;

	const pipeline: any[] = [];

	if (searchTerm && rootSearchFields.length > 0) {
		pipeline.push({
			$match: {
				$or: rootSearchFields.map((field) => ({
					[field]: { $regex: searchTerm, $options: "i" },
				})),
			},
		});
	}

	if (filterConditions && Object.keys(filterConditions).length > 0) {
		pipeline.push({ $match: filterConditions });
	}

	pipeline.push(
		{
			$lookup: {
				from: "job-posts",
				localField: "jobId",
				foreignField: "_id",
				as: "jobPost",
			},
		},
		{ $unwind: "$jobPost" }
	);

	if (searchTerm && jobPostSearchFields.length > 0) {
		pipeline.push({
			$match: {
				$or: jobPostSearchFields.map((field) => ({
					[field]: { $regex: searchTerm, $options: "i" },
				})),
			},
		});
	}

	pipeline.push(
		{ $sort: sortConditions },
		{ $skip: Number(skip) },
		{ $limit: Number(limit) },
		{ $project: { __v: 0 } }
	);

	const results = await JobApplication.aggregate(pipeline);
	return results;
};

export const JobApplicationService = {
	applyToJobService,
	getJobApplicationsService,
};
