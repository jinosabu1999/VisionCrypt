"use client"

import { useToast } from "@/components/ui/use-toast"
import { Check, AlertCircle } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

export function Toaster() {
  const { toasts } = useToast()

  return (
    <div className="fixed bottom-0 right-0 z-[100] flex max-h-screen w-full flex-col-reverse p-4 sm:bottom-0 sm:right-0 sm:top-auto sm:w-[420px] pointer-events-none">
      <AnimatePresence mode="popLayout">
        {toasts.map(function ({ id, description, title, variant }) {
          return (
            <motion.div
              key={id}
              initial={{ opacity: 0, y: 20, x: 400 }}
              animate={{ opacity: 1, y: 0, x: 0 }}
              exit={{ opacity: 0, y: 20, x: 400 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="mb-3 pointer-events-auto"
            >
              <div className="rounded-xl border border-border/50 bg-gradient-to-r from-surface via-surface-alt to-surface backdrop-blur-xl p-4 shadow-lg shadow-black/30">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 pt-0.5">
                    {variant === "destructive" ? (
                      <AlertCircle className="h-5 w-5 text-red-500" />
                    ) : (
                      <Check className="h-5 w-5 text-accent" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    {title && <p className="font-semibold text-sm text-foreground">{title}</p>}
                    <p className={`text-sm ${title ? 'text-muted-foreground mt-1' : 'text-foreground'}`}>
                      {description}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          )
        })}
      </AnimatePresence>
    </div>
  )
}
