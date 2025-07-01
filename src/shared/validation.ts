import { z } from "zod";

export const imageFileSchema = z
	.instanceof(File, { message: "Thumbnail must be a file" })
	.refine((file) => file.type.startsWith("image/"), {
		message: "Thumbnail must be an image file",
	});