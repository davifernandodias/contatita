import { Request, Response } from 'express'
import { db } from '../db/db'
import { contactsTable, phonesTable } from 'db/schema'
import { createContactSchema, searchContactSchema } from 'validator/zod-schema'
import { parsePhoneNumberFromString } from 'libphonenumber-js'
import { ZodError } from 'zod'
import { eq, or, inArray, and } from 'drizzle-orm'
import { saveLog } from 'utils/log-delete'

export const createContact = async (req: Request, res: Response) => {
  try {
    const { name, age, phones } = req.body

    createContactSchema.parse({ name, age })

    const newContact = await db.transaction(async (tx) => {
      const [contact] = await tx
        .insert(contactsTable)
        .values({ id: Date.now(), name, age })
        .returning()

      if (phones && phones.length > 0) {
        const validPhones = phones
          .map((phone: { numero: string }, index: number) => {
            if (!phone?.numero || typeof phone.numero !== 'string') {
              return null
            }

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
          await tx.insert(phonesTable).values(validPhones)
        }
      }

      return contact
    })

    res.status(201).json({
      contact: {
        name: newContact.name,
        age: newContact.age,
        phones: phones ?? null
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

export const searchContacts = async (req: Request, res: Response) => {
  try {
    const { name, phone } = req.query

    searchContactSchema.parse({
      name: name ? String(name) : undefined,
      phone: phone ? String(phone) : undefined
    })

    const resultSearch = await db.transaction(async (tx) => {
      const conditions = []

      if (name) {
        conditions.push(eq(contactsTable.name, String(name)))
      }

      if (phone) {
        conditions.push(eq(phonesTable.number, String(phone)))
      }

      return tx
        .select()
        .from(contactsTable)
        .leftJoin(phonesTable, eq(contactsTable.id, phonesTable.contactId))
        .where(conditions.length > 0 ? or(...conditions) : undefined)
    })

    if (!resultSearch || resultSearch.length === 0) {
      return res.status(200).json({
        contacts: {
          contact: {
            id: null,
            name: null,
            age: null,
            phones: []
          }
        },
        message:
          'Não encontramos nenhum contato com base na informação informada.',
        errors: false,
        action_code: 3
      })
    }

    const contactMap = new Map()

    resultSearch.forEach((row) => {
      const contact = row.Contato
      const phone = row.Telefone

      if (!contactMap.has(contact.id)) {
        contactMap.set(contact.id, {
          id: contact.id,
          name: contact.name,
          age: contact.age,
          phones: []
        })
      }

      if (phone) {
        contactMap.get(contact.id).phones.push({
          id: phone.id,
          phone: phone.number
        })
      }
    })

    const contacts = Array.from(contactMap.values())

    return res.status(200).json({
      contacts,
      message: 'Encontramos o contato com as seguintes informações.',
      errors: false,
      action_code: 1
    })
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({
        contacts: {
          contact: {
            id: null,
            name: null,
            age: null,
            phones: []
          }
        },
        message: 'Dados inválidos',
        errors: error.issues.map((e) => ({
          field: e.path.join('.'),
          message: e.message
        })),
        action_code: 0
      })
    }

    return res.status(500).json({
      contacts: {
        contact: {
          id: null,
          name: null,
          age: null,
          phones: []
        }
      },
      message: 'Erro ao buscar o contato',
      errors: error instanceof Error ? error.message : String(error),
      action_code: 0
    })
  }
}

export const updateContact = async (req: Request, res: Response) => {
  const { id } = req.params
  const { name, age, phones } = req.body

  if (!id) {
    return res.status(400).json({ message: 'id é obrigatório', action_code: 0 })
  }

  try {
    await db.transaction(async (tx) => {
      const contactId = Number(id)

      await tx
        .update(contactsTable)
        .set({
          name,
          age
        })
        .where(eq(contactsTable.id, contactId))

      const existingPhones = await tx
        .select()
        .from(phonesTable)
        .where(eq(phonesTable.contactId, contactId))

      const existingIds = existingPhones
        .map((p) => p.id)
        .filter((id): id is number => id !== null)

      const sentPhones = phones || []

      const sentIds = sentPhones
        .filter((p: any) => typeof p.id === 'number')
        .map((p: any) => p.id)

      const phonesToDelete = existingIds.filter(
        (existingId) => !sentIds.includes(existingId)
      )

      if (phonesToDelete.length > 0) {
        await tx
          .delete(phonesTable)
          .where(
            and(
              eq(phonesTable.contactId, contactId),
              inArray(phonesTable.id, phonesToDelete)
            )
          )
      }

      for (const phone of sentPhones.filter((p: any) => p.id)) {
        await tx
          .update(phonesTable)
          .set({ number: phone.phone })
          .where(
            and(
              eq(phonesTable.id, phone.id),
              eq(phonesTable.contactId, contactId)
            )
          )
      }

      const newPhones = sentPhones.filter((p: any) => !p.id)
      if (newPhones.length > 0) {
        await tx.insert(phonesTable).values(
          newPhones.map((p: any) => ({
            id: Date.now() + Math.random(),
            contactId,
            number: p.phone
          }))
        )
      }
    })

    return res.status(200).json({
      message: 'Contato atualizado com sucesso',
      action_code: 1
    })
  } catch (error) {
    console.error(error)

    return res.status(500).json({
      message: 'Erro ao atualizar contato',
      action_code: 0
    })
  }
}

export const deleteContact = async (req: Request, res: Response) => {
  const { id } = req.params

  try {
    if (!id) {
      return res.status(400).json({ message: 'id é obrigatório' })
    }

    await db.transaction(async (tx) => {
      const contact = await tx
        .select()
        .from(contactsTable)
        .where(eq(contactsTable.id, Number(id)))
        .limit(1)

      if (!contact.length) {
        throw new Error('Contato não encontrado')
      }

      const phones = await tx
        .select()
        .from(phonesTable)
        .where(eq(phonesTable.contactId, Number(id)))

      await tx.delete(phonesTable).where(eq(phonesTable.contactId, Number(id)))

      await tx.delete(contactsTable).where(eq(contactsTable.id, Number(id)))

      saveLog('DELETE_CONTACT', {
        contact: contact[0],
        phones,
        deletedAt: new Date()
      })
    })

    return res.status(200).json({
      message: 'Contato deletado com sucesso',
      action_code: 1
    })
  } catch (error) {
    console.error(error)

    return res.status(500).json({
      message: 'Erro ao deletar contato',
      action_code: 0
    })
  }
}
