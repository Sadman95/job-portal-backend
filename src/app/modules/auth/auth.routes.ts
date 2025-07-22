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
	.get("/logout", checkAuth, AuthController.logoutController)
	.patch("/enable-2fa", checkAuth, AuthController.enable2faController)
	.patch(
		"/verify-2fa",
		validateRequest(AuthValidation.verify2faZodValidation),
		AuthController.verify2faController
	)
	.patch(
		"/validate-2fa",
		checkAuth,
		validateRequest(AuthValidation.validate2faZodValidation),
		AuthController.validate2faController
	)
	.patch("/disable-2fa", checkAuth, AuthController.disable2faController);

export const AuthRoutes = router;
