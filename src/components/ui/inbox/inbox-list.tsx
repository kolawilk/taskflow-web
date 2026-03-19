import { useState, useEffect } from 'react'
import type { InboxItem, InboxFilter } from '../../../types/inbox'
import { InboxItemCard } from './inbox-item-card'
import { EmptyState } from './empty-state'
import { Skeleton } from '@/components/ui/skeleton'

// Mock data
const MOCK_INBOX_ITEMS: InboxItem[] = [
  {
    id: 'inbox-1',
    title: 'Add dark mode toggle',
    description: 'Implement system preference detection with next-themes and user preference persistence in localStorage',
    status: 'new',
    timestamp: '2026-03-18T23:30:00Z',
    priority: 'high',
    category: 'feature',
  },
  {
    id: 'inbox-2',
    title: 'Fix theme flash on page load',
    description: 'Add inline script to apply correct theme class before React renders',
    status: 'processed',
    timestamp: '2026-03-18T23:25:00Z',
    priority: 'medium',
    category: 'bug',
  },
  {
    id: 'inbox-3',
    title: 'Sidebar navigation component',
    description: 'Create responsive sidebar with collapsible menu and mobile support',
    status: 'new',
    timestamp: '2026-03-18T22:10:00Z',
    priority: 'medium',
    category: 'feature',
  },
  {
    id: 'inbox-4',
    title: 'Project status indicators',
    description: 'Add visual indicators for project states in the projects list',
    status: 'archived',
    timestamp: '2026-03-18T21:00:00Z',
    priority: 'low',
    category: 'enhancement',
  },
  {
    id: 'inbox-5',
    title: 'Mobile responsive layout',
    description: 'Ensure dashboard works well on iPad and smaller screens',
    status: 'needs-attention',
    timestamp: '2026-03-18T20:00:00Z',
    priority: 'high',
    category: 'bug',
  },
]

export function InboxList({ 
  items = MOCK_INBOX_ITEMS, 
  filter 
}: { 
  items?: InboxItem[] 
  filter?: InboxFilter 
}) {
  const [loading, setLoading] = useState(true)
  const [filteredItems, setFilteredItems] = useState<InboxItem[]>(items)

  useEffect(() => {
    // Simulate API call delay
    const timer = setTimeout(() => setLoading(false), 500)
    return () => clearTimeout(timer)
  }, [])

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

  if (loading) {
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
