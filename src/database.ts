import sqlite3 from 'sqlite3'
import { join } from 'path'
import { homedir } from 'os'

// SQLite database path
const DB_PATH = join(homedir(), '.taskflow', 'taskflow.db')

// Create database instance
const db = new sqlite3.Database(DB_PATH)

export interface Project {
  id: string
  name: string
  description: string | null
  created_at: string
  updated_at: string
}

export interface Feature {
  id: string
  project_id: string
  title: string
  description: string | null
  created_at: string
  updated_at: string
}

export interface Task {
  id: string
  feature_id: string
  title: string
  description: string
  acceptance_criteria: string
  stage: string
  assigned_agent: string | null
  priority: string | null
  iteration: number
  branch: string
  feature_branch: string
  feature_title: string
  created_at: string
  updated_at: string
}

export interface TaskHistoryEntry {
  id: string
  task_id: string
  action: string
  agent: string | null
  message: string
  timestamp: string
}

// Get all projects
export async function getProjects(): Promise<Project[]> {
  return new Promise((resolve, reject) => {
    db.all('SELECT * FROM projects ORDER BY created_at DESC', [], (err, rows) => {
      if (err) reject(err)
      else resolve(rows as Project[])
    })
  })
}

// Get a single project by ID
export async function getProjectById(projectId: string): Promise<Project | null> {
  return new Promise((resolve, reject) => {
    db.get('SELECT * FROM projects WHERE id = ?', [projectId], (err, row) => {
      if (err) {
        console.error('Error in getProjectById:', err.message)
        reject(err)
      } else {
        resolve(row as Project | null)
      }
    })
  })
}

// Get features by project ID
export async function getFeaturesByProject(projectId: string): Promise<Feature[]> {
  return new Promise((resolve, reject) => {
    db.all('SELECT * FROM features WHERE project_id = ? ORDER BY created_at DESC', [projectId], (err, rows) => {
      if (err) reject(err)
      else resolve(rows as Feature[])
    })
  })
}

// Get a single feature by ID
export async function getFeatureById(featureId: string): Promise<Feature | null> {
  return new Promise((resolve, reject) => {
    db.get('SELECT * FROM features WHERE id = ?', [featureId], (err, row) => {
      if (err) {
        console.error('Error in getFeatureById:', err.message)
        reject(err)
      } else {
        resolve(row as Feature | null)
      }
    })
  })
}

// Get tasks by feature ID
export async function getTasksByFeature(featureId: string): Promise<Task[]> {
  return new Promise((resolve, reject) => {
    db.all(
      `SELECT 
        t.id, t.feature_id, t.title, t.description, t.acceptance_criteria,
        t.stage, NULL as assigned_agent, NULL as priority, t.iteration, t.branch,
        f.branch as feature_branch, f.title as feature_title,
        t.created_at, t.updated_at
      FROM tasks t
      JOIN features f ON t.feature_id = f.id
      WHERE t.feature_id = ?
      ORDER BY t.created_at DESC`,
      [featureId],
      (err, rows) => {
        if (err) {
          console.error('Error in getTasksByFeature:', err.message)
          reject(err)
        } else {
          resolve(rows as Task[])
        }
      }
    )
  })
}

// Get task by ID with full details
export async function getTaskById(taskId: string): Promise<Task | null> {
  return new Promise((resolve, reject) => {
    db.get(
      `SELECT 
        t.id, t.feature_id, t.title, t.description, t.acceptance_criteria,
        t.stage, NULL as assigned_agent, NULL as priority, t.iteration, t.branch,
        f.branch as feature_branch, f.title as feature_title,
        t.created_at, t.updated_at
      FROM tasks t
      JOIN features f ON t.feature_id = f.id
      WHERE t.id = ?`,
      [taskId],
      (err, row) => {
        if (err) {
          console.error('Error in getTaskById:', err.message)
          reject(err)
        } else {
          resolve(row as Task | null)
        }
      }
    )
  })
}

// Get task history by task ID
export async function getTaskHistory(taskId: string): Promise<TaskHistoryEntry[]> {
  return new Promise((resolve, reject) => {
    // Check if task_history table exists
    db.get(
      "SELECT name FROM sqlite_master WHERE type='table' AND name='task_history'",
      [],
      (err, row) => {
        if (err) {
          reject(err)
          return
        }
        
        if (!row) {
          // Table doesn't exist, return empty array
          resolve([])
          return
        }
        
        db.all(
          'SELECT * FROM task_history WHERE task_id = ? ORDER BY timestamp DESC',
          [taskId],
          (err, rows) => {
            if (err) {
              console.error('Error in getTaskHistory:', err.message)
              reject(err)
            } else {
              resolve(rows as TaskHistoryEntry[])
            }
          }
        )
      }
    )
  })
}

// Get inbox items
export async function getInboxItems(): Promise<Record<string, unknown>[]> {
  return new Promise((resolve, reject) => {
    // This is a placeholder - inbox implementation depends on schema
    db.all('SELECT * FROM inbox ORDER BY created_at DESC', [], (err, rows) => {
      if (err) {
        reject(err)
        return
      }
      resolve(rows as Record<string, unknown>[])
    })
  })
}

// Close database connection
export async function closeDatabase(): Promise<void> {
  return new Promise((resolve, reject) => {
    db.close((err) => {
      if (err) reject(err)
      else resolve()
    })
  })
}
