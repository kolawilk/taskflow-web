import { BrowserRouter, Routes, Route } from 'react-router-dom'
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
import { api, Project } from './services/api'

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
  return (
    <div className="container mx-auto px-4 py-8">
      <header className="mb-8">
        <h2 className="text-3xl font-bold tracking-tight">Project: taskflow-web</h2>
        <p className="text-muted-foreground mt-2 max-w-2xl">
          Web UI for taskflow - manage projects, features, and tasks with a beautiful shadcn/ui interface
        </p>
      </header>
      
      <div className="rounded-xl border border-border bg-card p-6 mb-6 shadow-sm">
        <h3 className="text-lg font-semibold mb-4">Project Details</h3>
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Status</p>
            <Badge className="mt-1">Active</Badge>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Created</p>
            <p className="font-medium mt-1">March 18, 2026</p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Total Features</p>
            <p className="font-medium mt-1">8</p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Total Tasks</p>
            <p className="font-medium mt-1">24</p>
          </div>
        </div>
      </div>
    </div>
  )
}

// Feature Detail Page (imported from separate file)

// Task Detail Page
function TaskDetailPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <header className="mb-8">
        <h2 className="text-3xl font-bold tracking-tight">Task: TASKFLOW-T001</h2>
        <p className="text-muted-foreground mt-2 max-w-2xl">
          Initialize the React + Vite project with shadcn/ui
        </p>
      </header>
      
      <div className="rounded-xl border border-border bg-card p-6 mb-6 shadow-sm">
        <h3 className="text-lg font-semibold mb-4">Task Details</h3>
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Status</p>
            <Badge className="mt-1 bg-emerald-500 text-emerald-50 hover:bg-emerald-600">Done</Badge>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Assigned</p>
            <p className="font-medium mt-1">Dev</p>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card p-6 mb-6 shadow-sm">
        <h3 className="text-lg font-semibold mb-4">Acceptance Criteria</h3>
        <ul className="space-y-3">
          <li className="flex items-start gap-3 p-3 rounded-lg hover:bg-accent/30 transition-colors">
            <span className="text-green-500 mt-1">✓</span>
            <span>React + Vite setup complete</span>
          </li>
          <li className="flex items-start gap-3 p-3 rounded-lg hover:bg-accent/30 transition-colors">
            <span className="text-green-500 mt-1">✓</span>
            <span>shadcn/ui installed and configured</span>
          </li>
          <li className="flex items-start gap-3 p-3 rounded-lg hover:bg-accent/30 transition-colors">
            <span className="text-green-500 mt-1">✓</span>
            <span>Dark mode support enabled</span>
          </li>
        </ul>
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
