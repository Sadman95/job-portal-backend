import { Options } from "../types";
import { generateQueryString } from "../utils/generate-query-string";
import { calculatePagination } from "./pagination-helpers";

export const queryHelper = (options: Options) => {
	const {
		paginationOptions,
		url,
		query,
		path,
		total,
	} = options;
	const { page, limit, skip, sortBy, sortOrder } =
		calculatePagination(paginationOptions);


	const sortConditions: Record<string, unknown> = {};


	if (sortBy && sortOrder) {
		sortConditions[sortBy] = sortOrder;
	}


	/*pagination & links*/
	const totalPages = Math.ceil(total / limit);

	let pagination = {
		current: Number(page),
		totalPages,
		prev: 0,
		next: 0,
	};

	if (Number(page) - 1 > 0) {
		pagination = {
			...pagination,
			prev: Number(page) - 1,
		};
	}
	if (Number(page) < totalPages) pagination.next = Number(page) + 1;

	const links = {
		self: url,
		prev: "",
		next: "",
	};

	if (pagination.prev) {
		const queryString = generateQueryString({
			...query,
			page: pagination.prev,
		});
		links.prev = `${path}?${queryString}`;
	}

	if (pagination.next) {
		const queryString = generateQueryString({
			...query,
			page: pagination.next,
		});
		links.next = `${path}?${queryString}`;
	}

	return {
		sortConditions,
		pagination,
		links,
		skip,
		limit,
	};
};
