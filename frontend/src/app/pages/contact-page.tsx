"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { UserPlus, Search } from "lucide-react"
import { cn } from "@/lib/utils"
import { ContactForm } from "@/app/features/contact/components/contact-form"
import { ContactFormSearch } from "@/app/features/contact/components/contact-search-form"


const tabs = [
  { id: "cadastro", label: "Cadastro de Contato", icon: UserPlus },
  { id: "procura", label: "Procura de Contato", icon: Search },
] as const

type TabId = (typeof tabs)[number]["id"]

export function ContactPage() {
  const [activeTab, setActiveTab] = useState<TabId>("cadastro")

  return (
    <main className="flex min-h-svh items-center justify-center bg-background p-4">
      <div className="w-full max-w-lg">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        >
          <div className="mb-8 text-center">
            <h1 className="text-2xl font-semibold tracking-tight text-foreground text-balance">
              Contatita a sua agenda de contatos favorita.
            </h1>
            <p className="mt-1.5 text-sm text-muted-foreground">
              Por favorrr, cadastre seus contatos e telefones, eu nasci para isso.
            </p>
          </div>

          <div className="rounded-xl border border-border bg-card shadow-sm">
            {/* Tab triggers */}
            <div className="relative flex border-b border-border">
              {tabs.map((tab) => {
                const Icon = tab.icon
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id)}
                    className={cn(
                      "relative z-10 flex flex-1 items-center justify-center gap-2 px-4 py-3.5 text-sm font-medium transition-colors",
                      activeTab === tab.id
                        ? "text-primary"
                        : "text-muted-foreground hover:text-foreground"
                    )}
                    aria-selected={activeTab === tab.id}
                    role="tab"
                  >
                    <Icon className="size-4" />
                    <span>{tab.label}</span>
                  </button>
                )
              })}

              {/* Animated underline indicator */}
              <motion.div
                className="absolute bottom-0 h-0.5 bg-primary"
                layoutId="tab-indicator"
                style={{
                  width: `${100 / tabs.length}%`,
                  left: `${(tabs.findIndex((t) => t.id === activeTab) * 100) / tabs.length}%`,
                }}
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
              />
            </div>

            {/* Tab content with animation */}
            <div className="relative overflow-hidden p-6">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, x: activeTab === "cadastro" ? -20 : 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: activeTab === "cadastro" ? 20 : -20 }}
                  transition={{ duration: 0.25, ease: "easeInOut" }}
                >
                  {activeTab === "cadastro" ? (
                    <ContactForm />
                  ) : (
                    <ContactFormSearch />
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </motion.div>
      </div>
    </main>
  )
}
