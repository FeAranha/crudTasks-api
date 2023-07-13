import { Database } from './database.js'
import { randomUUID } from 'node:crypto'
import { buildRoutePath } from './utils/build-route-path.js'

const database = new Database()

export const routes = [
  {
    method: 'GET',
    path: buildRoutePath('/tasks'),
    handler: (req, res) => {
      console.log(req.query)
      const tasks = database.select('tasks')

      return res.end(JSON.stringify(tasks))
    }
  },
 {
    method: 'POST',
    path: buildRoutePath('/tasks'),
    handler: (req, res) => {
      const { title, desc } = req.body

      const task = {
        id: randomUUID(),
        title,
        desc,
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
      const { title, desc } = req.body

      database.update('tasks', id, {
        title,
        desc,
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
