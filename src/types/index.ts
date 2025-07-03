import { IMeta } from "../interfaces/meta.interface";
import { IPaginationOptions } from "../interfaces/pagination.interface";

export interface Result extends Partial<IPaginationOptions> {
	filterConditions: Record<string, unknown>;
	sortConditions: Record<string, string>;
}

export interface Options {
	paginationOptions: IPaginationOptions;
	url: string;
	query: Record<string, unknown>;
	path: string;
	total: number;
}

export interface QueryOptions {
	filterConditions: Record<string, unknown>;
	sortConditions: Record<string, 1 | -1>;
	skip: number;
	limit: number;
	pagination?: IPaginationOptions;
	total?: number;
}
/* 
paginationOptions,
		  url,
		  query,
		  path,
*/
