// Feature Types
export type FeatureStage = 'backlog' | 'dev' | 'review' | 'pm-check' | 'done'

export interface Feature {
  id: string
  project_id?: string
  title: string
  description: string
  status: FeatureStage
  taskCount: number
  tasksInProgress: number
  lastUpdated: string
}

export type TaskStage = 'backlog' | 'dev' | 'review' | 'pm-check' | 'done'

export interface Task {
  id: string
  title: string
  description: string
  stage: TaskStage
  assignedAgent?: string
  priority?: 'low' | 'medium' | 'high'
  createdAt: string
  updatedAt: string
}
