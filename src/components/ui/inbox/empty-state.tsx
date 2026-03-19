import { Building2 } from 'lucide-react'

export function EmptyState({ 
  title, 
  description 
}: { 
  title: string 
  description: string 
}) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <Building2 className="h-16 w-16 text-muted-foreground mb-4" />
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="text-muted-foreground mt-2 max-w-sm">
        {description}
      </p>
    </div>
  )
}
