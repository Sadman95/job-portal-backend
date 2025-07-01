import { Socket } from "socket.io";
import { Server } from "http";


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

		// socket events here....
		
	});
};

export default socket;
