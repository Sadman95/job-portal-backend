import { Schema, model } from "mongoose";
import { IJobApplication } from "./job-application.interface";

const JobApplicationSchema = new Schema<IJobApplication>({
	jobId: { type: Schema.Types.ObjectId, ref: "JobPost", required: true },
	candidateId: { type: Schema.Types.ObjectId, ref: "User", required: true },
	coverLetter: { type: String },
	resume: { type: String },
	appliedAt: { type: Date, default: Date.now },
	updatedAt: { type: Date, default: Date.now },
});

export const JobApplication = model<IJobApplication>(
	"Job-applications",
	JobApplicationSchema
);
