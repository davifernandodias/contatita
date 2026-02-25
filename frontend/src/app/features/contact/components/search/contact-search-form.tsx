import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { LoaderCircle, Search } from 'lucide-react'
import { useForm, Controller } from 'react-hook-form'
import { PhoneInputField } from '@/app/features/contact/components/phone-input-field'
import { useDebouncedCallback } from 'use-debounce'
import { ContactSearchTable } from './contact-search-table'
import { contactService } from '../../services/contact-service'
import { useState } from 'react'
import { ContactSearchModal } from './contact-search-modal'
import {
  ContactSearchItem,
  ContactSearchParams,
  ContactUpdateDTO
} from '../../types/search-types'
import { toast } from 'sonner'

export function ContactFormSearch() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    getValues,
    trigger
  } = useForm<ContactSearchParams>({
    defaultValues: { name: '', phone: '' },
    mode: 'onSubmit'
  })

  const [contacts, setContacts] = useState<ContactSearchItem[]>([])
  const [selected, setSelected] = useState<ContactSearchItem | null>(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [isLoading, setLoading] = useState(false)

  const debouncedTriggerNumero = useDebouncedCallback(
    () => trigger('phone'),
    300
  )
  const debouncedTriggerNome = useDebouncedCallback(() => trigger('name'), 300)

  const onSubmit = async (data: ContactSearchParams) => {
    const isValid = await trigger(['name', 'phone'])
    if (!isValid) return
    setLoading(true)

    try {
      const response = await contactService.search({
        name: data.name,
        phone: data.phone
      })

      if (response) {
        if (response.action_code == 0) {
          toast.error(
            'Atenção. tivemos um problema para recuperar as informações: ' +
              response.message
          )
        } else {
          if (response && response.action_code == 3) {
            toast.info(response.message)
          } else {
            toast.success(response.message)
          }
        }
      }

      setContacts(Array.isArray(response.contacts) ? response.contacts : [])
    } catch (error) {
      console.error('Erro ao pesquisar contato:', error)
    } finally {
      setLoading(false)
    }
  }

  function handleSelect(contact: ContactSearchItem) {
    setSelected(contact)
    setModalOpen(true)
  }

  async function handleUpdate(contact: ContactUpdateDTO) {
    try {
      const response = await contactService.update(contact.id, contact)

      if (response && response.action_code !== 1) {
        toast.error(response.message)
      }

      toast.success('Atualizamos com sucesso upiiiii.')
    } catch (error) {
      toast.error(
        'Atenção. Ocorreu um erro inesperado durante a atualização do registro.'
      )
    } finally {
      setModalOpen(false)
      onSubmit(getValues())
    }
  }

  async function handleDelete(id: number) {
    try {
      const response = await contactService.remove(id)

      if (response && response.action_code != 1) {
        toast.error('ocorreu erro durante o delete')
      } else {
        toast.success('Ebaa, conseguimos deletar o registro com sucesso.')
      }
    } catch (error) {
      console.error('Erro ao remover contato:', id, error)
    } finally {
      setModalOpen(false)
      onSubmit(getValues())
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
      <div className="flex flex-col gap-2">
        <Label htmlFor="search-name">Pesquisar por nome</Label>
        <Input
          id="search-name"
          type="text"
          placeholder="Digite o nome do contato"
          {...register('name', {
            onChange: () => debouncedTriggerNumero()
          })}
          aria-invalid={errors.name ? 'true' : 'false'}
        />
      </div>

      <div className="flex flex-col gap-2">
        <Label>Pesquisar por telefone</Label>
        <Controller
          name="phone"
          control={control}
          render={({ field }) => (
            <PhoneInputField
              value={field.value ?? ''}
              onChange={(val) => {
                field.onChange(val)
                debouncedTriggerNome()
              }}
              placeholder="Buscar por telefone"
            />
          )}
        />
      </div>

      {(errors.name || errors.phone) && (
        <p className="text-sm text-destructive">Preencha ao menos um campo</p>
      )}

      <div>
        <ContactSearchTable contacts={contacts} onSelect={handleSelect} />
      </div>

      <Button
        type="submit"
        className="mt-2 w-full gap-2 cursor-pointer"
        disabled={isLoading}
      >
        {isLoading ? (
          <>
            <LoaderCircle className="animate-spin" />
            Buscando...
          </>
        ) : (
          <>
            <Search className="size-4" />
            Buscar Contato
          </>
        )}
      </Button>
      <ContactSearchModal
        open={modalOpen}
        contact={selected}
        onClose={() => setModalOpen(false)}
        onUpdate={handleUpdate}
        onDelete={handleDelete}
      />
    </form>
  )
}
