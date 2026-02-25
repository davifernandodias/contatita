import { Request, Response } from 'express'
import { db } from '../db/db'
import { contactsTable } from 'db/schema'
import { phonesTable } from 'db/schema'
import { createContactSchema } from 'validator/zod-schema'
import { parsePhoneNumberFromString } from 'libphonenumber-js'
import { ZodError } from 'zod'

export const createContact = async (req: Request, res: Response) => {
  try {
    const { name, age, phones } = req.body

    createContactSchema.parse({ name, age })

    let newPhones: any = null

    const newContact = await db.transaction(async (tx) => {
      const [contact] = await tx
        .insert(contactsTable)
        .values({ id: Date.now(), name, age })
        .returning()

      if (phones && phones.length > 0) {
        const validPhones = phones
          .map((phone: { numero: string }, index: number) => {
            const parsed = parsePhoneNumberFromString(phone.numero)

            if (parsed && parsed.isValid()) {
              return {
                contactId: contact.id,
                id: index + 1,
                number: parsed.number
              }
            }

            return null
          })
          .filter(Boolean)

        if (validPhones.length > 0) {
          newPhones = await tx.insert(phonesTable).values(validPhones)
        }
      }

      return contact
    })

    res.status(201).json({
      contact: {
        name: newContact.name,
        age: newContact.age,
        phones: newPhones ?? null
      },
      message: 'Contato criado com sucesso.',
      errors: false,
      action_code: 1
    })
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({
        contact: { name: null, age: null, phones: null },
        message: 'Dados inválidos',
        errors: error.issues.map((e) => ({
          field: e.path.join('.'),
          message: e.message
        })),
        action_code: 0
      })
    }

    res.status(500).json({
      contact: { name: null, age: null, phones: null },
      message: 'Erro ao criar contato',
      errors: error instanceof Error ? error.message : String(error),
      action_code: 0
    })
  }
}

export const updateContact = (req: Request, res: Response) => {
  res.status(200).json({
    message: 'Contato atualizado com sucesso'
  })
}

export const deleteContact = (req: Request, res: Response) => {
  res.status(200).json({
    message: 'Contato deletado com sucesso'
  })
}

export const searchContacts = (req: Request, res: Response) => {
  res.status(200).json({
    message: 'Busca de contatos realizada com sucesso'
  })
}
