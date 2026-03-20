import express from 'express'
import cors from 'cors'
import type { Request, Response, NextFunction } from 'express'
import { getProjects, getProjectById, getFeaturesByProject, getFeatureById, getTasksByFeature, getTaskById, getTaskHistory, getInboxItems, closeDatabase } from './database.ts'

const app = express()
const PORT = process.env.PORT || 3001

// Middleware
app.use(cors())
app.use(express.json())

// Request logging
app.use((req: Request, res: Response, next: NextFunction) => {
  console.log(`${new Date().toISOString()} ${req.method} ${req.path}`)
  next()
})

// API Routes

// GET /api/projects - Get all projects
app.get('/api/projects', async (req: Request, res: Response) => {
  try {
    const projects = await getProjects()
    res.json({ success: true, data: projects })
  } catch (error) {
    console.error('Error fetching projects:', error)
    res.status(500).json({ success: false, error: 'Failed to fetch projects' })
  }
})

// GET /api/projects/:id - Get a single project
app.get('/api/projects/:id', async (req: Request, res: Response) => {
  try {
    const project = await getProjectById(String(req.params.id))
    if (!project) {
      return res.status(404).json({ success: false, error: 'Project not found' })
    }
    res.json({ success: true, data: project })
  } catch (error) {
    console.error(`Error fetching project ${req.params.id}:`, error)
    res.status(500).json({ success: false, error: 'Failed to fetch project' })
  }
})

// GET /api/projects/:id/features - Get features for a project
app.get('/api/projects/:id/features', async (req: Request, res: Response) => {
  try {
    const features = await getFeaturesByProject(String(req.params.id))
    res.json({ success: true, data: features })
  } catch (error) {
    console.error(`Error fetching features for project ${req.params.id}:`, error)
    res.status(500).json({ success: false, error: 'Failed to fetch features' })
  }
})

// GET /api/features/:id - Get a single feature
app.get('/api/features/:id', async (req: Request, res: Response) => {
  try {
    const feature = await getFeatureById(req.params.id)
    if (!feature) {
      return res.status(404).json({ success: false, error: 'Feature not found' })
    }
    res.json({ success: true, data: feature })
  } catch (error) {
    console.error(`Error fetching feature ${req.params.id}:`, error)
    res.status(500).json({ success: false, error: 'Failed to fetch feature' })
  }
})

// GET /api/features/:id/tasks - Get tasks for a feature
app.get('/api/features/:id/tasks', async (req: Request, res: Response) => {
  try {
    const tasks = await getTasksByFeature(String(req.params.id))
    res.json({ success: true, data: tasks })
  } catch (error) {
    console.error(`Error fetching tasks for feature ${req.params.id}:`, error)
    res.status(500).json({ success: false, error: 'Failed to fetch tasks' })
  }
})

// GET /api/tasks/:id - Get full task details
app.get('/api/tasks/:id', async (req: Request, res: Response) => {
  try {
    const task = await getTaskById(String(req.params.id))
    if (!task) {
      return res.status(404).json({ success: false, error: 'Task not found' })
    }
    res.json({ success: true, data: task })
  } catch (error) {
    console.error(`Error fetching task ${req.params.id}:`, error)
    res.status(500).json({ success: false, error: 'Failed to fetch task' })
  }
})

// GET /api/tasks/:id/history - Get task history
app.get('/api/tasks/:id/history', async (req: Request, res: Response) => {
  try {
    const history = await getTaskHistory(String(req.params.id))
    res.json({ success: true, data: history })
  } catch (error) {
    console.error(`Error fetching history for task ${req.params.id}:`, error)
    res.status(500).json({ success: false, error: 'Failed to fetch task history' })
  }
})

// GET /api/inbox - Get inbox items
app.get('/api/inbox', async (req: Request, res: Response) => {
  try {
    const items = await getInboxItems()
    res.json({ success: true, data: items })
  } catch (error) {
    console.error('Error fetching inbox items:', error)
    res.status(500).json({ success: false, error: 'Failed to fetch inbox items' })
  }
})

// Health check
app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

