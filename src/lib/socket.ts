import { Server } from "http";
import { Socket } from "socket.io";

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
	});

	return {
		io,
		connectedUsers,
	};
};

export default socket;
