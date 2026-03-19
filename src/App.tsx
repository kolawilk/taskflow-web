import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { DashboardLayout } from './components/ui/dashboard-layout'
import { ThemeToggle } from './components/ui/theme-toggle'
import { Button } from './components/ui/button'
import { InboxPage } from './components/ui/inbox'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './components/ui/card'
import { Badge } from './components/ui/badge'
import { ProjectsList } from './components/ui/projects-list'
import { FeatureDetailPage as FeatureDetailPageComponent } from './components/ui/feature/feature-detail-page'
import { FeatureListPage } from './components/ui/feature/feature-list-page'

// Dashboard Page
function DashboardPage() {
  const stats = [
    { name: 'Total Projects', value: '5', icon: null },
    { name: 'Active Tasks', value: '24', icon: null },
    { name: 'In Review', value: '3', icon: null },
    { name: 'Completed', value: '42', icon: null },
  ]

  const projects = [
    { name: 'taskflow-web', status: 'Active', lastUpdated: '2h ago' },
    { name: 'taskflow-api', status: 'Active', lastUpdated: '4h ago' },
    { name: 'taskflow-mobile', status: 'Planning', lastUpdated: '1d ago' },
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      <header className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
          <p className="text-muted-foreground mt-1">Overview of your projects and tasks</p>
        </div>
        <ThemeToggle />
      </header>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
        {stats.map((stat, idx) => (
          <Card key={idx} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <h3 className="text-sm font-medium text-muted-foreground">{stat.name}</h3>
              <p className="text-3xl font-bold mt-2">{stat.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="hover:shadow-lg transition-shadow">
        <CardHeader>
          <CardTitle>Projects</CardTitle>
          <CardDescription>Manage your projects and track progress</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="divide-y divide-border">
            {projects.map((project, idx) => (
              <div key={idx} className="flex items-center justify-between py-4 hover:bg-accent/50 rounded-lg transition-colors px-4">
                <div>
                  <h4 className="font-semibold">{project.name}</h4>
                  <p className="text-sm text-muted-foreground">Updated {project.lastUpdated}</p>
                </div>
                <Badge variant="secondary">{project.status}</Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// Projects Page
function ProjectsPage() {
  const projects = [
    { name: 'taskflow-web', description: 'Web UI for taskflow', status: 'Active' },
    { name: 'taskflow-api', description: 'REST API for taskflow', status: 'Active' },
    { name: 'taskflow-mobile', description: 'Mobile app for taskflow', status: 'Planning' },
  ]

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
      
      <ProjectsList projects={projects as any} />
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
