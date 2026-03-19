import type { InboxItem, InboxItemStatus } from '../../../types/inbox'
import { Badge } from '@/components/ui/badge'

export function InboxItemCard({ item }: { item: InboxItem }) {
  const statusColors: Record<InboxItemStatus, string> = {
    new: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 border-blue-200 dark:border-blue-800',
    processed: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800',
    archived: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400 border-slate-200 dark:border-slate-700',
    'needs-attention': 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 border-amber-200 dark:border-amber-800',
  }

  const priorityColors: Record<string, string> = {
    high: 'text-red-600 dark:text-red-400 font-semibold',
    medium: 'text-orange-600 dark:text-orange-400 font-semibold',
    low: 'text-slate-500 dark:text-slate-400',
  }

  const getStatusIcon = (status: InboxItemStatus) => {
    switch (status) {
      case 'new':
        return <div className="h-2 w-2 rounded-full bg-blue-500" />
      case 'processed':
        return <div className="h-2 w-2 rounded-full bg-emerald-500" />
      case 'archived':
        return <div className="h-2 w-2 rounded-full bg-slate-500" />
      case 'needs-attention':
        return <div className="h-2 w-2 rounded-full bg-amber-500" />
    }
  }

  return (
    <div className="group rounded-xl border border-border bg-card p-6 transition-all duration-300 hover:border-primary/50 hover:shadow-lg">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-1.5">
            {getStatusIcon(item.status)}
            <span className="text-xs font-medium capitalize text-muted-foreground">{item.status}</span>
          </div>
          {item.category && (
            <span className="text-xs text-muted-foreground">• {item.category}</span>
          )}
        </div>
        <div className="text-xs text-muted-foreground">
          {new Date(item.timestamp).toLocaleDateString()}
        </div>
      </div>
      
      <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors">{item.title}</h3>
      
      <p className="text-sm text-muted-foreground mb-4 line-clamp-2 leading-relaxed">
        {item.description}
      </p>
      
      <div className="flex items-center justify-between pt-3 border-t border-border">
        <div className="flex items-center gap-2">
          {item.priority && (
            <span className={`text-xs font-medium ${priorityColors[item.priority] || priorityColors.low}`}>
              {item.priority}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className={statusColors[item.status]}>
            {item.status}
          </Badge>
        </div>
      </div>
    </div>
  )
}
