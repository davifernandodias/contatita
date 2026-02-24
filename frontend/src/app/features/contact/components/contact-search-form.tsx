"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Search } from "lucide-react"
import { useState } from "react"
import { PhoneInputField } from "@/components/phone-input-field"
import { useForm } from "react-hook-form"
import { ContactSearchParams } from "../types/contact-search-params"

export function ContactFormSearch() {
  const [phoneSearch, setPhoneSearch] = useState("");
    const {
      register,
      handleSubmit,
      formState: { errors },
      control,
    } = useForm<ContactSearchParams>({
      defaultValues: { nome: "", numero: "" },
    })

    const onSubmit = (data: ContactSearchParams) => {
      try {
        console.log("Dados do formulario:", data)
      } catch (error) {
        console.error("Erro ao pesquisar contato:", error)
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
        />
      </div>

      <div className="flex flex-col gap-2">
        <Label>Pesquisar por telefone</Label>
        <PhoneInputField
          value={phoneSearch}
          onChange={setPhoneSearch}
          placeholder="Buscar por telefone"
        />
      </div>

      <Button type="submit" className="mt-2 w-full gap-2">
        <Search className="size-4" />
        Buscar Contato
      </Button>
    </form>
  )
}
