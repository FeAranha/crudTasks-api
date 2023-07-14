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

    const dataTask = database.select('tasks', { id })[0]

    if (!dataTask){
      return res.writeHead(404).end()
    }
    const updatedTask = {
      ...dataTask,
      title: title || dataTask.title,
      description: description || dataTask.description,
      updated_at: new Date().toISOString(),
    }

    database.update('tasks', id, updatedTask)

    return res.writeHead(204).end()
    }
},
{
  method: 'PATCH',
  path: buildRoutePath('/tasks/:id/complete'),
  handler: (req, res) => {
    const { id } = req.params
      const dataTask = database.select('tasks', { id })[0]
       
      if (!dataTask){ 
      return res.writeHead(404).end()
      }
      
      const checkTask = {
        ...dataTask,  
        completed_at: dataTask.completed_at ? null : new Date().toISOString(),

        updated_at: new Date().toISOString(),
      }
      database.update('tasks', id, checkTask)  

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
