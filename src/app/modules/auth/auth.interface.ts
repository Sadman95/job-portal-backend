import { USER_ROLE } from "../../../enums";

export type ILoginUser = {
	email: string;
	password: string;
};

export type IRegUser = ILoginUser & {
	roles?: USER_ROLE[];
}

export type ILoginUserResponse = {
	accessToken: string;
	refreshToken?: string;
};

export type IRefreshTokenResponse = {
	accessToken: string;
};

export type IPasswordData = {
	oldPassword: string;
	newPassword: string;
};
