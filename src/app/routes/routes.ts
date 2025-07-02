import { Router } from "express";
import { AuthRoutes } from "../modules/auth/auth.routes";
import { JobPostRoutes } from "../modules/job-post/job-post.routes";

export type IRoute = {
	path: string;
	router: Router;
};

export const routes: IRoute[] = [
	{
		path: "/auth",
		router: AuthRoutes,
	},
	{
		path: "/jobs",
		router: JobPostRoutes,
	},
];
