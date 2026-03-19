import { type TaskHistoryEntry } from '@/types/task'
import { Badge } from '@/components/ui/badge'

// Action configuration for visual styling
const ACTION_CONFIG: Record<string, { label: string; icon: React.ReactNode; color: string }> = {
  created: { label: 'Created', icon: '➕', color: 'text-blue-500' },
  claimed: { label: 'Claimed', icon: '📋', color: 'text-purple-500' },
  advanced: { label: 'Advanced', icon: '➡️', color: 'text-green-500' },
  rejected: { label: 'Rejected', icon: '❌', color: 'text-red-500' },
}

// Stage transition display
function getStageTransition(action: string, message: string): string | null {
  if (action === 'advanced' && message.includes('from') && message.includes('to')) {
    const match = message.match(/from (\w+) to (\w+)/i)
    if (match) {
      return `${match[1]} → ${match[2]}`
    }
  }
  return null
}

// Iteration change display
function getIterationChange(message: string): string | null {
  const match = message.match(/iteration (\d+) → (\d+)/i)
  if (match) {
    return `Iteration: ${match[1]} → ${match[2]}`
  }
  return null
}

export function TaskTimeline({ history }: { history: TaskHistoryEntry[] }) {
  if (history.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-center">
        <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mb-4">
          <span className="text-3xl">⏳</span>
        </div>
        <p className="text-muted-foreground">No history yet</p>
        <p className="text-xs text-muted-foreground mt-2">Task will appear here when actions are taken</p>
      </div>
    )
  }

  return (
    <div className="relative space-y-6">
      {/* Timeline line */}
      <div className="absolute left-3 top-4 bottom-4 w-0.5 bg-border" />

      <div className="space-y-6">
        {history.map((entry, idx) => {
          const actionConfig = ACTION_CONFIG[entry.action] || { label: entry.action, icon: 'ℹ️', color: 'text-muted-foreground' }
          const stageTransition = getStageTransition(entry.action, entry.message)
          const iterationChange = getIterationChange(entry.message)

          return (
            <div key={entry.id} className="relative pl-9">
              {/* Timeline node */}
              <div className={`absolute left-0 top-1.5 h-6 w-6 rounded-full border-2 border-background ${idx === 0 ? 'bg-primary' : 'bg-background'} flex items-center justify-center`}>
                <span className={`text-sm ${idx === 0 ? 'text-primary-foreground' : actionConfig.color}`}>
                  {actionConfig.icon}
                </span>
              </div>

              <div className="rounded-lg border border-border bg-card p-4 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className={`font-medium ${actionConfig.color}`}>{actionConfig.label}</span>
                    {stageTransition && (
                      <Badge variant="outline" className="text-xs bg-accent text-accent-foreground">
                        {stageTransition}
                      </Badge>
                    )}
                    {iterationChange && (
                      <Badge variant="outline" className="text-xs bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
                        {iterationChange}
                      </Badge>
                    )}
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {new Date(entry.timestamp).toLocaleString()}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-sm">
                  <span className="text-muted-foreground">by</span>
                  <span className="font-medium">{entry.agent || 'Unknown'}</span>
                </div>

                <p className="text-sm text-muted-foreground mt-2">{entry.message}</p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
