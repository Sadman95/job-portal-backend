import { Schema, model, Document, Types } from "mongoose";

export interface ITwoFA extends Document {
	userId: Types.ObjectId;
	base32_secret: string;
	auth_url: string;
	enabled: boolean;
	verified: boolean;
	createdAt: Date;
	updatedAt: Date;
}

const TwoFASchema = new Schema<ITwoFA>(
	{
		userId: {
			type: Schema.Types.ObjectId,
			ref: "User",
			required: true,
			unique: true,
		},
		base32_secret: { type: String, required: true },
		auth_url: { type: String, required: true },
		enabled: { type: Boolean, default: false },
		verified: { type: Boolean, default: false },
	},
	{ timestamps: true }
);

TwoFASchema.index({ userId: 1 }, { unique: true });

export const TwoFAModel = model<ITwoFA>("TwoFA", TwoFASchema);
