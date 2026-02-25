import { httpClient } from '@/app/core/api/http-client'
import { API_ENDPOINTS } from '@/app/shared/constants/api-endpoints'
import { Contact } from '@/app/types/contact'
import { normalizePhone } from '@/utils/phone-validator'
import { ContactResponse, ContactUpdateReponse } from '../types/response-types'
import {
  ContactSearchParams,
  ContactSearchResponse,
  ContactUpdateDTO
} from '../types/search-types'

export const contactService = {
  register: async (contact: Contact): Promise<ContactResponse> => {
    const normalizedPhones =
      contact.phones?.map((p) => ({
        ...p,
        numero: normalizePhone(p.numero)
      })) ?? null

    const payload = { ...contact, phones: normalizedPhones }

    const { data } = await httpClient.post(
      API_ENDPOINTS.CONTACT.REGISTER,
      payload
    )

    return data
  },

  search: async (
    params: ContactSearchParams
  ): Promise<ContactSearchResponse> => {
    const phone = normalizePhone(params.phone) ?? null

    const payload = {
      name: params.name || null,
      phone
    }

    const { data } = await httpClient.get(API_ENDPOINTS.CONTACT.SEARCH, {
      params: payload
    })
    return data
  },

  update: async (
    id: number,
    contact: ContactUpdateDTO
  ): Promise<ContactUpdateReponse> => {
    const { data } = await httpClient.put(
      `${API_ENDPOINTS.CONTACT.UPDATE}/${id}`,
      contact
    )

    return data
  },

  remove: async (id: number): Promise<ContactResponse> => {
    const { data } = await httpClient.delete(
      `${API_ENDPOINTS.CONTACT.DELETE}/${id}`
    )
    return data
  }
}
