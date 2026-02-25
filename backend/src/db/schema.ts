import {
  bigint,
  integer,
  pgTable,
  primaryKey,
  varchar
} from 'drizzle-orm/pg-core'

export const contactsTable = pgTable('contacts', {
  id: bigint('id', { mode: 'number' }).primaryKey(),
  name: varchar('name', { length: 100 }).notNull(),
  age: integer('age')
})

export const phonesTable = pgTable(
  'phones',
  {
    id: bigint('id', { mode: 'number' }),
    contactId: bigint('contact_id', { mode: 'number' })
      .notNull()
      .references(() => contactsTable.id),
    number: varchar('number', { length: 16 }).notNull()
  },
  (table) => [primaryKey({ columns: [table.id, table.contactId] })]
)
