import { Contact } from '@/app/types/contact'

export interface ContactResponse {
  contact: Contact
  message: string
  errors: boolean | string
  action_code: number
}
