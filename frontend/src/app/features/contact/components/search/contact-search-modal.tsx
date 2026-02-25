import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useForm, useFieldArray, Controller } from 'react-hook-form'
import { PhoneInputField } from '@/app/features/contact/components/phone-input-field'
import { validatePhones, normalizePhone } from '@/utils/phone-validator'
import { Trash2, Plus } from 'lucide-react'
import { useEffect } from 'react'
import { ContactSearchItem, ContactUpdateDTO } from '../../types/search-types'

interface Props {
  open: boolean
  contact: ContactSearchItem | null
  onClose: () => void
  onUpdate: (contact: ContactUpdateDTO) => void
  onDelete: (id: number) => void
}

interface FormData {
  name: string
  age: number
  phone: { id?: number; numero: string }[]
}

export function ContactSearchModal({
  open,
  contact,
  onClose,
  onUpdate,
  onDelete
}: Props) {
  const {
    control,
    handleSubmit,
    formState: { errors },
    register,
    setError,
    clearErrors,
    reset
  } = useForm<FormData>({
    defaultValues: {
      name: '',
      age: 0,
      phone: [{ numero: '' }]
    }
  })

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'phone'
  })

  useEffect(() => {
    if (contact) {
      reset({
        name: contact.name,
        age: contact.age ?? 0,
        phone: contact.phones?.map((p) => ({
          id: p.id,
          numero: p.phone
        })) ?? [{ numero: '' }]
      })
    }
  }, [contact, reset])

  if (!contact) return null

  const onSubmit = handleSubmit((data) => {
    const phoneValidation = validatePhones(data.phone)

    if (phoneValidation !== true) {
      setError(`phone.${phoneValidation.index}.numero`, {
        type: 'manual',
        message: phoneValidation.message
      })
      return
    }

    clearErrors('phone')

    const payload: ContactUpdateDTO = {
      id: contact.id,
      name: data.name,
      age: Number(data.age),
      phones: data.phone
        .filter((p) => p.numero.trim() !== '')
        .map((p) => ({
          id: p.id,
          phone: normalizePhone(p.numero) as string
        }))
    }

    onUpdate(payload)
  })

  function handleCancel() {
    if (contact) {
      reset({
        name: contact.name,
        age: contact.age ?? 0,
        phone: contact.phones?.map((p) => ({
          id: p.id,
          numero: p.phone
        })) ?? [{ numero: '' }]
      })
    }

    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && handleCancel()}>
      <DialogContent onWheel={(e) => e.stopPropagation()}>
        <DialogHeader>
          <DialogTitle>Editar contato</DialogTitle>
        </DialogHeader>

        <form onSubmit={onSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="name">Nome</Label>
            <Input
              id="name"
              {...register('name', {
                required: 'Nome é obrigatório',
                validate: (value) =>
                  value.trim().length > 0 || 'Nome não pode ser apenas espaços'
              })}
            />
            {errors.name && (
              <p className="text-sm text-destructive">{errors.name.message}</p>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="age">Idade</Label>
            <Input
              id="age"
              type="number"
              {...register('age', {
                required: 'Idade é obrigatória',
                min: { value: 1, message: 'Idade deve ser maior que 0' },
                max: { value: 150, message: 'Idade inválida' }
              })}
            />
            {errors.age && (
              <p className="text-sm text-destructive">{errors.age.message}</p>
            )}
          </div>

          <div>
            <Label>Telefones</Label>

            {fields.map((field, index) => (
              <div key={field.id} className="flex gap-2 mt-2">
                <Controller
                  control={control}
                  name={`phone.${index}.numero`}
                  rules={{
                    validate: (value) =>
                      value.trim() !== '' || 'Telefone não pode ser vazio'
                  }}
                  render={({ field }) => (
                    <div className="flex flex-col gap-1 flex-1 cursor-pointer">
                      <PhoneInputField
                        value={field.value}
                        onChange={field.onChange}
                        placeholder={`Telefone ${index + 1}`}
                      />
                      {errors.phone?.[index]?.numero && (
                        <p className="text-sm text-destructive">
                          {errors.phone[index]?.numero?.message}
                        </p>
                      )}
                    </div>
                  )}
                />

                {fields.length > 1 && (
                  <Button
                    type="button"
                    variant="destructive"
                    className="cursor-pointer"
                    onClick={() => remove(index)}
                  >
                    <Trash2 size={16} />
                  </Button>
                )}
              </div>
            ))}

            <Button
              type="button"
              variant="outline"
              onClick={() => append({ numero: '' })}
              className="mt-2 cursor-pointer"
            >
              <Plus size={16} />
              Adicionar telefone
            </Button>
          </div>

          <div className="flex gap-2">
            <Button type="submit" className="cursor-pointer">
              Alterar
            </Button>

            <Button
              type="button"
              variant="destructive"
              className="cursor-pointer"
              onClick={() => onDelete(contact.id)}
            >
              Excluir
            </Button>

            <Button
              type="button"
              variant="outline"
              className="cursor-pointer"
              onClick={handleCancel}
            >
              Cancelar
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
