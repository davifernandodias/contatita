import { parsePhoneNumberFromString } from 'libphonenumber-js'

export function isValidInternationalPhone(phone: string): boolean {
  if (!phone) return false

  const parsed = parsePhoneNumberFromString(phone)

  return parsed ? parsed.isValid() : false
}
