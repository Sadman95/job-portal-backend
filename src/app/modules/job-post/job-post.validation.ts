import { z } from "zod";

// Predefined enum list for job types
const jobTypes = ["full-time", "part-time", "contract", "internship"] as const;

const createJobPostZodSchema = z.object({
	body: z.object({
		title: z.string({ required_error: "Job title is required" }),
		description: z
			.string({ required_error: "Job description is required" })
			.min(10, { message: "Description should be at least 10 characters" }),
		companyName: z.string({ required_error: "Company name is required" }),
		location: z.string({ required_error: "Location is required" }),
		jobType: z.enum([...jobTypes] as [string, ...string[]], {
			required_error: "Job type is required",
		}),
		salaryRange: z
			.object({
				min: z
					.number()
					.min(0, { message: "Minimum salary must be non-negative" }),
				max: z
					.number()
					.min(0, { message: "Maximum salary must be non-negative" }),
			})
			.refine((data: { min: number; max: number }) => data.max >= data.min, {
				message: "Maximum must be greater than or equal to minimum salary",
				path: ["max"],
			})
			.optional(),
		skills: z
			.array(z.string().min(1, { message: "Skill cannot be empty" }))
			.min(1, { message: "At least one skill is required" })
			.optional(),
	}),
});

// 👇 Update schema — all fields optional, but validated if provided
const updateJobPostZodSchema = z.object({
	body: z.object({
		title: z.string().optional(),
		description: z.string().min(10).optional(),
		companyName: z.string().optional(),
		location: z.string().optional(),
		jobType: z.enum([...jobTypes] as [string, ...string[]]).optional(),
		salaryRange: z
			.object({
				min: z.number().min(0),
				max: z.number().min(0),
			})
			.refine((data) => data.max >= data.min, {
				message: "Maximum must be greater than or equal to minimum salary",
				path: ["max"],
			})
			.optional(),
		skills: z.array(z.string().min(1)).optional(),
	}),
});

export const JobPostValidation = {
	createJobPostZodSchema,
	updateJobPostZodSchema,
};
