import { IPaginationOptions } from "../interfaces/pagination.interface";
import { generateQueryString } from "../utils/generate-query-string";
import { calculatePagination } from "./pagination-helpers";

// Pagination Input Options
export interface PaginationMeta {
	current: number;
	totalPages: number;
	prev?: number;
	next?: number;
}

// Main Return Type
export interface QueryHelperResult {
	filterConditions: Record<string, unknown>;
	sortConditions: Record<string, 1 | -1>;
	pagination: PaginationMeta;
	links: Record<string, string>;
	skip: number;
	limit: number;
}

// Input Options for the Helper
export interface QueryHelperOptions {
	filterableOptions: Record<string, any>;
	paginationOptions: IPaginationOptions;
	searchableFields: string[];
	url: string;
	query: Record<string, any>;
	path: string;
	total: number;
}

export const queryHelper = (options: QueryHelperOptions): QueryHelperResult => {
	const {
		filterableOptions,
		paginationOptions,
		searchableFields,
		url,
		query,
		path,
		total,
	} = options;

	let { searchTerm, ...filtersData } = filterableOptions;

	const { page, limit, skip, sortBy, sortOrder } =
		calculatePagination(paginationOptions);

	const andConditions: Record<string, unknown>[] = [];
	const sortConditions: Record<string, 1 | -1> = {};

	if (searchTerm) {
		andConditions.push({
			$or: searchableFields.map((field) => ({
				[field]: {
					$regex: searchTerm,
					$options: "i",
				},
			})),
		});
	}

	if (Object.keys(filtersData).length) {
		Object.entries(filtersData).forEach(([field, value]) => {
			andConditions.push({ [field]: value });
		});
	}

	if (sortBy && sortOrder) {
		sortConditions[sortBy] = sortOrder == "asc" ? 1 : -1;
	}

	const filterConditions =
		andConditions.length > 0 ? { $and: andConditions } : {};

	const totalPages = Math.ceil(total / limit);
	const pagination: PaginationMeta = {
		current: page,
		totalPages,
	};

	if (page - 1 > 0) pagination.prev = page - 1;
	if (page < totalPages) pagination.next = page + 1;

	const links: Record<string, string> = {
		self: url,
	};

	if (pagination.prev) {
		links.prev = `${path}?${generateQueryString({
			...query,
			page: pagination.prev,
		})}`;
	}

	if (pagination.next) {
		links.next = `${path}?${generateQueryString({
			...query,
			page: pagination.next,
		})}`;
	}

	return {
		filterConditions,
		sortConditions,
		pagination,
		links,
		skip,
		limit,
	};
};
