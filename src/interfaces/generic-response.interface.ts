import { IMeta } from './meta.interface'

export type IGenericResponse<T> = {
  meta?: IMeta
  data?: T
  links?: { [key: string]: string }
}
