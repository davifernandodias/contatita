import { parsePhoneNumberFromString } from 'libphonenumber-js'

export function normalizePhone(phone?: string | null): string | null {
  if (!phone) return null

  const parsed = parsePhoneNumberFromString(phone)

  if (!parsed || !parsed.isValid()) {
    return null
  }

  return parsed.number
}
