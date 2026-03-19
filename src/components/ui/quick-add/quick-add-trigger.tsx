import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { QuickAddForm } from './quick-add-form'
import type { QuickAddFormData } from '../../../types/quick-add'

interface QuickAddTriggerProps {
  onAdd: (data: QuickAddFormData) => void
}

export function QuickAddTrigger({ onAdd }: QuickAddTriggerProps) {
  const [isOpen, setIsOpen] = useState(false)

  const handleSubmit = (data: QuickAddFormData) => {
    onAdd(data)
    setIsOpen(false)
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add to Inbox
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add New Item</DialogTitle>
        </DialogHeader>
        <QuickAddForm onSubmit={handleSubmit} onCancel={() => setIsOpen(false)} />
      </DialogContent>
    </Dialog>
  )
}
