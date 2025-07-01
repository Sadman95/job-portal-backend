export type IMeta = {
	pagination: {
		current: number;
		totalPages: number;
		prev: number;
		next: number;
	};
	limit?: number;
	total?: number;
};
