import { z } from "zod";

/**
 * Job Application Zod Schema
 * - jobId → from req.params
 * - candidateId → from req.user (excluded from Zod validation)
 * - coverLetter → optional
 * - resume → optional file
 */
const applyToJobZodSchema = z.object({
	params: z.object({
		jobId: z.string({
			required_error: "Job ID is required in params",
		}),
	}),

	body: z.object({
		coverLetter: z.string().optional(),
	}),

	file: z
		.object({
			originalname: z.string(),
			mimetype: z
				.string()
				.refine(
					(val) =>
						[
							"application/pdf",
							"application/msword",
							"application/vnd.openxmlformats-officedocument.wordprocessingml.document",
						].includes(val),
					{
						message: "Invalid file type. Allowed: PDF, DOC, DOCX",
					}
				),
			size: z.number().max(5 * 1024 * 1024, {
				message: "File size should not exceed 5MB",
			}),
		})
		.optional(),
});

export const JobApplicationValidation = {
	applyToJobZodSchema,
};
