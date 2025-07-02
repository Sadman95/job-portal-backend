import { Types } from "mongoose";

export interface IJobApplication {
	jobId: Types.ObjectId;
	candidateId: Types.ObjectId;
	coverLetter?: string;
	resume?: string;
	appliedAt?: Date;
	updatedAt?: Date;
}
