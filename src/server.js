import http from 'node:http'
import { json } from './middlewares/json.js'
import { Database } from './database.js'
import { randomUUID } from 'node:crypto'

const database = new Database

const server = http.createServer(async(req, res) => {
  const { method, url } = req

  await json(req, res)

  if (method === 'GET' && url === '/tasks') {
    const tasks =  database.select('tasks')

    return res.end(JSON.stringify(tasks))
  }

  if (method === 'POST' && url === '/tasks') {
    const { title, desc } = req.body
    
    const task = {
      id: randomUUID(),
      title,
      desc,
    }
    database.insert('tasks', task)
    
    return res.writeHead(201).end()
  }
  return res
    .writeHead(404)  
    .end('Not Found')
})

server.listen(3333)
