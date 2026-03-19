import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { DashboardLayout } from './components/ui/dashboard-layout'
import { ThemeToggle } from './components/ui/theme-toggle'
import { Button } from './components/ui/button'
import { InboxPage } from './components/ui/inbox'

// Dashboard Page
function DashboardPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <header className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold">Dashboard</h2>
        <ThemeToggle />
      </header>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <div className="rounded-xl border border-border bg-card p-6">
          <h3 className="text-sm font-medium text-muted-foreground">Total Projects</h3>
          <p className="text-3xl font-bold mt-2">5</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-6">
          <h3 className="text-sm font-medium text-muted-foreground">Active Tasks</h3>
          <p className="text-3xl font-bold mt-2">24</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-6">
          <h3 className="text-sm font-medium text-muted-foreground">In Review</h3>
          <p className="text-3xl font-bold mt-2">3</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-6">
          <h3 className="text-sm font-medium text-muted-foreground">Completed</h3>
          <p className="text-3xl font-bold mt-2">42</p>
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card">
        <div className="p-6 border-b border-border">
          <h3 className="text-lg font-semibold">Projects</h3>
        </div>
        <div className="divide-y divide-border">
          {[
            { name: 'taskflow-web', status: 'Active', lastUpdated: '2h ago' },
            { name: 'taskflow-api', status: 'Active', lastUpdated: '4h ago' },
            { name: 'taskflow-mobile', status: 'Planning', lastUpdated: '1d ago' },
          ].map((project, idx) => (
            <div key={idx} className="p-6 flex items-center justify-between hover:bg-accent/50 transition-colors">
              <div>
                <h4 className="font-medium">{project.name}</h4>
                <p className="text-sm text-muted-foreground">Updated {project.lastUpdated}</p>
              </div>
              <span className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
                {project.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// Projects Page
function ProjectsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <header className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold">Projects</h2>
        <Button>Create Project</Button>
      </header>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {[
          { name: 'taskflow-web', description: 'Web UI for taskflow', status: 'Active' },
          { name: 'taskflow-api', description: 'REST API for taskflow', status: 'Active' },
          { name: 'taskflow-mobile', description: 'Mobile app for taskflow', status: 'Planning' },
        ].map((project, idx) => (
          <div key={idx} className="rounded-xl border border-border bg-card p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-semibold text-lg">{project.name}</h3>
                <p className="text-muted-foreground mt-1">{project.description}</p>
              </div>
              <span className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
                {project.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// Project Detail Page
function ProjectDetailPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <header className="mb-8">
        <h2 className="text-2xl font-bold">Project: taskflow-web</h2>
        <p className="text-muted-foreground mt-1">Web UI for taskflow - manage projects, features, and tasks</p>
      </header>
      
      <div className="rounded-xl border border-border bg-card p-6 mb-6">
        <h3 className="text-lg font-semibold mb-4">Project Details</h3>
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Status</p>
            <p className="font-medium">Active</p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Created</p>
            <p className="font-medium">March 18, 2026</p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Total Features</p>
            <p className="font-medium">8</p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Total Tasks</p>
            <p className="font-medium">24</p>
          </div>
        </div>
      </div>
    </div>
  )
}

// Feature Detail Page
function FeatureDetailPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <header className="mb-8">
        <h2 className="text-2xl font-bold">Feature: Dashboard & Projects View</h2>
        <p className="text-muted-foreground mt-1">Create the main dashboard showing all projects with their status</p>
      </header>
      
      <div className="rounded-xl border border-border bg-card p-6 mb-6">
        <h3 className="text-lg font-semibold mb-4">Feature Details</h3>
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Feature ID</p>
            <p className="font-medium">TASKFLOW-F002</p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Status</p>
            <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800 dark:bg-green-900 dark:text-green-300">Complete</span>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Tasks</p>
            <p className="font-medium">2 of 2 done</p>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card">
        <div className="p-6 border-b border-border">
          <h3 className="text-lg font-semibold">Tasks</h3>
        </div>
        <div className="divide-y divide-border">
          {[
            { id: 'TASKFLOW-T001', title: 'Initialize project structure', status: 'Done' },
            { id: 'TASKFLOW-T002', title: 'Configure dark mode', status: 'Done' },
          ].map((task, idx) => (
            <div key={idx} className="p-6 flex items-center justify-between hover:bg-accent/50 transition-colors">
              <div>
                <p className="text-sm font-medium text-primary mb-1">{task.id}</p>
                <h4 className="font-medium">{task.title}</h4>
              </div>
              <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800 dark:bg-green-900 dark:text-green-300">
                {task.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// Task Detail Page
function TaskDetailPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <header className="mb-8">
        <h2 className="text-2xl font-bold">Task: TASKFLOW-T001</h2>
        <p className="text-muted-foreground mt-1">Initialize the React + Vite project with shadcn/ui</p>
      </header>
      
      <div className="rounded-xl border border-border bg-card p-6 mb-6">
        <h3 className="text-lg font-semibold mb-4">Task Details</h3>
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Status</p>
            <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800 dark:bg-green-900 dark:text-green-300">Done</span>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Assigned</p>
            <p className="font-medium">Dev</p>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card p-6 mb-6">
        <h3 className="text-lg font-semibold mb-4">Acceptance Criteria</h3>
        <ul className="space-y-3">
          <li className="flex items-start gap-3">
            <span className="text-green-500">✓</span>
            <span>React + Vite setup complete</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-green-500">✓</span>
            <span>shadcn/ui installed and configured</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-green-500">✓</span>
            <span>Dark mode support enabled</span>
          </li>
        </ul>
      </div>
    </div>
  )
}

// Inbox Page
function InboxPageComponent() {
  return <InboxPage />
}

// Settings Page
function SettingsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <header className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold">Settings</h2>
        <ThemeToggle />
      </header>
      
      <div className="rounded-xl border border-border bg-card p-6">
        <h3 className="text-lg font-semibold mb-4">Appearance</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Dark Mode</p>
              <p className="text-sm text-muted-foreground">Toggle between light and dark themes</p>
            </div>
            <div className="h-6 w-11 rounded-full bg-primary relative cursor-pointer">
              <div className="absolute right-1 top-1 h-4 w-4 rounded-full bg-white shadow"></div>
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
          <Route path="/features/:id" element={<FeatureDetailPage />} />
          <Route path="/tasks/:id" element={<TaskDetailPage />} />
          <Route path="/inbox" element={<InboxPageComponent />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="*" element={<div className="container mx-auto px-4 py-8"><h2 className="text-2xl font-bold">Not Found</h2></div>} />
        </Routes>
      </DashboardLayout>
    </BrowserRouter>
  )
}
