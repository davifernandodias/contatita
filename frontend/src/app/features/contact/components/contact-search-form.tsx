import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Search } from 'lucide-react'
import { useForm, Controller } from 'react-hook-form'
import { PhoneInputField } from '@/components/phone-input-field'
import { ContactSearchParams } from '../types/contact-search-params'
import { useDebouncedCallback } from 'use-debounce'

export function ContactFormSearch() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    getValues,
    trigger
  } = useForm<ContactSearchParams>({
    defaultValues: { nome: '', numero: '' },
    mode: 'onSubmit'
  })

  const debouncedTriggerNumero = useDebouncedCallback(
    () => trigger('numero'),
    300
  )
  const debouncedTriggerNome = useDebouncedCallback(() => trigger('nome'), 300)

  const onSubmit = async (data: ContactSearchParams) => {
    const isValid = await trigger(['nome', 'numero'])
    if (!isValid) return

    try {
      console.log('Dados do formulario:', data)
    } catch (error) {
      console.error('Erro ao pesquisar contato:', error)
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
          {...register('nome', {
            validate: (value) => {
              const numero = getValues('numero')
              return (
                (value ?? '').trim().length > 0 ||
                (numero ?? '').trim().length > 0 ||
                'Preencha ao menos um campo'
              )
            },
            onChange: () => debouncedTriggerNumero()
          })}
          aria-invalid={errors.nome ? 'true' : 'false'}
        />
      </div>

      <div className="flex flex-col gap-2">
        <Label>Pesquisar por telefone</Label>
        <Controller
          name="numero"
          control={control}
          rules={{
            validate: (value) => {
              const nome = getValues('nome')
              const numeroLimpo = (value ?? '').replace(/\D/g, '')
              const numeroValido = numeroLimpo.length >= 12
              const nomeValido = (nome ?? '').trim().length > 0

              return numeroValido || nomeValido || 'Preencha ao menos um campo'
            }
          }}
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

      {(errors.nome || errors.numero) && (
        <p className="text-sm text-destructive">Preencha ao menos um campo</p>
      )}

      <Button type="submit" className="mt-2 w-full gap-2">
        <Search className="size-4" />
        Buscar Contato
      </Button>
    </form>
  )
}
