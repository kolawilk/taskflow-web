import { useEffect, useState } from 'react'
import { api, Project } from '@/services/api'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { ThemeToggle } from '@/components/ui/theme-toggle'

interface DashboardStats {
  totalProjects: number
  activeTasks: number
  inReview: number
  completed: number
}

interface FeatureWithTasks {
  id: string
  title: string
  tasks?: { id: string }[]
}

interface ProjectWithFeatures extends Project {
  features?: FeatureWithTasks[]
}

export function DashboardPage() {
  const [projects, setProjects] = useState<ProjectWithFeatures[]>([])
  const [stats, setStats] = useState<DashboardStats>({
    totalProjects: 0,
    activeTasks: 0,
    inReview: 0,
    completed: 0,
  })
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchDashboardData() {
      setIsLoading(true)
      setError(null)

      try {
        // Step 1: Fetch all projects
        const projectsResult = await api.getProjects()

        if (projectsResult.error) {
          setError(projectsResult.error)
          setIsLoading(false)
          return
        }

        const projectsData = projectsResult.data || []
        setProjects(projectsData)

        // Step 2: For each project, fetch features to get task counts
        // We need to calculate: active tasks, in review, completed
        let totalActiveTasks = 0
        let totalInReview = 0
        let totalCompleted = 0

        // Fetch features and tasks for all projects
        const featurePromises = projectsData.map(async (project) => {
          try {
            const featuresResult = await api.getFeaturesByProject(project.id)
            const features = featuresResult.data || []

            // For each feature, fetch tasks
            const taskPromises = features.map(async (feature) => {
              try {
                const tasksResult = await api.getTasksByFeature(feature.id)
                const tasks = tasksResult.data || []

                // Count tasks by stage
                tasks.forEach((task) => {
                  const stage = task.stage?.toLowerCase()
                  if (stage === 'done' || stage === 'completed') {
                    totalCompleted++
                  } else if (stage === 'review') {
                    totalInReview++
                  } else if (stage === 'dev' || stage === 'pm-check') {
                    totalActiveTasks++
                  }
                })

                return { ...feature, tasks }
              } catch {
                return { ...feature, tasks: [] }
              }
            })

            const featuresWithTasks = await Promise.all(taskPromises)
            return { ...project, features: featuresWithTasks }
          } catch {
            return { ...project, features: [] }
          }
        })

        const projectsWithFeatures = await Promise.all(featurePromises)
        setProjects(projectsWithFeatures)

        // Update stats - also count tasks in backlog as active
        setStats({
          totalProjects: projectsData.length,
          activeTasks: totalActiveTasks,
          inReview: totalInReview,
          completed: totalCompleted,
        })
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch dashboard data')
      } finally {
        setIsLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  const formatDate = (dateString: string | null | undefined): string => {
    if (!dateString) return 'N/A'
    try {
      const date = new Date(dateString)
      const now = new Date()
      const diffMs = now.getTime() - date.getTime()
      const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
      const diffDays = Math.floor(diffHours / 24)

      if (diffHours < 1) return 'Just now'
      if (diffHours < 24) return `${diffHours}h ago`
      if (diffDays < 7) return `${diffDays}d ago`
      return date.toLocaleDateString()
    } catch {
      return 'N/A'
    }
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <header className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
            <p className="text-muted-foreground mt-1">Overview of your projects and tasks</p>
          </div>
          <ThemeToggle />
        </header>
        <Card className="border-destructive">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 text-destructive">
              <span className="text-xl">⚠️</span>
              <div>
                <p className="font-semibold">Unable to connect to API</p>
                <p className="text-sm text-muted-foreground mt-1">{error}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <header className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
          <p className="text-muted-foreground mt-1">Overview of your projects and tasks</p>
        </div>
        <ThemeToggle />
      </header>

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            {isLoading ? (
              <>
                <Skeleton className="h-4 w-24 mb-2" />
                <Skeleton className="h-8 w-16 mt-2" />
              </>
            ) : (
              <>
                <h3 className="text-sm font-medium text-muted-foreground">Total Projects</h3>
                <p className="text-3xl font-bold mt-2">{stats.totalProjects}</p>
              </>
            )}
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            {isLoading ? (
              <>
                <Skeleton className="h-4 w-24 mb-2" />
                <Skeleton className="h-8 w-16 mt-2" />
              </>
            ) : (
              <>
                <h3 className="text-sm font-medium text-muted-foreground">Active Tasks</h3>
                <p className="text-3xl font-bold mt-2">{stats.activeTasks}</p>
              </>
            )}
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            {isLoading ? (
              <>
                <Skeleton className="h-4 w-24 mb-2" />
                <Skeleton className="h-8 w-16 mt-2" />
              </>
            ) : (
              <>
                <h3 className="text-sm font-medium text-muted-foreground">In Review</h3>
                <p className="text-3xl font-bold mt-2">{stats.inReview}</p>
              </>
            )}
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            {isLoading ? (
              <>
                <Skeleton className="h-4 w-24 mb-2" />
                <Skeleton className="h-8 w-16 mt-2" />
              </>
            ) : (
              <>
                <h3 className="text-sm font-medium text-muted-foreground">Completed</h3>
                <p className="text-3xl font-bold mt-2">{stats.completed}</p>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Projects List */}
      <Card className="hover:shadow-lg transition-shadow">
        <CardHeader>
          <CardTitle>Projects</CardTitle>
          <CardDescription>Manage your projects and track progress</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center justify-between py-4 px-4">
                  <div className="space-y-2">
                    <Skeleton className="h-5 w-32" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                  <Skeleton className="h-6 w-16" />
                </div>
              ))}
            </div>
          ) : projects.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <p>No projects found. Create your first project to get started.</p>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {projects.map((project) => {
                const featureCount = project.features?.length || 0
                const taskCount = project.features?.reduce((sum, f) => sum + (f.tasks?.length || 0), 0) || 0

                return (
                  <div
                    key={project.id}
                    className="flex items-center justify-between py-4 hover:bg-accent/50 rounded-lg transition-colors px-4"
                  >
                    <div>
                      <h4 className="font-semibold">{project.name}</h4>
                      <p className="text-sm text-muted-foreground">
                        {featureCount} {featureCount === 1 ? 'feature' : 'features'} • {taskCount} {taskCount === 1 ? 'task' : 'tasks'}
                      </p>
                      {project.description && (
                        <p className="text-sm text-muted-foreground mt-1 line-clamp-1">
                          {project.description}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-muted-foreground">
                        {formatDate(project.updated_at)}
                      </span>
                      <Badge variant="secondary">Active</Badge>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
