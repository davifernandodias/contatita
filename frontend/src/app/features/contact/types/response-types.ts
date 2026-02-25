import { Contact } from '@/app/types/contact'

export interface ContactResponse {
  contact: Contact
  message: string
  errors: boolean | string
  action_code: number
}

export interface PhoneSearchResponse {
  id: number
  phone: string
}

export interface ContactUpdateReponse {
  message: string
  action_code: number
}
