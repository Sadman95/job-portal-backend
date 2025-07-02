import ApiError from "../../../errors/api-error";
import httpStatus from "http-status";
import { Types } from "mongoose";
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

export const JobApplicationService = {
	applyToJobService,
};
