'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight, Home } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-surface to-background flex items-center justify-center px-4">
      <div className="text-center space-y-8 max-w-lg">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="relative inline-block mb-8">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/40 to-secondary/40 rounded-3xl blur-2xl animate-pulse" />
            <div className="relative text-6xl md:text-8xl font-bold gradient-text">
              404
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-3"
        >
          <h1 className="text-3xl md:text-4xl font-bold text-foreground">Page Not Found</h1>
          <p className="text-lg text-muted-foreground">
            Oops! The page you&apos;re looking for doesn&apos;t exist. But don&apos;t worry, we have plenty of tools to explore.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex flex-col sm:flex-row gap-4 justify-center pt-4"
        >
          <Link href="/dashboard">
            <Button className="btn-smooth bg-gradient-to-r from-primary to-secondary text-white font-bold py-6 px-8 w-full sm:w-auto">
              <Home className="h-5 w-5 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
          <Link href="/">
            <Button
              variant="outline"
              className="btn-smooth border-border/50 hover:bg-surface-alt w-full sm:w-auto py-6"
            >
              Password Generator
              <ArrowRight className="h-5 w-5 ml-2" />
            </Button>
          </Link>
        </motion.div>

        {/* Quick Links */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="pt-8 border-t border-border/50 space-y-4"
        >
          <p className="text-sm text-muted-foreground font-semibold">Other Tools</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
            {[
              { href: '/', label: 'Password' },
              { href: '/colors', label: 'Colors' },
              { href: '/qr-code', label: 'QR Code' },
              { href: '/image-editor', label: 'Image' },
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-3 py-2 rounded-lg bg-surface-alt/50 border border-border/30 hover:border-primary/50 hover:bg-primary/10 transition-all duration-300 text-foreground font-medium"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  )
}
