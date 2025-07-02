import http from "http";
import mongoose from "mongoose";
import app from "./app";
import config from "./config";
import socket from "./lib/socket";
import { logger } from "./shared/logger";
export const httpServer = http.createServer(app);

//handle Uncaught exceptions
process.on("uncaughtException", (error) => {
	logger.error(error);
	// console.error(error)
	process.exit(1);
});

(async function bootstrap() {
	try {
		await mongoose.connect(config.db.uri!, { dbName: config.db.name });
		console.log("DATABASE CONNECTION SUCCESSFUL");

		socket(httpServer); // Init socket first
		httpServer.listen(config.port, () => {
			console.log(`App server listening on port ${config.port}`);
		});
	} catch (error: any) {
		logger.error("Failed to connect to DB:", error.message);
		process.exit(1);
	}
})();

//handle Unhandledrejection: Gracefully off the server
process.on("unhandledRejection", (error) => {
	if (httpServer) {
		httpServer.close(() => {
			// logger.error(error)
			console.error(error);
			process.exit(1);
		});
	} else {
		process.exit(1);
	}
});
//SIGTERM detection
process.on("SIGTERM", () => {
	// logger.info('SIGTERM is received')
	console.log("SIGTERM is received");
	if (httpServer) {
		httpServer.close();
	}
});
