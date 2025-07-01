import { Response } from 'express'
import { IMeta } from '../interfaces/meta.interface'
import { ResponseStatus } from '../enums'

type IApiResponse<T> = {
  statusCode: number
  status: ResponseStatus
  success: boolean
  message?: string
  meta?: IMeta
  data?: T
  links?: object
}

const sendResponse = <T>(res: Response, data: IApiResponse<T>): void => {
  const responseData: IApiResponse<T> = {
    statusCode: data.statusCode,
    success: data.success,
    status: data.status,
    message: data.message,
    meta: data.meta,
    data: data.data,
    links: data.links,
  }
  res.status(responseData.statusCode).json(responseData)
}

export default sendResponse
