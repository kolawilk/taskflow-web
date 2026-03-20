import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Copy, Check, ArrowLeft } from 'lucide-react'
import { api, Task as ApiTask, TaskHistoryEntry as ApiTaskHistoryEntry } from '@/services/api'
import type { TaskStage, Priority } from '@/types/task'
import { TaskTimeline } from './task-timeline'

const STAGE_CONFIG: Record<TaskStage, { label: string; color: string }> = {
  backlog: { label: 'Backlog', color: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400' },
  dev: { label: 'In Dev', color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' },
  review: { label: 'Review', color: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' },
  'pm-check': { label: 'PM Check', color: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400' },
  done: { label: 'Done', color: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' },
}

const PRIORITY_CONFIG: Partial<Record<Priority, { label: string; color: string }>> = {
  low: { label: 'Low', color: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400' },
  medium: { label: 'Medium', color: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' },
  high: { label: 'High', color: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' },
}

export function TaskDetailPage() {
  const navigate = useNavigate()
  const { id: taskId } = useParams<{ id: string }>()

  const [task, setTask] = useState<ApiTask | null>(null)
  const [history, setHistory] = useState<ApiTaskHistoryEntry[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [taskError, setTaskError] = useState<string | null>(null)
  const [historyError, setHistoryError] = useState<string | null>(null)
  const [copiedBranch, setCopiedBranch] = useState(false)

  // Fetch task data
  useEffect(() => {
    if (!taskId) {
      setTaskError('No task ID provided')
      setIsLoading(false)
      return
    }

    const fetchTask = async () => {
      setIsLoading(true)
      setTaskError(null)
      try {
        const result = await api.getTaskById(taskId)
        if (result.data) {
          setTask(result.data)
        } else if (result.error) {
          setTaskError(result.error)
        }
      } catch (err) {
        setTaskError(err instanceof Error ? err.message : 'Failed to fetch task')
      }
      setIsLoading(false)
    }

    fetchTask()
  }, [taskId])

  // Fetch history data
  useEffect(() => {
    if (!taskId) {
      setHistoryError('No task ID provided')
      return
    }

    const fetchHistory = async () => {
      try {
        const result = await api.getTaskHistory(taskId)
        if (result.data) {
          setHistory(result.data)
        } else if (result.error) {
          setHistoryError(result.error)
        }
      } catch (err) {
        setHistoryError(err instanceof Error ? err.message : 'Failed to fetch task history')
      }
    }

    fetchHistory()
  }, [taskId])

  const handleCopyBranch = () => {
    if (task?.branch) {
      navigator.clipboard.writeText(task.branch)
      setCopiedBranch(true)
      setTimeout(() => setCopiedBranch(false), 2000)
    }
  }

  // Parse acceptance criteria from API string field
  const parseAcceptanceCriteria = (criteriaString: string | null): string[] => {
    if (!criteriaString) return []
    try {
      return JSON.parse(criteriaString)
    } catch {
      return []
    }
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center py-16">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
        </div>
      </div>
    )
  }

  // Error state
  if (taskError) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Button variant="ghost" onClick={() => navigate(-1)} className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <Card className="max-w-2xl mx-auto mt-8">
          <CardHeader>
            <CardTitle>Error Loading Task</CardTitle>
            <CardDescription>{taskError}</CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" onClick={() => window.location.reload()}>
              Retry
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Task not found
  if (!task) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Button variant="ghost" onClick={() => navigate(-1)} className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <Card className="max-w-2xl mx-auto mt-8">
          <CardHeader>
            <CardTitle>Task Not Found</CardTitle>
            <CardDescription>The requested task could not be found.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" onClick={() => navigate(-1)}>
              Back
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const stage = task.stage as TaskStage
  const priority = (task.priority || 'medium') as Priority
  const priorityLabel = PRIORITY_CONFIG[priority]?.label || 'Medium'
  const priorityColor = PRIORITY_CONFIG[priority]?.color
  const acceptanceCriteria = parseAcceptanceCriteria(task.acceptance_criteria)

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Back Button */}
      <Button variant="ghost" onClick={() => navigate(-1)} className="mb-4">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back
      </Button>

      <header className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <h2 className="text-3xl font-bold tracking-tight">{task.id}</h2>
          <Badge className={STAGE_CONFIG[stage]?.color || STAGE_CONFIG.backlog.color}>
            {STAGE_CONFIG[stage]?.label || stage}
          </Badge>
        </div>
        <h1 className="text-2xl font-semibold mb-2">{task.title}</h1>
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <span>Priority: <Badge variant="outline" className={priorityColor}>{priorityLabel}</Badge></span>
          <span>Iteration: {task.iteration}</span>
          <span>Branch: <code className="bg-muted px-2 py-1 rounded text-xs">{task.branch}</code></span>
        </div>
      </header>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Description */}
          <Card>
            <CardHeader>
              <CardTitle>Description</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">{task.description || 'No description provided.'}</p>
            </CardContent>
          </Card>

          {/* Acceptance Criteria */}
          {acceptanceCriteria.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Acceptance Criteria</CardTitle>
                <CardDescription>{acceptanceCriteria.length} criteria</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {acceptanceCriteria.map((criteria, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 rounded-lg hover:bg-accent/30 transition-colors">
                      <div className="mt-0.5 h-4 w-4 rounded border border-border bg-background flex items-center justify-center">
                        <div className="h-2 w-2 rounded-full bg-primary" />
                      </div>
                      <p className="text-sm leading-relaxed">{criteria}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Feature Link */}
          {task.feature_id && (
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  {task.feature_id}
                  <span className="text-sm font-normal text-muted-foreground">{task.feature_title}</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Button variant="outline" onClick={() => navigate(`/features/${task.feature_id}`)} className="w-full">
                  View Feature
                </Button>
              </CardContent>
            </Card>
          )}

          {/* History */}
          <Card>
            <CardHeader>
              <CardTitle>History</CardTitle>
            </CardHeader>
            <CardContent>
              {historyError ? (
                <p className="text-sm text-muted-foreground">Failed to load history: {historyError}</p>
              ) : history.length > 0 ? (
                <TaskTimeline history={history} />
              ) : (
                <p className="text-sm text-muted-foreground">No history available.</p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Task Info */}
          <Card>
            <CardHeader>
              <CardTitle>Task Info</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">Assigned Agent</p>
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-medium">
                    {task.assigned_agent?.charAt(0).toUpperCase() || '?'}
                  </div>
                  <span className="font-medium">{task.assigned_agent || 'Unassigned'}</span>
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">Priority</p>
                <Badge variant="outline" className={priorityColor}>
                  {priorityLabel}
                </Badge>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">Stage</p>
                <Badge className={STAGE_CONFIG[stage]?.color || STAGE_CONFIG.backlog.color}>
                  {STAGE_CONFIG[stage]?.label || stage}
                </Badge>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">Iteration</p>
                <p className="font-medium">{task.iteration}</p>
              </div>
            </CardContent>
          </Card>

          {/* Branch */}
          <Card>
            <CardHeader>
              <CardTitle>Branch</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <code className="flex-1 bg-muted px-3 py-2 rounded text-sm break-all">
                  {task.branch}
                </code>
                <Button variant="outline" size="icon" onClick={handleCopyBranch} title="Copy branch name">
                  {copiedBranch ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
