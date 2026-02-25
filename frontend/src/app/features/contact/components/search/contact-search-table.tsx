import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import { ContactSearchItem } from '../../types/search-types'

interface Props {
  contacts: ContactSearchItem[]
  onSelect: (contact: ContactSearchItem) => void
}

export function ContactSearchTable({ contacts, onSelect }: Props) {
  if (!contacts || contacts.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        Nenhum contato encontrado.
      </p>
    )
  }

  return (
    <div className="overflow-x-auto rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nome</TableHead>
            <TableHead>Idade</TableHead>
            <TableHead>Telefones</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {contacts.map((contact) => (
            <TableRow
              key={contact.id}
              onClick={() => onSelect(contact)}
              className="cursor-pointer hover:bg-muted"
            >
              <TableCell className="font-medium">{contact.name}</TableCell>

              <TableCell>{contact.age ?? 'não informada'}</TableCell>

              <TableCell>
                {contact.phones && contact.phones.length > 0 ? (
                  <div className="flex gap-2 overflow-x-auto">
                    {contact.phones.map((phone) => (
                      <div
                        key={phone.id}
                        className="min-w-35 rounded-md border p-2 shadow-sm"
                      >
                        <span className="text-sm">{phone.phone}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <span className="text-sm text-muted-foreground">
                    sem telefones
                  </span>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
