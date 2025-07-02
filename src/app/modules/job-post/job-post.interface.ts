import { Model, ObjectId } from "mongoose";

export type IJobPostSchema = {
	_id: ObjectId;
	title: string;
	description: string;
	companyName: string;
	location: string;
	jobType: string;
	salaryRange?: {
		min: number;
		max: number;
	};
	skills?: string[];
	createdBy: ObjectId;
	jobStatus: string;
	createdAt: Date;
	updatedAt: Date;
};

export type IJobPostFilterableOptions = {
	title?: string;
	description?: string;
	searchTerm?: string;
	location?: string;
	jobType?: string;
	salaryRange?: {
		min: number;
		max: number;
	};
	skills?: string[];
	createdAt?: Date;
};

export type JobPostModel = Model<IJobPostSchema, Record<string, unknown>>;
