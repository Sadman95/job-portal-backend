export type IMeta = {
	pagination: {
		current: number;
		totalPages: number;
		prev: number | null;
		next: number | null;
	};
	limit?: number;
	total?: number;
};
