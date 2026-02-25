import { useForm, useFieldArray, Controller } from 'react-hook-form'
import { DiamondPlus, Trash2, Save, LoaderCircle } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { PhoneInputField } from '@/app/features/contact/components/phone-input-field'
import { normalizePhone, validatePhones } from '@/utils/phone-validator'
import { contactService } from '../../services/contact-service'
import { useState } from 'react'
import { ContactFormData } from '../../types/create-types'
import { toast } from 'sonner'

export function ContactForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    setError,
    clearErrors
  } = useForm<ContactFormData>({
    defaultValues: { name: '', age: 0, phone: [{ numero: '' }] }
  })

  const [isLoading, setLoading] = useState(false)

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'phone'
  })

  const onSubmit = async (data: ContactFormData) => {
    try {
      setLoading(true)
      const phoneValidation = validatePhones(data.phone)

      if (phoneValidation !== true) {
        setError(`phone.${phoneValidation.index}.numero`, {
          type: 'manual',
          message: phoneValidation.message
        })
        return
      }

      clearErrors('phone')

      const response = await contactService.register({
        name: data.name,
        age: Number(data.age),
        phones: data.phone
          .filter((p) => p.numero.trim() !== '')
          .map((p) => ({
            numero: normalizePhone(p.numero) as string
          }))
      })

      if (response && response.action_code !== 1) {
        toast.error('Atenção. ocorreu um erro: ' + response.message)
        return
      }
      toast.success(response.message)
    } catch (error) {
      console.error('error para criar contato: ', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
      <div className="flex flex-col gap-2">
        <Label htmlFor="name">Nome</Label>
        <Input
          id="name"
          type="text"
          placeholder="Digite o nome completo"
          {...register('name', {
            required: 'Nome é obrigatório',
            validate: (value) =>
              value.trim().length > 0 ||
              'Nome não pode ser apenas espaços em branco'
          })}
          aria-invalid={errors.name ? 'true' : 'false'}
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
          placeholder="Digite a idade"
          {...register('age', {
            required: 'Idade é obrigatória',
            pattern: {
              value: /^[1-9]\d*$/,
              message: 'Idade não pode começar com 0'
            },
            min: { value: 1, message: 'Idade deve ser maior que 0' },
            max: { value: 150, message: 'Idade deve ser menor que 150' },
            validate: (value) => !isNaN(value) || 'Idade inválida'
          })}
          aria-invalid={errors.age ? 'true' : 'false'}
        />
        {errors.age && (
          <p className="text-sm text-destructive">{errors.age.message}</p>
        )}
      </div>

      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <Label>Telefones</Label>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => append({ numero: '' })}
            className="gap-1.5 cursor-pointer"
          >
            <DiamondPlus className="size-4" />
            <span>Adicionar</span>
          </Button>
        </div>

        <AnimatePresence mode="popLayout">
          {fields.map((field, index) => (
            <motion.div
              key={field.id}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2, ease: 'easeInOut' }}
              className="overflow-hidden"
            >
              <div className="flex items-start gap-2">
                <Controller
                  control={control}
                  name={`phone.${index}.numero`}
                  render={({ field: controllerField }) => (
                    <div className="flex flex-col gap-1 flex-1">
                      <PhoneInputField
                        value={controllerField.value}
                        onChange={controllerField.onChange}
                        placeholder={`Telefone ${index + 1}`}
                      />
                      {errors.phone?.[index]?.numero && (
                        <p className="text-sm text-destructive">
                          {errors.phone[index].numero.message}
                        </p>
                      )}
                    </div>
                  )}
                />
                {fields.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => remove(index)}
                    className="shrink-0 text-muted-foreground hover:text-destructive cursor-pointer mt-0.5"
                  >
                    <Trash2 className="size-4" />
                    <span className="sr-only">
                      Remover telefone {index + 1}
                    </span>
                  </Button>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <Button type="submit" className="mt-2 w-full gap-2 cursor-pointer">
        <Save className="size-4" />
        {isLoading ? (
          <>
            <LoaderCircle className="animate-spin" />
            Cadastrando...
          </>
        ) : (
          <>Cadastrar Contato</>
        )}
      </Button>
    </form>
  )
}
