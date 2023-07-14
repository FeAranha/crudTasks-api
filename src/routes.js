import { Database } from './database.js'
import { randomUUID } from 'node:crypto'
import { buildRoutePath } from './utils/build-route-path.js'

const database = new Database()

export const routes = [
  {
    method: 'GET',
    path: buildRoutePath('/tasks'),
    handler: (req, res) => {
      const { search } = req.query

      const tasks = database.select('tasks', search ? {
        title: search,
        description: search,
      } : null)
    
      return res.end(JSON.stringify(tasks))
    }
  },
 {
    method: 'POST',
    path: buildRoutePath('/tasks'),
    handler: (req, res) => {
      const { title, description } = req.body

      const task = {
        id: randomUUID(),
        created_at: new Date().toISOString(),
        title,
        description,
        completed_at: null,
        updated_at: new Date().toISOString(),
      }

    database.insert('tasks', task)

    return res.writeHead(201).end()
    }
  },
    {
    method: 'PUT',
    path: buildRoutePath('/tasks/:id'),
    handler: (req, res) => {
      const { id } = req.params
      const { title, description } = req.body

      database.update('tasks', id, {
        created_at: //comoFazer
        title,
        description,
        completed_at:
        updated_at: new Date().toISOString(),

      })

      return res.writeHead(204).end()
    }
  },
    {
    method: 'DELETE',
    path: buildRoutePath('/tasks/:id'),
    handler: (req, res) => {
      const { id } = req.params

      database.delete('tasks', id)

      return res.writeHead(204).end()
    }
  },
]
