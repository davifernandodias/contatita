import 'dotenv/config'
import express from 'express'
import { createServer } from 'http'
import cors from 'cors'
import contactRoutes from './routes/contact-routes'

const port = process.env.API_PORT
const urlFront = process.env.URL_FRONTEND

const app = express()

app.use(
  cors({
    origin: urlFront,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
  })
)

app.use(express.json())

app.use('/api/v1/contact', contactRoutes)

const server = createServer(app)

server.listen(port, () => {
  console.log(`rodando papai ${port}`)
})
