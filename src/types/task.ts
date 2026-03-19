// Task Types
export type TaskStage = 'backlog' | 'dev' | 'review' | 'pm-check' | 'done'
export type Priority = 'low' | 'medium' | 'high'

export interface Task {
  id: string
  title: string
  description: string
  stage: TaskStage
  assignedAgent?: string
  priority?: Priority
  iteration: number
  branch: string
  featureId?: string
  featureTitle?: string
  acceptanceCriteria: string[]
  createdAt: string
  updatedAt: string
}

export interface TaskHistoryEntry {
  id: string
  action: string
  agent: string
  message: string
  timestamp: string
}
