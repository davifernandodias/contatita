'use client'

import {
  usePhoneInput,
  FlagImage,
  defaultCountries,
  parseCountry
} from 'react-international-phone'
import 'react-international-phone/style.css'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover'
import { ScrollArea } from '@/components/ui/scroll-area'
import { ChevronDown } from 'lucide-react'
import { useState } from 'react'
import { cn } from '@/lib/utils'

interface PhoneInputFieldProps {
  value: string
  onChange: (phone: string) => void
  placeholder?: string
}

export function PhoneInputField({
  value,
  onChange,
  placeholder = 'Telefone'
}: PhoneInputFieldProps) {
  const [open, setOpen] = useState(false)

  const { inputValue, handlePhoneValueChange, inputRef, country, setCountry } =
    usePhoneInput({
      defaultCountry: 'br',
      value,
      onChange: ({ phone }) => {
        onChange(phone)
      },
      forceDialCode: true
    })

  return (
    <div className="flex flex-1 items-center gap-0">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            type="button"
            variant="outline"
            className={cn(
              'flex items-center gap-1.5 rounded-r-none border-r-0 px-2.5'
            )}
          >
            <FlagImage iso2={country.iso2} size="20px" />
            <ChevronDown className="size-3.5 text-muted-foreground" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-70 p-0" align="start">
          <ScrollArea className="h-70">
            <div className="flex flex-col">
              {defaultCountries.map((c) => {
                const parsed = parseCountry(c)
                return (
                  <button
                    key={parsed.iso2}
                    type="button"
                    onClick={() => {
                      setCountry(parsed.iso2)
                      setOpen(false)
                    }}
                    className={cn(
                      'flex items-center gap-3 px-3 py-2 text-sm transition-colors hover:bg-accent',
                      country.iso2 === parsed.iso2 && 'bg-accent'
                    )}
                  >
                    <FlagImage iso2={parsed.iso2} size="20px" />
                    <span className="flex-1 text-left">{parsed.name}</span>
                    <span className="text-muted-foreground">
                      +{parsed.dialCode}
                    </span>
                  </button>
                )
              })}
            </div>
          </ScrollArea>
        </PopoverContent>
      </Popover>

      <Input
        ref={inputRef}
        value={inputValue}
        onChange={handlePhoneValueChange}
        placeholder={placeholder}
        className="rounded-l-none"
        type="tel"
      />
    </div>
  )
}
