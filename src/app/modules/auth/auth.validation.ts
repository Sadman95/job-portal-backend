import { z } from "zod";
import { USER_ROLE } from "../../../enums";

/*
Schema validation -> register
*/
const signupZodValidation = z.object({
	body: z
		.object({
			email: z
				.string({
					required_error: "Email is required",
				})
				.email({
					message: "Please enter a valid email address",
				}),
			password: z.string({
				required_error: "Password is required",
			}),
			confirmPassword: z.string({
				required_error: "Confirm password is required",
			}),
			roles: z
				.array(
					z.enum([USER_ROLE.ADMIN, USER_ROLE.CANDIDATE, USER_ROLE.EMPLOYER])
				)
				.default([USER_ROLE.CANDIDATE]),
		})
		.refine((data) => data.password === data.confirmPassword, {
			message: "Password doesn't match",
			path: ["confirmPassword"],
		}),
});

/*
Schema validation -> login
*/
const loginZodValidation = z.object({
	body: z.object({
		email: z
			.string({
				required_error: "Email is required",
			})
			.email({
				message: "Please enter a valid email address",
			}),
		password: z.string({
			required_error: "Password is required",
		}),
	}),
});

/*
Schema validation -> login
*/
const refreshTokenZodValidation = z.object({
	cookies: z.object({
		refresh_token: z.string({
			required_error: "Refresh token is required",
		}),
	}),
});

/*
Schema validation -> change password
 */
const forgetPasswordValidation = z.object({
	body: z.object({
		newPassword: z.string({
			required_error: "New password is required",
		}),
	}),
});

/*
Schema validation -> change password
 */
const changePasswordValidation = z.object({
	body: z.object({
		oldPassword: z.string({
			required_error: "Old password is required",
		}),
		newPassword: z.string({
			required_error: "New password is required",
		}),
	}),
});

export const AuthValidation = {
	loginZodValidation,
	refreshTokenZodValidation,
	changePasswordValidation,
	signupZodValidation,
	forgetPasswordValidation,
};
