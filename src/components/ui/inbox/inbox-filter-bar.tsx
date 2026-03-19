import type { InboxItemStatus } from '../../../types/inbox'
import { Button } from '@/components/ui/button'

type SortByOption = 'date-desc' | 'date-asc' | 'priority'

export function InboxFilterBar({ 
  statusFilter, 
  onStatusChange,
  searchValue,
  onSearchChange,
  sortBy,
  onSortChange
}: { 
  statusFilter?: InboxItemStatus 
  onStatusChange?: (status: InboxItemStatus | undefined) => void
  searchValue?: string
  onSearchChange?: (value: string) => void
  sortBy?: SortByOption
  onSortChange?: (value: SortByOption) => void
}) {
  const statusOptions: { value: InboxItemStatus | 'all'; label: string; icon?: React.ReactNode }[] = [
    { value: 'all', label: 'All Items' },
    { value: 'new', label: 'New' },
    { value: 'processed', label: 'Processed' },
    { value: 'archived', label: 'Archived' },
    { value: 'needs-attention', label: 'Needs Attention' },
  ]

  const sortOptions = [
    { value: 'date-desc', label: 'Newest First' },
    { value: 'date-asc', label: 'Oldest First' },
    { value: 'priority', label: 'Priority' },
  ]

  return (
    <div className="flex flex-col md:flex-row gap-4 mb-6">
      {/* Status Filters */}
      <div className="flex flex-wrap gap-2">
        {statusOptions.map((option) => (
          <Button
            key={option.value}
            variant={statusFilter === option.value ? 'default' : 'outline'}
            size="sm"
            onClick={() => onStatusChange && onStatusChange(option.value === 'all' ? undefined : option.value)}
          >
            {option.icon || option.label}
          </Button>
        ))}
      </div>

      {/* Search */}
      <div className="flex-1">
        <input
          type="text"
          placeholder="Search inbox..."
          value={searchValue || ''}
          onChange={(e) => onSearchChange && onSearchChange(e.target.value)}
          className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
        />
      </div>

      {/* Sort */}
      <div className="flex gap-2">
        <select
          value={sortBy || 'date-desc'}
          onChange={(e) => onSortChange && onSortChange(e.target.value as SortByOption)}
          className="rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
        >
          {sortOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  )
}
