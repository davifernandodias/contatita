import { Router } from 'express'
import {
  createContact,
  searchContacts,
  deleteContact,
  updateContact
} from '../controllers/contact-controller'

const router = Router()

router.post('/register', createContact)

router.put('/update/:id', updateContact)

router.delete('/delete/:id', deleteContact)

router.get('/search', searchContacts)

export default router
