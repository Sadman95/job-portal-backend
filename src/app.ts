import express, { Application, NextFunction, Request, Response } from "express";
import globalErrorHandler from "./app/middlewares/global-error-handler";
import notFoundHandler from "./app/middlewares/not-found-handler";
import { RootRoutes } from "./app/routes";
import applyMiddlewares from "./middleware";

const app: Application = express();
applyMiddlewares(app);

//api-spec-docs
// const yamlFilePath = path.join(__dirname, "../swagger.yaml");
// const swaggerDocument = YAML.load(yamlFilePath);

app.get("/", (_req: Request, res: Response) => {
	res.redirect("/api/v1/health");
});
//health
app.get(
	"/api/v1/health",
	(_req: Request, res: Response, _next: NextFunction) => {
		const healthcheck = {
			uptime: process.uptime(),
			message: "OK",
			timestamp: Date.now(),
		};
		try {
			res.send(healthcheck);
		} catch (error: unknown) {
			healthcheck.message = (error as Error).message;
			res.status(503).send();
		}
	}
);

// @ts-ignore
// app.use("/api/v1/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use("/api/v1", RootRoutes);

//global error handler
app.use(globalErrorHandler);

//not found handler
app.use(notFoundHandler);

export default app;
