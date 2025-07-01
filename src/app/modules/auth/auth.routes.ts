import express, { Router } from "express";
import { AuthController } from "./auth.controller";
import { AuthValidation } from "./auth.validation";
import validateRequest from "../../middlewares/validate-request";
import { checkAuth } from "../../middlewares/check-auth";

const router: Router = express.Router();

router
	.post(
		"/signup",
		validateRequest(AuthValidation.signupZodValidation),
		AuthController.signUpController
	)
	.post(
		"/login",
		validateRequest(AuthValidation.loginZodValidation),
		AuthController.loginController
	)
	.post(
		"/refreshToken",
		validateRequest(AuthValidation.refreshTokenZodValidation),
		AuthController.refreshTokenController
	)
	.get("/logout", checkAuth, AuthController.logoutController);

export const AuthRoutes = router;
