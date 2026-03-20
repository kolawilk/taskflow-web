import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { api } from '@/services/api'
import type { Feature as ApiFeature, Task as ApiTask } from '@/services/api'
import type { Feature, FeatureStage, Task as LocalTask, TaskStage } from '@/types/feature'

const STAGE_CONFIG: Record<FeatureStage, { label: string; color: string }> = {
  backlog: { label: 'Backlog', color: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400' },
  dev: { label: 'In Dev', color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' },
  review: { label: 'Review', color: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' },
  'pm-check': { label: 'PM Check', color: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400' },
  done: { label: 'Done', color: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' },
}

const TASK_STAGE_CONFIG: Record<TaskStage, { label: string; color: string }> = {
  backlog: { label: 'Backlog', color: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400' },
  dev: { label: 'Dev', color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' },
  review: { label: 'Review', color: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' },
  'pm-check': { label: 'PM Check', color: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400' },
  done: { label: 'Done', color: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' },
}

// Group tasks by stage
function groupTasksByStage(tasks: LocalTask[]): Record<TaskStage, LocalTask[]> {
  const grouped: Record<TaskStage, LocalTask[]> = {
    backlog: [],
    dev: [],
    review: [],
    'pm-check': [],
    done: [],
  }
  tasks.forEach(task => {
    grouped[task.stage].push(task)
  })
  return grouped
}

// Helper to map API task to local type
function mapApiTask(apiTask: ApiTask): LocalTask {
  return {
    id: apiTask.id,
    title: apiTask.title,
    description: apiTask.description,
    stage: apiTask.stage as TaskStage,
    assignedAgent: apiTask.assigned_agent || undefined,
    priority: apiTask.priority as 'low' | 'medium' | 'high' | undefined,
    createdAt: apiTask.created_at,
    updatedAt: apiTask.updated_at,
  }
}

export function FeatureDetailPage() {
  const navigate = useNavigate()
  const { id: featureId } = useParams<{ id: string }>()

  const [feature, setFeature] = useState<Feature | null>(null)
  const [tasks, setTasks] = useState<LocalTask[]>([])
  const [isLoadingFeature, setIsLoadingFeature] = useState(true)
  const [isLoadingTasks, setIsLoadingTasks] = useState(true)
  const [featureError, setFeatureError] = useState<string | null>(null)
  const [tasksError, setTasksError] = useState<string | null>(null)

  // Fetch feature data
  useEffect(() => {
    if (!featureId) {
      setFeatureError('No feature ID provided')
      setIsLoadingFeature(false)
      return
    }

    const fetchFeature = async () => {
      setIsLoadingFeature(true)
      setFeatureError(null)
      try {
        const result = await api.getFeatureById(featureId)
        if (result.data) {
          const apiFeature: ApiFeature = result.data
          // Determine feature status from description (simple heuristic)
          const status: FeatureStage = apiFeature.description?.includes('dev') ? 'dev' : 'backlog'
          // Transform API Feature to local Feature type
          setFeature({
            id: apiFeature.id,
            project_id: apiFeature.project_id,
            title: apiFeature.title,
            description: apiFeature.description || '',
            status,
            taskCount: 0,
            tasksInProgress: 0,
            lastUpdated: new Date(apiFeature.updated_at).toLocaleDateString(),
          })
        } else if (result.error) {
          setFeatureError(result.error)
        }
      } catch (err) {
        setFeatureError(err instanceof Error ? err.message : 'Failed to fetch feature')
      }
      setIsLoadingFeature(false)
    }

    fetchFeature()
  }, [featureId])

  // Fetch tasks data
  useEffect(() => {
    if (!featureId) {
      setTasksError('No feature ID provided')
      setIsLoadingTasks(false)
      return
    }

    const fetchTasks = async () => {
      setIsLoadingTasks(true)
      setTasksError(null)
      try {
        const result = await api.getTasksByFeature(featureId)
        if (result.data) {
          setTasks(result.data.map(mapApiTask))
        } else if (result.error) {
          setTasksError(result.error)
        }
      } catch (err) {
        setTasksError(err instanceof Error ? err.message : 'Failed to fetch tasks')
      }
      setIsLoadingTasks(false)
    }

    fetchTasks()
  }, [featureId])

  const isLoading = isLoadingFeature || isLoadingTasks
  const error = featureError || tasksError

  // Calculate progress
  const groupedTasks = groupTasksByStage(tasks)
  const doneCount = groupedTasks.done.length
  const progress = tasks.length > 0 ? Math.round((doneCount / tasks.length) * 100) : 0
  const inProgressCount = groupedTasks.dev.length + groupedTasks.review.length + groupedTasks['pm-check'].length

  const getStageIcon = (stage: TaskStage) => {
    switch (stage) {
      case 'backlog':
        return <div className="h-2 w-2 rounded-full bg-slate-400" />
      case 'dev':
        return <div className="h-2 w-2 rounded-full bg-blue-500" />
      case 'review':
        return <div className="h-2 w-2 rounded-full bg-amber-500" />
      case 'pm-check':
        return <div className="h-2 w-2 rounded-full bg-purple-500" />
      case 'done':
        return <div className="h-2 w-2 rounded-full bg-emerald-500" />
    }
  }

  // Render tasks grouped by stage
  const renderTasksByStage = (stage: TaskStage, stageTasks: LocalTask[]) => {
    if (stageTasks.length === 0) return null

    return (
      <div key={stage} className="space-y-3">
        <h4 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground pb-2 border-b border-border">
          {TASK_STAGE_CONFIG[stage].label} ({stageTasks.length})
        </h4>
        {stageTasks.map((task) => (
          <Card
            key={task.id}
            className="hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => navigate(`/tasks/${task.id}`)}
          >
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold text-primary">{task.id}</span>
                    <Badge variant="outline" className={TASK_STAGE_CONFIG[task.stage].color}>
                      {TASK_STAGE_CONFIG[task.stage].label}
                    </Badge>
                  </div>
                  <h4 className="font-medium mb-2">{task.title}</h4>
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-2">{task.description}</p>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    {task.assignedAgent && <span>Assignee: {task.assignedAgent}</span>}
                    {task.priority && <span>Priority: {task.priority}</span>}
                  </div>
                </div>
                <div className="mt-1">{getStageIcon(task.stage)}</div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto" />
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="rounded-xl border border-red-500 bg-red-500/10 p-6">
          <p className="text-red-500 font-medium">Error: {error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 rounded-lg text-red-500"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  // No feature found
  if (!feature) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="rounded-xl border border-yellow-500 bg-yellow-500/10 p-6">
          <p className="text-yellow-500 font-medium">Feature not found</p>
          <button
            onClick={() => navigate('/features')}
            className="mt-4 px-4 py-2 bg-yellow-500/20 hover:bg-yellow-500/30 rounded-lg text-yellow-500"
          >
            Back to Features
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <header className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <h2 className="text-3xl font-bold tracking-tight">Feature: {feature.id}</h2>
          <Badge className={STAGE_CONFIG[feature.status].color}>
            {STAGE_CONFIG[feature.status].label}
          </Badge>
        </div>
        <p className="text-muted-foreground mt-2 max-w-2xl">{feature.description}</p>
        <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
          <span>{tasks.length} tasks</span>
          <span>{progress}% complete</span>
          <span>Updated {feature.lastUpdated}</span>
        </div>
      </header>

      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between text-sm mb-2">
          <span className="font-medium">Progress</span>
          <span className="font-medium">{progress}%</span>
        </div>
        <div className="h-2 w-full rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
          <div
            className="h-full bg-primary transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Task List - Grouped by Stage */}
        <div className="lg:col-span-2 space-y-6">
          <h3 className="text-xl font-semibold">Tasks ({tasks.length})</h3>

          {tasksError && (
            <div className="rounded-xl border border-red-500 bg-red-500/10 p-4 mb-4">
              <p className="text-red-500 text-sm">Failed to load some tasks: {tasksError}</p>
            </div>
          )}

          {tasks.length === 0 && !tasksError ? (
            <p className="text-muted-foreground">No tasks found for this feature.</p>
          ) : (
            <>
              {renderTasksByStage('done', groupedTasks.done)}
              {renderTasksByStage('pm-check', groupedTasks['pm-check'])}
              {renderTasksByStage('review', groupedTasks.review)}
              {renderTasksByStage('dev', groupedTasks.dev)}
              {renderTasksByStage('backlog', groupedTasks.backlog)}
            </>
          )}
        </div>

        {/* Feature Info Sidebar */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Feature Info</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">Feature ID</p>
                <p className="font-medium">{feature.id}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">Status</p>
                <Badge className={STAGE_CONFIG[feature.status].color}>
                  {STAGE_CONFIG[feature.status].label}
                </Badge>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">Total Tasks</p>
                <p className="font-medium">{tasks.length}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">In Progress</p>
                <p className="font-medium">{inProgressCount}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">Completion</p>
                <p className="font-medium">{progress}%</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
