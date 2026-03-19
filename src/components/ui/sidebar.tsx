import { Link, useLocation } from 'react-router-dom'
import { Button } from './button'
import { Menu } from 'lucide-react'

interface SidebarProps {
  isOpen: boolean
  onClose?: () => void
}

const navItems = [
  { name: 'Dashboard', path: '/' },
  { name: 'Projects', path: '/projects' },
  { name: 'Features', path: '/features' },
  { name: 'Tasks', path: '/tasks' },
]

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const location = useLocation()

  return (
    <aside
      className={`${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      } fixed inset-y-0 left-0 z-50 w-64 bg-background border-r border-border transition-transform duration-300 ease-in-out md:relative md:translate-x-0`}
    >
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h2 className="text-lg font-semibold">Taskflow</h2>
          <Button variant="ghost" size="icon" className="md:hidden" onClick={onClose}>
            <Menu className="h-5 w-5" />
          </Button>
        </div>

        <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                location.pathname === item.path
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
              }`}
            >
              {item.name}
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-border">
          <div className="mb-4">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
              Projects
            </h3>
            <div className="space-y-1">
              {['taskflow-web', 'taskflow-api', 'taskflow-mobile'].map((project) => (
                <Link
                  key={project}
                  to={`/projects/${project.toLowerCase().replace(/\s/g, '-')}`}
                  className="flex items-center px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-accent rounded-md transition-colors"
                >
                  <div className="w-2 h-2 rounded-full bg-primary mr-2" />
                  {project}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </aside>
  )
}

export function MobileHeader({ onMenuClick }: { onMenuClick: () => void }) {
  return (
    <header className="md:hidden fixed top-0 left-0 right-0 z-40 h-16 bg-background border-b border-border flex items-center justify-between px-4">
      <Button variant="ghost" size="icon" onClick={onMenuClick}>
        <Menu className="h-6 w-6" />
      </Button>
      <h1 className="text-lg font-semibold">Taskflow</h1>
      <div className="w-10" /> {/* Spacer for balance */}
    </header>
  )
}
