import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import type { QuickAddFormData } from '../../../types/quick-add'

interface QuickAddFormProps {
  onSubmit: (data: QuickAddFormData) => void
  onCancel: () => void
}

export function QuickAddForm({ onSubmit, onCancel }: QuickAddFormProps) {
  const [formData, setFormData] = useState<QuickAddFormData>({
    title: '',
    description: '',
    category: '',
  })
  const [errors, setErrors] = useState<Partial<QuickAddFormData>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const validate = (): boolean => {
    const newErrors: Partial<QuickAddFormData> = {}

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validate()) {
      return
    }

    setIsSubmitting(true)

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 500))

    onSubmit(formData)
    setIsSubmitting(false)
  }

  const handleChange = (field: keyof QuickAddFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }))
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      e.preventDefault()
      handleSubmit(e as unknown as React.FormEvent)
    }
  }

  return (
    <form onSubmit={handleSubmit} onKeyDown={handleKeyDown} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="title" className="font-medium">Title *</Label>
        <Input
          id="title"
          value={formData.title}
          onChange={(e) => handleChange('title', e.target.value)}
          placeholder="Enter a brief title"
          className={errors.title ? 'border-red-500 focus-visible:ring-red-500' : ''}
          aria-invalid={!!errors.title}
        />
        {errors.title && (
          <p className="text-xs text-red-500">{errors.title}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="description" className="font-medium">Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => handleChange('description', e.target.value)}
          placeholder="Enter a detailed description (optional)"
          rows={4}
          className="min-h-[80px]"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="category" className="font-medium">Category</Label>
        <Input
          id="category"
          value={formData.category}
          onChange={(e) => handleChange('category', e.target.value)}
          placeholder="bug, feature, idea, etc."
        />
      </div>

      <div className="flex justify-end gap-2 pt-4 border-t border-border mt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? (
            <span className="flex items-center gap-2">
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
              Adding...
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <span>+</span> Add Item
            </span>
          )}
        </Button>
      </div>
    </form>
  )
}
