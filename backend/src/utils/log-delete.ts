import fs from 'fs'
import path from 'path'

const LOG_FILE = path.join(__dirname, '../../data-logs/delete-logs.json')

export function saveLog(type: string, data: any) {
  try {
    let logs = []

    if (fs.existsSync(LOG_FILE)) {
      const fileContent = fs.readFileSync(LOG_FILE, 'utf-8')

      logs = fileContent ? JSON.parse(fileContent) : []
    }

    logs.push({
      type,
      data,
      timestamp: new Date().toISOString()
    })

    fs.writeFileSync(LOG_FILE, JSON.stringify(logs, null, 2))
  } catch (error) {
    console.error('Erro ao salvar log:', error)
  }
}
