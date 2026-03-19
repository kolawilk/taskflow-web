import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Building2, CheckCircle2, AlertCircle, Archive } from 'lucide-react'
import { Link } from 'react-router-dom'

// Types
export type ProjectStatus = 'active' | 'on-hold' | 'archived' | 'planning'

export interface Project {
  id: string
  name: string
  description: string
  status: ProjectStatus
  taskCount: number
  featuresInProgress: number
  lastUpdated: string
}

// Mock data - would be replaced with real API call
const MOCK_PROJECTS: Project[] = [
  {
    id: 'taskflow-web',
    name: 'taskflow-web',
    description: 'Web UI for taskflow - manage projects, features, and tasks with a beautiful shadcn/ui interface',
    status: 'active',
    taskCount: 8,
    featuresInProgress: 3,
    lastUpdated: '2 hours ago',
  },
  {
    id: 'taskflow-api',
    name: 'taskflow-api',
    description: 'REST API for taskflow with full CRUD operations and webhooks',
    status: 'active',
    taskCount: 12,
    featuresInProgress: 4,
    lastUpdated: '5 hours ago',
  },
  {
    id: 'taskflow-mobile',
    name: 'taskflow-mobile',
    description: 'Mobile app for iOS and Android with push notifications',
    status: 'on-hold',
    taskCount: 0,
    featuresInProgress: 0,
    lastUpdated: '2 days ago',
  },
  {
    id: 'einsatzsim',
    name: 'einsatzsim',
    description: 'Fire department mission simulator for iPad/iPhone play sessions',
    status: 'active',
    taskCount: 1,
    featuresInProgress: 1,
    lastUpdated: '1 hour ago',
  },
]

function getStatusIcon(status: ProjectStatus) {
  switch (status) {
    case 'active':
      return <CheckCircle2 className="h-4 w-4 text-emerald-500" />
    case 'on-hold':
      return <AlertCircle className="h-4 w-4 text-amber-500" />
    case 'archived':
      return <Archive className="h-4 w-4 text-slate-400" />
    case 'planning':
      return <Building2 className="h-4 w-4 text-blue-500" />
    default:
      return null
  }
}

export function ProjectsList({ projects = MOCK_PROJECTS }: { projects?: Project[] }) {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate API call delay
    const timer = setTimeout(() => setLoading(false), 500)
    return () => clearTimeout(timer)
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    )
  }

  if (projects.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <Building2 className="h-16 w-16 text-muted-foreground mb-4" />
        <h3 className="text-lg font-semibold">No projects found</h3>
        <p className="text-muted-foreground mt-2 max-w-sm">
          Get started by creating a new project or importing from taskflow database.
        </p>
      </div>
    )
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {projects.map((project) => (
        <Link key={project.id} to={`/projects/${project.id}`}>
          <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
            <CardHeader className="pb-2">
              <div className="flex items-start justify-between">
                <CardTitle className="text-lg">{project.name}</CardTitle>
                {getStatusIcon(project.status)}
              </div>
              <CardDescription>{project.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                <div className="flex gap-4">
                  <span>{project.taskCount} tasks</span>
                  <span>{project.featuresInProgress} in progress</span>
                </div>
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-border">
                <span className="text-xs text-muted-foreground">Updated {project.lastUpdated}</span>
              </div>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  )
}
