import { Toaster } from 'sonner'
import { ContactPage } from './pages/contact-page'

export function App() {
  return (
    <>
      <Toaster position="top-right" richColors closeButton />
      <ContactPage />
    </>
  )
}
