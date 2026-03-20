import { BrowserRouter, Routes, Route, useParams } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { DashboardLayout } from './components/ui/dashboard-layout'
import { ThemeToggle } from './components/ui/theme-toggle'
import { Button } from './components/ui/button'
import { InboxPage } from './components/ui/inbox'
import { Badge } from './components/ui/badge'
import { ProjectsList } from './components/ui/projects-list'
import { FeatureDetailPage as FeatureDetailPageComponent } from './components/ui/feature/feature-detail-page'
import { FeatureListPage } from './components/ui/feature/feature-list-page'
import { DashboardPage } from './components/ui/dashboard/dashboard-page'
import { api, Project, Feature, Task, TaskHistoryEntry } from './services/api'

// Projects Page
function ProjectsPage() {
  const [projects, setProjects] = useState<import('./components/ui/projects-list').Project[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchProjects = async () => {
      setIsLoading(true)
      setError(null)
      const result = await api.getProjects()
      if (result.data) {
        // Transform API response to ProjectsList format
        const transformed = result.data.map((p: Project) => ({
          id: p.id,
          name: p.name,
          description: p.description || 'No description',
          status: 'active' as const,
          taskCount: 0,
          featuresInProgress: 0,
          lastUpdated: p.updated_at ? new Date(p.updated_at).toLocaleDateString() : 'Unknown',
        }))
        setProjects(transformed)
      } else if (result.error) {
        setError(result.error)
      }
      setIsLoading(false)
    }
    fetchProjects()
  }, [])

  return (
    <div className="container mx-auto px-4 py-8">
      <header className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Projects</h2>
          <p className="text-muted-foreground mt-1">Manage your projects and features</p>
        </div>
        <Button>
          <span className="mr-2">+</span> Create Project
        </Button>
      </header>
      
      {isLoading && (
        <div className="flex items-center justify-center py-12">
          <p className="text-muted-foreground">Loading projects...</p>
        </div>
      )}
      
      {error && (
        <div className="rounded-xl border border-red-500 bg-red-500/10 p-6 mb-6">
          <p className="text-red-500 font-medium">Error: {error}</p>
        </div>
      )}
      
      {!isLoading && !error && <ProjectsList projects={projects} />}
    </div>
  )
}

