import { useState } from 'react'
import { InboxList } from './inbox-list'
import { InboxFilterBar } from './inbox-filter-bar'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import type { InboxFilter, SortByOption } from '../../../types/inbox'

export function InboxPage() {
  const [filter, setFilter] = useState<InboxFilter>({
    status: undefined,
    search: '',
    sortBy: 'date-desc',
  })

  const handleSortChange = (sortBy: SortByOption) => {
    setFilter((prev) => ({ ...prev, sortBy }))
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <header className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold">Inbox</h2>
          <p className="text-muted-foreground mt-1">
            Capture ideas, bugs, and feature requests
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Item
        </Button>
      </header>

      <InboxFilterBar
        statusFilter={filter.status}
        onStatusChange={(status) => setFilter({ ...filter, status })}
        searchValue={filter.search}
        onSearchChange={(search) => setFilter({ ...filter, search })}
        sortBy={filter.sortBy}
        onSortChange={handleSortChange}
      />

      <InboxList filter={filter} />
    </div>
  )
}
