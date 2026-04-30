'use client'

import { useState, useCallback } from 'react'

export interface Toast {
  id: string
  title?: string
  description?: string
  variant?: 'default' | 'destructive'
}

let toastCount = 0

export function useToast() {
  const [toasts, setToasts] = useState<Toast[]>([])

  const toast = useCallback(({ title, description, variant = 'default' }: Omit<Toast, 'id'>) => {
    const id = `toast-${toastCount++}-${Date.now()}`
    const newToast: Toast = { id, title, description, variant }

    setToasts((prev) => [...prev, newToast])

    // Auto-remove toast after 3 seconds
    const timer = setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
    }, 3000)

    return {
      id,
      dismiss: () => {
        clearTimeout(timer)
        setToasts((prev) => prev.filter((t) => t.id !== id))
      },
    }
  }, [])

  return { toasts, toast }
}
