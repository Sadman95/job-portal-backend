// -------------- query helper types -------------- //
type SortOrder = "asc" | "desc";

export interface PaginationOptions {
	page?: number; // defaults to 1
	limit?: number; // defaults to 10
	sortBy?: string; // defaults to 'createdAt'
	sortOrder?: SortOrder; // defaults to 'desc'
}

export interface Result extends Partial<PaginationOptions> {
	filterConditions: Record<string, unknown>;
	sortConditions: Record<string, string>;
}

export interface Options {
	paginationOptions: PaginationOptions;
	url: string;
	query: Record<string, unknown>;
    path: string;
    total: number;
}


/* 
paginationOptions,
		  url,
		  query,
		  path,
*/