// API Documentation
app.get('/api/docs', (req: Request, res: Response) => {
  res.json({
    openapi: '3.0.0',
    info: {
      title: 'Taskflow API',
      version: '1.0.0',
      description: 'API for reading from the Taskflow SQLite database',
    },
    servers: [{ url: 'http://localhost:3001', description: 'Development server' }],
    paths: {
      '/api/projects': {
        get: {
          summary: 'Get all projects',
          tags: ['Projects'],
          responses: {
            '200': {
              description: 'List of projects',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      success: { type: 'boolean' },
                      data: {
                        type: 'array',
                        items: {
                          type: 'object',
                          properties: {
                            id: { type: 'string' },
                            name: { type: 'string' },
                            description: { type: 'string', nullable: true },
                            created_at: { type: 'string', format: 'date-time' },
                            updated_at: { type: 'string', format: 'date-time' },
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
      '/api/projects/{id}/features': {
        get: {
          summary: 'Get features for a project',
          tags: ['Projects'],
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
          responses: {
            '200': {
              description: 'List of features',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      success: { type: 'boolean' },
                      data: {
                        type: 'array',
                        items: {
                          type: 'object',
                          properties: {
                            id: { type: 'string' },
                            project_id: { type: 'string' },
                            title: { type: 'string' },
                            description: { type: 'string', nullable: true },
                            created_at: { type: 'string', format: 'date-time' },
                            updated_at: { type: 'string', format: 'date-time' },
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
      '/api/features/{id}/tasks': {
        get: {
          summary: 'Get tasks for a feature',
          tags: ['Tasks'],
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
          responses: {
            '200': {
              description: 'List of tasks',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      success: { type: 'boolean' },
                      data: {
                        type: 'array',
                        items: {
                          type: 'object',
                          properties: {
                            id: { type: 'string' },
                            feature_id: { type: 'string' },
                            title: { type: 'string' },
                            description: { type: 'string' },
                            acceptance_criteria: { type: 'string' },
                            stage: { type: 'string' },
                            assigned_agent: { type: 'string', nullable: true },
                            priority: { type: 'string', nullable: true },
                            iteration: { type: 'number' },
                            branch: { type: 'string' },
                            feature_branch: { type: 'string' },
                            feature_title: { type: 'string' },
                            created_at: { type: 'string', format: 'date-time' },
                            updated_at: { type: 'string', format: 'date-time' },
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
      '/api/tasks/{id}': {
        get: {
          summary: 'Get full task details',
          tags: ['Tasks'],
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
          responses: {
            '200': {
              description: 'Task details',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      success: { type: 'boolean' },
                      data: {
                        type: 'object',
                        properties: {
                          id: { type: 'string' },
                          feature_id: { type: 'string' },
                          title: { type: 'string' },
                          description: { type: 'string' },
                          acceptance_criteria: { type: 'string' },
                          stage: { type: 'string' },
                          assigned_agent: { type: 'string', nullable: true },
                          priority: { type: 'string', nullable: true },
                          iteration: { type: 'number' },
                          branch: { type: 'string' },
                          feature_branch: { type: 'string' },
                          feature_title: { type: 'string' },
                          created_at: { type: 'string', format: 'date-time' },
                          updated_at: { type: 'string', format: 'date-time' },
                        },
                      },
                    },
                  },
                },
              },
            },
            '404': { description: 'Task not found' },
          },
        },
      },
      '/api/tasks/{id}/history': {
        get: {
          summary: 'Get task history',
          tags: ['Tasks'],
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
          responses: {
            '200': {
              description: 'Task history',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      success: { type: 'boolean' },
                      data: {
                        type: 'array',
                        items: {
                          type: 'object',
                          properties: {
                            id: { type: 'string' },
                            task_id: { type: 'string' },
                            action: { type: 'string' },
                            agent: { type: 'string', nullable: true },
                            message: { type: 'string' },
                            timestamp: { type: 'string', format: 'date-time' },
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
      '/api/inbox': {
        get: {
          summary: 'Get inbox items',
          tags: ['Inbox'],
          responses: {
            '200': {
              description: 'List of inbox items',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      success: { type: 'boolean' },
                      data: {
                        type: 'array',
                        items: {
                          type: 'object',
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  })
})

// Start server
app.listen(PORT, () => {
  console.log(`Taskflow API server running on port ${PORT}`)
  console.log(`Health check: http://localhost:${PORT}/health`)
  console.log(`API docs: http://localhost:${PORT}/api/docs`)
  console.log(`Database: ~/.taskflow/taskflow.db`)
})

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM received, shutting down gracefully...')
  await closeDatabase()
  process.exit(0)
})

process.on('SIGINT', async () => {
  console.log('SIGINT received, shutting down gracefully...')
  await closeDatabase()
  process.exit(0)
})
