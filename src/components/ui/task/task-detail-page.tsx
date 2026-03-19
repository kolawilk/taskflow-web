import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Copy, Check, ArrowLeft } from 'lucide-react'
import type { Task, TaskStage, TaskHistoryEntry, Priority } from '@/types/task'
import { TaskTimeline } from './task-timeline'

// Mock task data - multiple tasks for demo
const MOCK_TASKS: Record<string, Task> = {
  'TASKFLOW-T005': {
    id: 'TASKFLOW-T005',
    title: 'Create task detail page with full information',
    description: 'Build a comprehensive task detail page showing title, description, acceptance criteria checklist, current stage, assigned agent, priority, and iteration count.',
    stage: 'dev',
    assignedAgent: 'dev',
    priority: 'high',
    iteration: 1,
    branch: 'feat/taskflow-f005-task-detail-&-history-view',
    featureId: 'TASKFLOW-F005',
    featureTitle: 'Task Detail & History View',
    acceptanceCriteria: [
      'Task detail page displays full task title and description',
      'Acceptance criteria are shown as a checklist with checkboxes',
      'Current stage is prominently displayed (backlog, dev, review, pm-check, done)',
      'Assigned agent is shown with avatar or name',
      'Priority and iteration count are visible',
      'Feature link navigates back to feature detail',
      'Branch name is displayed and copyable',
      'Page is responsive for MacBook Air and iPad',
      'Dark mode styling is consistent with shadcn/ui theme',
    ],
    createdAt: '2026-03-19T00:07:52Z',
    updatedAt: '2026-03-19T06:28:00Z',
  },
  'TASKFLOW-T001': {
    id: 'TASKFLOW-T001',
    title: 'Initialize project structure',
    description: 'React + Vite setup with shadcn/ui',
    stage: 'done',
    assignedAgent: 'dev',
    priority: 'high',
    iteration: 1,
    branch: 'feat/taskflow-f002-initial-setup',
    featureId: 'TASKFLOW-F002',
    featureTitle: 'Dashboard & Projects View',
    acceptanceCriteria: [
      'React + Vite setup complete',
      'shadcn/ui installed and configured',
      'Dark mode support enabled',
    ],
    createdAt: '2026-03-18T22:00:00Z',
    updatedAt: '2026-03-19T00:30:00Z',
  },
  'TASKFLOW-T002': {
    id: 'TASKFLOW-T002',
    title: 'Configure dark mode',
    description: 'Implement dark mode support using next-themes',
    stage: 'done',
    assignedAgent: 'dev',
    priority: 'high',
    iteration: 1,
    branch: 'feat/taskflow-f002-dark-mode',
    featureId: 'TASKFLOW-F002',
    featureTitle: 'Dashboard & Projects View',
    acceptanceCriteria: [
      'Light/dark toggle implemented',
      'System preference detection',
      'Persistent theme selection',
    ],
    createdAt: '2026-03-19T00:00:00Z',
    updatedAt: '2026-03-19T01:00:00Z',
  },
}

const MOCK_HISTORY: TaskHistoryEntry[] = [
  {
    id: 'h1',
    action: 'created',
    agent: 'pm',
    message: 'Task created: Create task detail page with full information',
    timestamp: '2026-03-19T00:07:52Z',
  },
  {
    id: 'h2',
    action: 'advanced',
    agent: 'pm',
    message: 'Released from backlog',
    timestamp: '2026-03-19T06:27:56Z',
  },
  {
    id: 'h3',
    action: 'claimed',
    agent: 'dev',
    message: 'Claimed by dev',
    timestamp: '2026-03-19T06:28:15Z',
  },
]

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
  const { id } = useParams<{ id: string }>()
  const [copiedBranch, setCopiedBranch] = useState(false)
  const [history, setHistory] = useState<TaskHistoryEntry[]>([])
  const [loadingHistory, setLoadingHistory] = useState(false)

  // Look up task by ID from mock data
  const task = id ? MOCK_TASKS[id] : undefined

  // Fetch history on mount
  useEffect(() => {
    if (id) {
      setLoadingHistory(true)
      fetch(`/api/tasks/${id}/history`)
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            setHistory(data.data)
          }
        })
        .catch(() => {
          // Fallback to mock history if API fails
          setHistory(MOCK_HISTORY)
        })
        .finally(() => {
          setLoadingHistory(false)
        })
    }
  }, [id])

  // Handle missing task - show 404-like state
  if (!task) {
    return (
      <div className="container mx-auto px-4 py-8">
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

  // Handle priority with fallbacks for type safety
  const priorityLabel = PRIORITY_CONFIG[task.priority || 'medium']?.label
  const priorityColor = PRIORITY_CONFIG[task.priority || 'medium']?.color

  const handleCopyBranch = () => {
    navigator.clipboard.writeText(task.branch)
    setCopiedBranch(true)
    setTimeout(() => setCopiedBranch(false), 2000)
  }

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
          <Badge className={STAGE_CONFIG[task.stage].color}>
            {STAGE_CONFIG[task.stage].label}
          </Badge>
        </div>
        <h1 className="text-2xl font-semibold mb-2">{task.title}</h1>
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <span>Priority: <Badge variant="outline" className={priorityColor || 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'}>{priorityLabel || 'Medium'}</Badge></span>
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
              <p className="text-muted-foreground leading-relaxed">{task.description}</p>
            </CardContent>
          </Card>

          {/* Acceptance Criteria */}
          <Card>
            <CardHeader>
              <CardTitle>Acceptance Criteria</CardTitle>
              <CardDescription>{task.acceptanceCriteria.length} criteria</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {task.acceptanceCriteria.map((criteria) => (
                  <div key={criteria} className="flex items-start gap-3 p-3 rounded-lg hover:bg-accent/30 transition-colors">
                    <div className="mt-0.5 h-4 w-4 rounded border border-border bg-background flex items-center justify-center">
                      <div className="h-2 w-2 rounded-full bg-primary" />
                    </div>
                    <p className="text-sm leading-relaxed">{criteria}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Feature Link */}
          {task.featureId && (
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  {task.featureId}
                  <span className="text-sm font-normal text-muted-foreground">{task.featureTitle}</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Button variant="outline" onClick={() => navigate(`/features/${task.featureId}`)} className="w-full">
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
              {loadingHistory ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
                </div>
              ) : (
                <TaskTimeline history={history} />
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
                    {task.assignedAgent?.charAt(0).toUpperCase() || '?'}
                  </div>
                  <span className="font-medium">{task.assignedAgent || 'Unassigned'}</span>
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">Priority</p>
                <Badge variant="outline" className={priorityColor || 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'}>
                  {priorityLabel || 'Medium'}
                </Badge>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">Stage</p>
                <Badge className={STAGE_CONFIG[task.stage].color}>
                  {STAGE_CONFIG[task.stage].label}
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
