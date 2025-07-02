/* eslint-disable @typescript-eslint/no-this-alias */
import bcrypt from "bcrypt";
import { model, ObjectId, Schema } from "mongoose";
import config from "../../../config";
import { JOB_STATUS, JOB_TYPE, USER_ROLE } from "../../../enums";
import { IJobPostSchema, JobPostModel } from "./job-post.interface";

const JobPostSchema = new Schema<IJobPostSchema, JobPostModel>(
	{
		title: { type: String, required: true },
		description: { type: String, required: true },
		companyName: { type: String, required: true },
		location: { type: String, required: true },
		jobType: {
			type: String,
			enum: JOB_TYPE,
			default: JOB_TYPE.FULL_TIME,
			required: true,
		},
		salaryRange: {
			min: { type: Number },
			max: { type: Number },
		},
		skills: [{ type: String }],
		createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
		jobStatus: {
			type: String,
			enum: JOB_STATUS,
			default: JOB_STATUS.ACTIVE,
		},
	},
	{
		timestamps: true,
	}
);

export const JobPost = model<IJobPostSchema, JobPostModel>(
	"job-posts",
	JobPostSchema
);