// Project Detail Page
function ProjectDetailPage() {
  const { id: projectId } = useParams<{ id: string }>()
  const [project, setProject] = useState<Project | null>(null)
  const [features, setFeatures] = useState<Feature[]>([])
  const [isLoadingProject, setIsLoadingProject] = useState(true)
  const [isLoadingFeatures, setIsLoadingFeatures] = useState(true)
  const [projectError, setProjectError] = useState<string | null>(null)
  const [featuresError, setFeaturesError] = useState<string | null>(null)

  useEffect(() => {
    const fetchProjectData = async () => {
      if (!projectId) {
        setProjectError('No project ID provided')
        setIsLoadingProject(false)
        return
      }

      setIsLoadingProject(true)
      setProjectError(null)
      
      // Fetch project details by finding in all projects
      const result = await api.getProjects()
      if (result.data) {
        const foundProject = result.data.find((p: Project) => p.id === projectId)
        if (foundProject) {
          setProject(foundProject)
        } else {
          setProjectError('Project not found')
        }
      } else if (result.error) {
        setProjectError(result.error)
      }
      setIsLoadingProject(false)
    }

    fetchProjectData()
  }, [projectId])

  useEffect(() => {
    const fetchFeatures = async () => {
      if (!projectId) {
        setFeaturesError('No project ID provided')
        setIsLoadingFeatures(false)
        return
      }

      setIsLoadingFeatures(true)
      setFeaturesError(null)
      
      const result = await api.getFeaturesByProject(projectId)
      if (result.data) {
        setFeatures(result.data)
      } else if (result.error) {
        setFeaturesError(result.error)
      }
      setIsLoadingFeatures(false)
    }

    fetchFeatures()
  }, [projectId])

  if (!projectId) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="rounded-xl border border-red-500 bg-red-500/10 p-6">
          <p className="text-red-500 font-medium">Error: No project ID provided</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <header className="mb-8">
        {isLoadingProject ? (
          <p className="text-muted-foreground">Loading project...</p>
        ) : projectError ? (
          <div className="rounded-xl border border-red-500 bg-red-500/10 p-4">
            <p className="text-red-500 font-medium">Error: {projectError}</p>
          </div>
        ) : project ? (
          <>
            <h2 className="text-3xl font-bold tracking-tight">Project: {project.name}</h2>
            <p className="text-muted-foreground mt-2 max-w-2xl">
              {project.description || 'No description'}
            </p>
          </>
        ) : null}
      </header>
      
      <div className="rounded-xl border border-border bg-card p-6 mb-6 shadow-sm">
        <h3 className="text-lg font-semibold mb-4">Project Details</h3>
        {isLoadingProject ? (
          <p className="text-muted-foreground">Loading...</p>
        ) : projectError ? (
          <p className="text-red-500">Error loading project details</p>
        ) : project ? (
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Status</p>
              <Badge className="mt-1">Active</Badge>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Created</p>
              <p className="font-medium mt-1">
                {project.created_at ? new Date(project.created_at).toLocaleDateString() : 'Unknown'}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Features</p>
              <p className="font-medium mt-1">{features.length}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Last Updated</p>
              <p className="font-medium mt-1">
                {project.updated_at ? new Date(project.updated_at).toLocaleDateString() : 'Unknown'}
              </p>
            </div>
          </div>
        ) : null}
      </div>

      <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
        <h3 className="text-lg font-semibold mb-4">Features</h3>
        {isLoadingFeatures ? (
          <p className="text-muted-foreground">Loading features...</p>
        ) : featuresError ? (
          <p className="text-red-500">Error: {featuresError}</p>
        ) : features.length === 0 ? (
          <p className="text-muted-foreground">No features found for this project.</p>
        ) : (
          <div className="space-y-3">
            {features.map((feature) => (
              <div key={feature.id} className="p-4 rounded-lg border border-border hover:bg-accent/30 transition-colors">
                <h4 className="font-medium">{feature.title}</h4>
                {feature.description && (
                  <p className="text-sm text-muted-foreground mt-1">{feature.description}</p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

// Feature Detail Page (imported from separate file)

// Task Detail Page
function TaskDetailPage() {
  const { id: taskId } = useParams<{ id: string }>()
  const [task, setTask] = useState<Task | null>(null)
  const [history, setHistory] = useState<TaskHistoryEntry[]>([])
  const [isLoadingTask, setIsLoadingTask] = useState(true)
  const [isLoadingHistory, setIsLoadingHistory] = useState(true)
  const [taskError, setTaskError] = useState<string | null>(null)
  const [historyError, setHistoryError] = useState<string | null>(null)

  useEffect(() => {
    const fetchTask = async () => {
      if (!taskId) {
        setTaskError('No task ID provided')
        setIsLoadingTask(false)
        return
      }

      setIsLoadingTask(true)
      setTaskError(null)
      
      const result = await api.getTaskById(taskId)
      if (result.data) {
        setTask(result.data)
      } else if (result.error) {
        setTaskError(result.error)
      }
      setIsLoadingTask(false)
    }

    fetchTask()
  }, [taskId])

  useEffect(() => {
    const fetchHistory = async () => {
      if (!taskId) {
        setHistoryError('No task ID provided')
        setIsLoadingHistory(false)
        return
      }

      setIsLoadingHistory(true)
      setHistoryError(null)
      
      const result = await api.getTaskHistory(taskId)
      if (result.data) {
        setHistory(result.data)
      } else if (result.error) {
        setHistoryError(result.error)
      }
      setIsLoadingHistory(false)
    }

    fetchHistory()
  }, [taskId])

  if (!taskId) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="rounded-xl border border-red-500 bg-red-500/10 p-6">
          <p className="text-red-500 font-medium">Error: No task ID provided</p>
        </div>
      </div>
    )
  }

  const getStageBadgeClass = (stage: string) => {
    switch (stage) {
      case 'done':
        return 'bg-emerald-500 text-emerald-50 hover:bg-emerald-600'
      case 'in-progress':
        return 'bg-blue-500 text-blue-50 hover:bg-blue-600'
      case 'review':
        return 'bg-amber-500 text-amber-50 hover:bg-amber-600'
      default:
        return 'bg-gray-500 text-gray-50 hover:bg-gray-600'
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <header className="mb-8">
        {isLoadingTask ? (
          <p className="text-muted-foreground">Loading task...</p>
        ) : taskError ? (
          <div className="rounded-xl border border-red-500 bg-red-500/10 p-4">
            <p className="text-red-500 font-medium">Error: {taskError}</p>
          </div>
        ) : task ? (
          <>
            <h2 className="text-3xl font-bold tracking-tight">Task: {task.title}</h2>
            <p className="text-muted-foreground mt-2 max-w-2xl">
              {task.description || 'No description'}
            </p>
          </>
        ) : null}
      </header>
      
      <div className="rounded-xl border border-border bg-card p-6 mb-6 shadow-sm">
        <h3 className="text-lg font-semibold mb-4">Task Details</h3>
        {isLoadingTask ? (
          <p className="text-muted-foreground">Loading...</p>
        ) : taskError ? (
          <p className="text-red-500">Error loading task details</p>
        ) : task ? (
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Stage</p>
              <Badge className={`mt-1 ${getStageBadgeClass(task.stage)}`}>
                {task.stage ? task.stage.charAt(0).toUpperCase() + task.stage.slice(1) : 'Unknown'}
              </Badge>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Assigned</p>
              <p className="font-medium mt-1">{task.assigned_agent || 'Unassigned'}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Feature</p>
              <p className="font-medium mt-1">{task.feature_title || 'Unknown'}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Iteration</p>
              <p className="font-medium mt-1">{task.iteration}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Priority</p>
              <p className="font-medium mt-1">{task.priority || 'None'}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Branch</p>
              <p className="font-medium mt-1 text-xs font-mono">{task.branch}</p>
            </div>
          </div>
        ) : null}
      </div>

      <div className="rounded-xl border border-border bg-card p-6 mb-6 shadow-sm">
        <h3 className="text-lg font-semibold mb-4">Acceptance Criteria</h3>
        {task?.acceptance_criteria ? (
          <ul className="space-y-3">
            {task.acceptance_criteria.split('\n').filter(c => c.trim()).map((criteria, index) => (
              <li key={index} className="flex items-start gap-3 p-3 rounded-lg hover:bg-accent/30 transition-colors">
                <span className="text-green-500 mt-1">✓</span>
                <span>{criteria.trim()}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-muted-foreground">No acceptance criteria defined</p>
        )}
      </div>

      <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
        <h3 className="text-lg font-semibold mb-4">Task History</h3>
        {isLoadingHistory ? (
          <p className="text-muted-foreground">Loading history...</p>
        ) : historyError ? (
          <p className="text-red-500">Error: {historyError}</p>
        ) : history.length === 0 ? (
          <p className="text-muted-foreground">No history entries found.</p>
        ) : (
          <div className="space-y-4">
            {history.map((entry) => (
              <div key={entry.id} className="flex items-start gap-4 p-4 rounded-lg border border-border hover:bg-accent/30 transition-colors">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-sm font-medium text-primary">
                    {entry.agent ? entry.agent.charAt(0).toUpperCase() : '?'}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium">{entry.action}</span>
                    {entry.agent && (
                      <Badge variant="outline" className="text-xs">
                        {entry.agent}
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">{entry.message}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {entry.timestamp ? new Date(entry.timestamp).toLocaleString() : ''}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

// Settings Page
function SettingsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <header className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Settings</h2>
          <p className="text-muted-foreground mt-1">Configure your application preferences</p>
        </div>
        <ThemeToggle />
      </header>
      
      <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
        <h3 className="text-lg font-semibold mb-4">Appearance</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 rounded-lg hover:bg-accent/30 transition-colors">
            <div>
              <p className="font-medium">Dark Mode</p>
              <p className="text-sm text-muted-foreground">Toggle between light and dark themes</p>
            </div>
            <div className="h-6 w-11 rounded-full bg-primary relative cursor-pointer transition-colors">
              <div className="absolute right-1 top-1 h-4 w-4 rounded-full bg-white shadow transition-transform"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <DashboardLayout>
        <Routes>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/projects" element={<ProjectsPage />} />
          <Route path="/projects/:id" element={<ProjectDetailPage />} />
          <Route path="/features" element={<FeatureListPage />} />
          <Route path="/features/:id" element={<FeatureDetailPageComponent />} />
          <Route path="/tasks/:id" element={<TaskDetailPage />} />
          <Route path="/inbox" element={<InboxPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="*" element={<div className="container mx-auto px-4 py-8"><h2 className="text-2xl font-bold">Not Found</h2></div>} />
        </Routes>
      </DashboardLayout>
    </BrowserRouter>
  )
}
