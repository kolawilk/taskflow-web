// Inbox Types
export type InboxItemStatus = 'new' | 'processed' | 'archived' | 'needs-attention'

export type SortByOption = 'date-desc' | 'date-asc' | 'priority'

export interface InboxItem {
  id: string
  title: string
  description: string
  status: InboxItemStatus
  timestamp: string
  priority?: 'low' | 'medium' | 'high'
  category?: string
}

// Filter options
export interface InboxFilter {
  status?: InboxItemStatus
  search?: string
  sortBy?: SortByOption
}
