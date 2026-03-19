// Quick Add Form Types
export interface QuickAddFormData {
  title: string
  description: string
  category?: string
}

export interface QuickAddFormProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (data: QuickAddFormData) => void
}
