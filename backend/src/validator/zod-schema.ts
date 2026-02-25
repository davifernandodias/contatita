import * as z from 'zod'

export const createContactSchema = z.object({
  name: z.string().min(1, 'O nome é obrigatório'),
  age: z.number().int().positive('A idade deve ser um número inteiro positivo')
})

export const searchContactSchema = z.object({
  name: z.string().optional(),
  phone: z.string().optional()
})
