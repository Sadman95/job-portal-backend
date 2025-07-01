import {
  IPaginationData,
  IPaginationOptions,
} from '../interfaces/pagination.interface'

const calculatePagination = (options: IPaginationOptions): IPaginationData => {
  const page = options.page ?? 1
  const limit = options.limit ?? 10
  const skip = (page - 1) * limit
  const sortBy = options.sortBy ?? 'createdAt'
  const sortOrder = options.sortOrder ?? 'desc'
  return {
    page,
    limit,
    skip,
    sortBy,
    sortOrder,
  }
}

export { calculatePagination }
