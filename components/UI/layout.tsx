'use client'

import { useTheme } from "next-themes"
import { Sun, Moon } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import Image from "next/image"

interface LayoutProps {
  children: React.ReactNode
}

const tools = [
  { name: 'Password', href: '/' },
  { name: 'Colors', href: '/colors' },
  { name: 'Image Editor', href: '/image-editor' },
]

export function Layout({ children }: LayoutProps) {
  const { theme, setTheme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [isDark, setIsDark] = useState(true)
  const pathname = usePathname()

  useEffect(() => {
    setMounted(true)
    // Set initial state based on resolved theme
    setIsDark(resolvedTheme === 'dark' || (!resolvedTheme && true))
  }, [resolvedTheme])

  const toggleTheme = () => {
    if (resolvedTheme === 'dark') {
      setTheme('light')
      setIsDark(false)
    } else {
      setTheme('dark')
      setIsDark(true)
    }
  }

  if (!mounted) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-surface to-background">
      <header className="sticky top-0 z-50 border-b border-border/50 bg-background/75 backdrop-blur-2xl animate-fadeIn">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity duration-300 group">
              <Image 
                src="/visioncrypt-logo.png" 
                alt="VisionCrypt Logo" 
                width={40} 
                height={40}
                className="group-hover:scale-110 transition-transform duration-300"
              />
              <div className="hidden sm:block">
                <div className="text-lg font-800">
                  <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">Vision</span>
                  <span className="text-white">Crypt</span>
                </div>
                <div className="text-xs text-cyan-400/80">Smart Editing. Locked Security</div>
              </div>
            </Link>

            <nav className="hidden md:flex gap-1">
              {tools.map((tool) => {
                const isActive = pathname === tool.href
                return (
                  <Link
                    key={tool.href}
                    href={tool.href}
                    className={`px-4 py-2 rounded-lg text-sm font-600 transition-all duration-300 ${
                      isActive
                        ? 'bg-gradient-to-r from-primary to-secondary text-white shadow-lg shadow-primary/20'
                        : 'text-foreground hover:bg-surface-alt'
                    }`}
                  >
                    {tool.name}
                  </Link>
                )
              })}
            </nav>

            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="rounded-full w-10 h-10 flex items-center justify-center hover:bg-surface-alt transition-all duration-300"
              aria-label="Toggle theme"
            >
              <Sun className="h-5 w-5 absolute transition-all duration-300" style={{
                opacity: isDark ? 0 : 1,
                transform: isDark ? 'rotate(90deg) scale(0)' : 'rotate(0deg) scale(1)',
              }} />
              <Moon className="h-5 w-5 absolute transition-all duration-300" style={{
                opacity: isDark ? 1 : 0,
                transform: isDark ? 'rotate(0deg) scale(1)' : 'rotate(90deg) scale(0)',
              }} />
            </Button>
          </div>

          <nav className="md:hidden flex gap-2 py-2 overflow-x-auto pb-2 scrollbar-hide">
            {tools.map((tool) => {
              const isActive = pathname === tool.href
              return (
                <Link
                  key={tool.href}
                  href={tool.href}
                  className={`px-4 py-2 rounded-lg text-sm font-600 whitespace-nowrap transition-all duration-300 ${
                    isActive
                      ? 'bg-gradient-to-r from-primary to-secondary text-white shadow-lg shadow-primary/20'
                      : 'text-foreground hover:bg-surface-alt'
                  }`}
                >
                  {tool.name}
                </Link>
              )
            })}
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-8 md:py-12 animate-slideUp">
        {children}
      </main>
    </div>
  )
}


