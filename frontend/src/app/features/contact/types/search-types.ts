import { PhoneSearchResponse } from './response-types'

export interface ContactSearchItem {
  id: number
  name: string
  age: number | null
  phones: PhoneSearchResponse[]
}

export interface ContactSearchResponse {
  contacts: ContactSearchItem[]
  message: string
  errors: boolean
  action_code: number
}
export interface ContactSearchParams {
  name?: string
  phone?: string
}

export interface PhoneUpdateDTO {
  id?: number
  phone: string
}

export interface ContactUpdateDTO {
  id: number
  name: string
  age: number
  phones: PhoneUpdateDTO[]
}
