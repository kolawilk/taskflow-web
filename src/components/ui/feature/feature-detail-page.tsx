import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import type { Feature, FeatureStage, Task } from '@/types/feature'

// Mock feature data
const MOCK_FEATURE: Feature = {
  id: 'TASKFLOW-F004',
  title: 'Feature Detail & Task Management',
  description: 'Detailed view for individual features showing all tasks, their status, progress, and the ability to manage tasks within a feature.',
  status: 'dev',
  taskCount: 4,
  tasksInProgress: 1,
  lastUpdated: '2 hours ago',
}

// Mock tasks data
const MOCK_TASKS: Task[] = [
  {
    id: 'TASKFLOW-T001',
    title: 'Create feature types and interfaces',
    description: 'Define TypeScript interfaces for Feature and Task types with all required properties',
    stage: 'done',
    assignedAgent: 'dev',
    priority: 'high',
    createdAt: '2026-03-18T22:00:00Z',
    updatedAt: '2026-03-19T00:30:00Z',
  },
  {
    id: 'TASKFLOW-T002',
    title: 'Build feature detail page component',
    description: 'Create a responsive page showing feature details with all required information',
    stage: 'dev',
    assignedAgent: 'dev',
    priority: 'high',
    createdAt: '2026-03-19T06:00:00Z',
    updatedAt: '2026-03-19T06:15:00Z',
  },
  {
    id: 'TASKFLOW-T003',
    title: 'Implement task list with stage grouping',
    description: 'Create task cards with proper visual indicators and stage-based organization',
    stage: 'backlog',
    assignedAgent: undefined,
    priority: 'medium',
    createdAt: '2026-03-19T06:10:00Z',
    updatedAt: '2026-03-19T06:10:00Z',
  },
  {
    id: 'TASKFLOW-T004',
    title: 'Add progress indicator and completion stats',
    description: 'Display completion percentage and summary statistics for the feature',
    stage: 'backlog',
    assignedAgent: undefined,
    priority: 'low',
    createdAt: '2026-03-19T06:12:00Z',
    updatedAt: '2026-03-19T06:12:00Z',
  },
]

const STAGE_CONFIG: Record<FeatureStage, { label: string; color: string }> = {
  backlog: { label: 'Backlog', color: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400' },
  dev: { label: 'In Dev', color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' },
  review: { label: 'Review', color: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' },
  'pm-check': { label: 'PM Check', color: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400' },
  done: { label: 'Done', color: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' },
}

const TASK_STAGE_CONFIG: Record<Task['stage'], { label: string; color: string }> = {
  backlog: { label: 'Backlog', color: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400' },
  dev: { label: 'Dev', color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' },
  review: { label: 'Review', color: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' },
  'pm-check': { label: 'PM Check', color: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400' },
  done: { label: 'Done', color: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' },
}

// Group tasks by stage
function groupTasksByStage(tasks: Task[]): Record<Task['stage'], Task[]> {
  const grouped: Record<Task['stage'], Task[]> = {
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

export function FeatureDetailPage() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)

  const groupedTasks = groupTasksByStage(MOCK_TASKS)
  const doneCount = groupedTasks.done.length
  const progress = Math.round((doneCount / MOCK_TASKS.length) * 100)

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 500)
    return () => clearTimeout(timer)
  }, [])

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    )
  }

  const getStageIcon = (stage: Task['stage']) => {
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
  const renderTasksByStage = (stage: Task['stage'], tasks: Task[]) => {
    if (tasks.length === 0) return null

    return (
      <div key={stage} className="space-y-3">
        <h4 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground pb-2 border-b border-border">
          {TASK_STAGE_CONFIG[stage].label} ({tasks.length})
        </h4>
        {tasks.map((task) => (
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

  return (
    <div className="container mx-auto px-4 py-8">
      <header className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <h2 className="text-3xl font-bold tracking-tight">Feature: {MOCK_FEATURE.id}</h2>
          <Badge className={STAGE_CONFIG[MOCK_FEATURE.status].color}>
            {STAGE_CONFIG[MOCK_FEATURE.status].label}
          </Badge>
        </div>
        <p className="text-muted-foreground mt-2 max-w-2xl">{MOCK_FEATURE.description}</p>
        <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
          <span>{MOCK_FEATURE.taskCount} tasks</span>
          <span>{progress}% complete</span>
          <span>Updated {MOCK_FEATURE.lastUpdated}</span>
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
          <h3 className="text-xl font-semibold">Tasks ({MOCK_TASKS.length})</h3>
          
          {renderTasksByStage('done', groupedTasks.done)}
          {renderTasksByStage('pm-check', groupedTasks['pm-check'])}
          {renderTasksByStage('review', groupedTasks.review)}
          {renderTasksByStage('dev', groupedTasks.dev)}
          {renderTasksByStage('backlog', groupedTasks.backlog)}
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
                <p className="font-medium">{MOCK_FEATURE.id}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">Status</p>
                <Badge className={STAGE_CONFIG[MOCK_FEATURE.status].color}>
                  {STAGE_CONFIG[MOCK_FEATURE.status].label}
                </Badge>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">Total Tasks</p>
                <p className="font-medium">{MOCK_FEATURE.taskCount}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">In Progress</p>
                <p className="font-medium">{MOCK_FEATURE.tasksInProgress}</p>
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
