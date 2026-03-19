import { useState } from 'react'
import { InboxList } from './inbox-list'
import { InboxFilterBar } from './inbox-filter-bar'
import { QuickAddTrigger } from '../quick-add/quick-add-trigger'
import type { InboxFilter, SortByOption } from '../../../types/inbox'
import type { QuickAddFormData } from '../../../types/quick-add'

export function InboxPage() {
  const [filter, setFilter] = useState<InboxFilter>({
    status: undefined,
    search: '',
    sortBy: 'date-desc',
  })

  const handleSortChange = (sortBy: SortByOption) => {
    setFilter((prev) => ({ ...prev, sortBy }))
  }

  const handleQuickAdd = (data: QuickAddFormData) => {
    // In a real app, this would call the taskflow API
    console.log('Adding to inbox:', data)
    // Add the new item to the list
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
        <QuickAddTrigger onAdd={handleQuickAdd} />
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
