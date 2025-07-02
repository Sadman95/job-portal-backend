import mongoose from "mongoose";

/**
 * Counts documents from a MongoDB collection efficiently without relying on Mongoose models.
 *
 * @param collectionName - The name of the MongoDB collection
 * @param filter - Optional filter to match documents
 * @returns Number of matching documents
 */

export const totalCount = async (
	collectionName: string,
	filter: Record<string, any> = {}
): Promise<number> => {
	try {
		const db = mongoose.connection?.db;

		if (!db) {
			throw new Error(
				"MongoDB connection not initialized or db not available."
			);
		}

		const collection = db.collection(collectionName);
		const count = await collection.countDocuments(filter);
		return count;
	} catch (error) {
		console.error(`Error in getCollectionCount:`, error);
		throw error;
	}
};
