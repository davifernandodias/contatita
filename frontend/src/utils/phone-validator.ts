import { parsePhoneNumberFromString } from 'libphonenumber-js'

export function normalizePhone(phone?: string | null): string | null {
  if (!phone) return null

  const parsed = parsePhoneNumberFromString(phone)

  if (!parsed || !parsed.isValid()) return null

  return parsed.number
}

export const validatePhones = (
  phones: { numero: string }[]
): true | { index: number; message: string } => {
  for (let i = 0; i < phones.length; i++) {
    const phone = phones[i]
    if (!phone?.numero) continue

    const parsed = parsePhoneNumberFromString(phone.numero)

    if (!parsed) continue

    const national = parsed.nationalNumber
    if (!national || national.length === 0) continue

    if (!parsed.isValid()) {
      return {
        index: i,
        message: 'Informe o número completo ou deixe em branco'
      }
    }
  }

  return true
}
