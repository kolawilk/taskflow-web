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

export function ProjectsList({ projects }: { projects: Project[] }) {
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
          <Card className="hover:shadow-lg transition-all duration-300 cursor-pointer h-full hover:-translate-y-1">
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
