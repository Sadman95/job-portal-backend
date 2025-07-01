import { Router } from "express";
import { AuthRoutes } from "../modules/auth/auth.routes";

export type IRoute = {
	path: string;
	router: Router;
};

export const routes: IRoute[] = [
	{
		path: "/auth",
		router: AuthRoutes,
	},
];
