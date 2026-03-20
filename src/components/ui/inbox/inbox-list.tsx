import { useState, useEffect } from 'react'
import type { InboxItem, InboxFilter } from '../../../types/inbox'
import { InboxItemCard } from './inbox-item-card'
import { EmptyState } from './empty-state'
import { Skeleton } from '@/components/ui/skeleton'
import { AlertCircle } from 'lucide-react'

export function InboxList({ 
  items = [], 
  filter,
  isLoading = false,
  error = null,
}: { 
  items?: InboxItem[] 
  filter?: InboxFilter
  isLoading?: boolean
  error?: string | null
}) {
  const [filteredItems, setFilteredItems] = useState<InboxItem[]>([])

  useEffect(() => {
    if (!filter) {
      setFilteredItems(items)
      return
    }

    let result = [...items]

    if (filter.status) {
      result = result.filter(item => item.status === filter.status)
    }

    if (filter.search) {
      const searchLower = filter.search.toLowerCase()
      result = result.filter(item => 
        item.title.toLowerCase().includes(searchLower) || 
        item.description.toLowerCase().includes(searchLower)
      )
    }

    if (filter.sortBy === 'date-desc') {
      result.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    } else if (filter.sortBy === 'date-asc') {
      result.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
    } else if (filter.sortBy === 'priority') {
      const priorityOrder: Record<string, number> = { high: 0, medium: 1, low: 2 }
      result.sort((a, b) => {
        const aPri = priorityOrder[a.priority || 'low'] ?? 2
        const bPri = priorityOrder[b.priority || 'low'] ?? 2
        return aPri - bPri
      })
    }

    setFilteredItems(result)
  }, [items, filter])

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <AlertCircle className="h-12 w-12 text-destructive mb-4" />
        <h3 className="text-lg font-semibold text-destructive">Error loading inbox</h3>
        <p className="text-muted-foreground mt-2 max-w-sm">{error}</p>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="rounded-xl border border-border bg-card p-6">
            <div className="flex items-start justify-between">
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-6 w-12" />
            </div>
            <Skeleton className="mt-4 h-4 w-full" />
            <Skeleton className="mt-2 h-4 w-2/3" />
            <Skeleton className="mt-4 h-4 w-1/2" />
          </div>
        ))}
      </div>
    )
  }

  if (filteredItems.length === 0) {
    return (
      <EmptyState 
        title="No inbox items found" 
        description={filter ? "Try adjusting your filters" : "Your inbox is empty. New items will appear here."}
      />
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Showing {filteredItems.length} of {items.length} items
        </p>
      </div>
      <div className="space-y-4">
        {filteredItems.map((item) => (
          <InboxItemCard key={item.id} item={item} />
        ))}
      </div>
    </div>
  )
}
