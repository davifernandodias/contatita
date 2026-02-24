import { httpClient } from '@/app/core/api/http-client'
import { API_ENDPOINTS } from '@/app/shared/constants/api-endpoints'
import { Contact } from '@/app/types/contact'
import { ContactSearchParams } from '../types/contact-search-params'

export const contactService = {
  register: async (contact: Contact): Promise<Contact> => {
    const { data } = await httpClient.post(
      API_ENDPOINTS.CONTACT.REGISTER,
      contact
    )
    return data
  },

  search: async (params: ContactSearchParams): Promise<Contact[]> => {
    const { data } = await httpClient.get(API_ENDPOINTS.CONTACT.SEARCH, {
      params
    })
    return data
  },

  update: async (id: number, contact: Contact): Promise<Contact> => {
    const { data } = await httpClient.put(
      `${API_ENDPOINTS.CONTACT.REGISTER}/${id}`,
      contact
    )
    return data
  },

  remove: async (id: number): Promise<void> => {
    await httpClient.delete(`${API_ENDPOINTS.CONTACT.REGISTER}/${id}`)
  }
}
