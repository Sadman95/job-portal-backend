export type IPaginationOptions = {
  page?: number
  limit?: number
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

export type IPaginationData = Required<IPaginationOptions> & {
  skip: number
}
