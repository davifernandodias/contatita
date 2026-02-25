import {
  bigint,
  integer,
  pgTable,
  primaryKey,
  varchar
} from 'drizzle-orm/pg-core'

export const contactsTable = pgTable('Contato', {
  id: bigint('ID', { mode: 'number' }).primaryKey(),
  name: varchar('NOME', { length: 100 }).notNull(),
  age: integer('IDADE')
})

export const phonesTable = pgTable(
  'Telefone',
  {
    id: bigint('ID', { mode: 'number' }),
    contactId: bigint('IDCONTATO', { mode: 'number' })
      .notNull()
      .references(() => contactsTable.id),
    number: varchar('NUMERO', { length: 16 }).notNull()
  },
  (table) => [primaryKey({ columns: [table.id, table.contactId] })]
)
