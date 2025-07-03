export type IMeta = {
	pagination?: {
		current?: number;
		totalPages?: number;
		prev?: number | null | undefined;
		next?: number | null | undefined;
	};
	limit: number;
	total?: number;
};
