import express, { Router } from "express";
import { USER_ROLE } from "../../../enums";
import { authenticateRoles, checkAuth } from "../../middlewares/check-auth";
import validateRequest from "../../middlewares/validate-request";
import { JobPostController } from "./job-post.controller";
import { JobPostValidation } from "./job-post.validation";

const router: Router = express.Router();

router
	.get(
		"/",
		checkAuth,
		authenticateRoles(USER_ROLE.EMPLOYER, USER_ROLE.CANDIDATE, USER_ROLE.ADMIN),
		JobPostController.getAllJobsController
	)
	.get("/:id", JobPostController.getSingleJobController)
	.post(
		"/",
		checkAuth,
		authenticateRoles(USER_ROLE.EMPLOYER),
		validateRequest(JobPostValidation.createJobPostZodSchema),
		JobPostController.createJobController
	)
	.patch(
		"/:id",
		checkAuth,
		authenticateRoles(USER_ROLE.EMPLOYER),
		validateRequest(JobPostValidation.updateJobPostZodSchema),
		JobPostController.updateJobController
	)
	.delete(
		"/:id",
		checkAuth,
		authenticateRoles(USER_ROLE.EMPLOYER),
		JobPostController.deleteJobController
	);

export const JobPostRoutes = router;
