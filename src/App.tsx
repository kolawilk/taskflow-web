import { ThemeToggle } from './components/ui/theme-toggle'
import { Button } from './components/ui/button'
import { useTheme } from 'next-themes'

export default function App() {
  const { theme } = useTheme()

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
      <header className="border-b border-border">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <h1 className="text-xl font-bold">Taskflow Web</h1>
          <ThemeToggle />
        </div>
      </header>
      
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-4xl font-extrabold tracking-tight mb-4">
            Welcome to Taskflow
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            Manage projects, features, and tasks with a beautiful interface.
            Current theme: <span className="font-semibold">{theme}</span>
          </p>
          <div className="flex justify-center gap-4">
            <Button size="lg">Get Started</Button>
            <Button variant="outline" size="lg">Documentation</Button>
          </div>
        </div>
      </main>
    </div>
  )
}
