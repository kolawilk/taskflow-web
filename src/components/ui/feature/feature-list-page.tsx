import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Building2 } from 'lucide-react'

export type FeatureStage = 'backlog' | 'dev' | 'review' | 'pm-check' | 'done'

export interface Feature {
  id: string
  title: string
  description: string
  status: FeatureStage
  taskCount: number
  tasksInProgress: number
  lastUpdated: string
}

const STAGE_CONFIG: Record<FeatureStage, { label: string; color: string }> = {
  backlog: { label: 'Backlog', color: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400' },
  dev: { label: 'In Dev', color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' },
  review: { label: 'Review', color: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' },
  'pm-check': { label: 'PM Check', color: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400' },
  done: { label: 'Done', color: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' },
}

const MOCK_FEATURES: Feature[] = [
  {
    id: 'TASKFLOW-F001',
    title: 'Dashboard & Projects View',
    description: 'Create the main dashboard showing all projects with their status and overview',
    status: 'done',
    taskCount: 2,
    tasksInProgress: 0,
    lastUpdated: '2 days ago',
  },
  {
    id: 'TASKFLOW-F002',
    title: 'Inbox Management',
    description: 'Implement a feature management system with priority, status tracking, and search',
    status: 'done',
    taskCount: 4,
    tasksInProgress: 0,
    lastUpdated: '1 day ago',
  },
  {
    id: 'TASKFLOW-F003',
    title: 'Task Detail & Management',
    description: 'Build detailed task views with progress tracking and team member assignments',
    status: 'done',
    taskCount: 3,
    tasksInProgress: 0,
    lastUpdated: '12 hours ago',
  },
  {
    id: 'TASKFLOW-F004',
    title: 'Feature Detail & Task Management',
    description: 'Detailed view for individual features showing all tasks, their status, progress',
    status: 'dev',
    taskCount: 4,
    tasksInProgress: 1,
    lastUpdated: '2 hours ago',
  },
  {
    id: 'TASKFLOW-F005',
    title: 'Settings & User Preferences',
    description: 'Implement user settings and application preferences management',
    status: 'backlog',
    taskCount: 2,
    tasksInProgress: 0,
    lastUpdated: '3 days ago',
  },
]

export function FeatureListPage() {
  const [loading, setLoading] = useState(true)

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

  const getProgress = (feature: Feature) => {
    return Math.round(((feature.taskCount - feature.tasksInProgress) / feature.taskCount) * 100)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <header className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Features</h2>
          <p className="text-muted-foreground mt-1">Manage and track feature progress</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span>{MOCK_FEATURES.filter(f => f.status === 'done').length} done</span>
          <span>{MOCK_FEATURES.filter(f => f.status === 'dev').length} in dev</span>
          <span>{MOCK_FEATURES.filter(f => f.status === 'backlog').length} backlog</span>
        </div>
      </header>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {MOCK_FEATURES.map((feature) => (
          <Link key={feature.id} to={`/features/${feature.id}`}>
            <Card className="hover:shadow-lg transition-all duration-300 cursor-pointer h-full hover:-translate-y-1">
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                  <Badge variant="outline" className={STAGE_CONFIG[feature.status].color}>
                    {STAGE_CONFIG[feature.status].label}
                  </Badge>
                </div>
                <CardDescription>{feature.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Progress Bar */}
                  <div>
                    <div className="flex justify-between text-xs text-muted-foreground mb-1">
                      <span>Progress</span>
                      <span>{getProgress(feature)}%</span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                      <div
                        className={`h-full transition-all duration-500 ${
                          feature.status === 'done'
                            ? 'bg-emerald-500'
                            : feature.status === 'dev'
                            ? 'bg-blue-500'
                            : 'bg-slate-400'
                        }`}
                        style={{ width: `${getProgress(feature)}%` }}
                      />
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="flex items-center justify-between text-sm text-muted-foreground pt-2 border-t border-border">
                    <div className="flex items-center gap-2">
                      <Building2 className="h-4 w-4" />
                      <span>{feature.taskCount} tasks</span>
                    </div>
                    <span>Updated {feature.lastUpdated}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}
