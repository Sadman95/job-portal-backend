import express from "express";
import { USER_ROLE } from "../../../enums";
import { authenticateRoles, checkAuth } from "../../middlewares/check-auth";
import { upload } from "../../middlewares/upload";
import validateRequest from "../../middlewares/validate-request";
import { JobApplicationController } from "./job-application.controller";
import { JobApplicationValidation } from "./job-application.validation";

const router = express.Router();

/**
 * @route   POST /api/v1/job-applications
 * @desc    Apply to a job
 * @access  Candidate (Authenticated)
 */
router
	.post(
		"/:jobId",
		checkAuth,
		upload.single("resume"),
		authenticateRoles(USER_ROLE.CANDIDATE),
		validateRequest(JobApplicationValidation.applyToJobZodSchema),
		JobApplicationController.applyJobApplicationController
	)
	.get(
		"/",
		checkAuth,
		authenticateRoles(USER_ROLE.ADMIN),
		JobApplicationController.getAllJobApplicationsController
	);

export const JobApplicationRoutes = router;
