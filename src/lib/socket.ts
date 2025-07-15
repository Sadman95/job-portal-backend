import { Server } from "http";
import { Socket } from "socket.io";
import { JobService } from "../app/modules/job-post/job-post.service";
import ApiError from "../errors/api-error";

export const connectedUsers = new Map<string, string>(); // Map<userId, socketId>

/**
 * @summary Socket starter
 * @param {httpServer} server
 * */
const socket = (server: Server) => {
	const io = require("socket.io")(server, {
		cors: {
			origin: "*", // Replace with your frontend URL
			methods: ["GET", "POST", "DELETE", "PATCH"],
		},
	});

	// Namespace for notifications
	// Uncomment if you want to use a separate namespace for notifications
	// const notificationsNamespace = io.of("/notifications");

	io.on("connection", (socket: Socket) => {
		console.log("User connected");

		socket.on("disconnect", () => {
			console.log("User disconnected: " + socket.id);
		});

		// Listen for user identification
		socket.on("user-login", (userId: string) => {
			connectedUsers.set(userId, socket.id);
			console.log(`User ${userId} associated with socket ${socket.id}`);
		});

		// (fix): socket on job application
		socket.on("job-application", async (data: any) => {
			const job = await JobService.getSingleJobService(data.jobId);
			if (!job) {
				throw new ApiError(404, "Job not found");
			}

			const employerId = job.createdBy?.toString();
			const employerSocketId = connectedUsers.get(employerId);

			if (employerSocketId) {
				io.to(employerSocketId).emit("job:applied", {
					message: "New application received",
					jobTitle: job.title,
					candidateId: data.candidateId,
					jobId: job._id,
				});
			}
		});
	});

	return {
		io,
		connectedUsers,
	};
};

export default socket;
