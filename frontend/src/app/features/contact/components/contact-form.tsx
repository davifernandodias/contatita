"use client"

import { useForm, useFieldArray, Controller } from "react-hook-form"
import type { ContactFormData } from "../types/contact-form-data"
import { DiamondPlus, Trash2, Save } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { PhoneInputField } from "@/components/phone-input-field"

export function ContactForm() {
    const {
        register,
        handleSubmit,
        formState: { errors },
        control,
    } = useForm<ContactFormData>({
        defaultValues: { name: "", age: 0, phone: [{ numero: "" }] },
    })

    const { fields, append, remove } = useFieldArray({
        control,
        name: "phone",
    })

    const onSubmit = (data: ContactFormData) => {
        try {
            console.log("Dados do formulario:", data)
        } catch (error) {
            console.error("Erro ao salvar contato:", error)
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
                    {...register("name", { required: "Nome e obrigatorio" })}
                    aria-invalid={errors.name ? "true" : "false"}
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
                    {...register("age", { required: "Idade e obrigatoria" })}
                    aria-invalid={errors.age ? "true" : "false"}
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
                        onClick={() => append({ numero: "" })}
                        className="gap-1.5"
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
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.2, ease: "easeInOut" }}
                            className="overflow-hidden"
                        >
                            <div className="flex items-center gap-2">
                                <Controller
                                    control={control}
                                    name={`phone.${index}.numero`}
                                    render={({ field: controllerField }) => (
                                        <PhoneInputField
                                            value={controllerField.value}
                                            onChange={controllerField.onChange}
                                            placeholder={`Telefone ${index + 1}`}
                                        />
                                    )}
                                />
                                {fields.length > 1 && (
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => remove(index)}
                                        className="shrink-0 text-muted-foreground hover:text-destructive"
                                    >
                                        <Trash2 className="size-4" />
                                        <span className="sr-only">Remover telefone {index + 1}</span>
                                    </Button>
                                )}
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>

            <Button type="submit" className="mt-2 w-full gap-2">
                <Save className="size-4" />
                Salvar Contato
            </Button>
        </form>
    )
}
