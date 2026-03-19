import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { DashboardLayout } from './components/ui/dashboard-layout'
import { ThemeToggle } from './components/ui/theme-toggle'
import { Button } from './components/ui/button'

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

export default function App() {
  return (
    <BrowserRouter>
      <DashboardLayout>
        <Routes>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/projects" element={<ProjectsPage />} />
          <Route path="/projects/:id" element={<div>Project Details</div>} />
          <Route path="*" element={<div>Not Found</div>} />
        </Routes>
      </DashboardLayout>
    </BrowserRouter>
  )
}
