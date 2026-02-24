const API_BASE_URL = import.meta.env.VITE_API_URL

export const API_ENDPOINTS = {
  CONTACT: {
    REGISTER: `${API_BASE_URL}/contact/register`,
    SEARCH: `${API_BASE_URL}/contact/search`
  }
}
