import { Moon, Sun, Monitor } from 'lucide-react'
import { useTheme } from 'next-themes'
import { Button } from '@/components/ui/button'

export function ThemeToggle() {
  const { theme, setTheme, systemTheme } = useTheme()
  
  const themeLabel = theme === 'system' ? (systemTheme ?? 'light') : theme

  return (
    <div className="flex items-center gap-1">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setTheme('light')}
        title="Light mode"
        className={themeLabel === 'light' ? 'bg-slate-200 dark:bg-slate-800' : ''}
      >
        <Sun className="h-5 w-5" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setTheme('dark')}
        title="Dark mode"
        className={themeLabel === 'dark' ? 'bg-slate-200 dark:bg-slate-800' : ''}
      >
        <Moon className="h-5 w-5" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setTheme('system')}
        title="System mode"
        className={themeLabel === 'system' ? 'bg-slate-200 dark:bg-slate-800' : ''}
      >
        <Monitor className="h-5 w-5" />
      </Button>
    </div>
  )
}
