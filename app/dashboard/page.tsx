'use client'

import { Layout } from '@/components/layout'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { Lock, Palette, Image, QrCode, BarChart3, Zap } from 'lucide-react'

const tools = [
  {
    icon: Lock,
    title: 'Password Generator',
    description: 'Create ultra-secure passwords with advanced customization and strength analysis.',
    href: '/',
    color: 'from-blue-500 to-cyan-500',
    stats: 'Real-time strength meter',
  },
  {
    icon: Palette,
    title: 'Color Palette',
    description: 'Generate beautiful color palettes with customizable options and export formats.',
    href: '/colors',
    color: 'from-purple-500 to-pink-500',
    stats: 'Multiple export formats',
  },
  {
    icon: Image,
    title: 'Image Editor',
    description: 'Advanced image editing with resize, crop, and filter capabilities.',
    href: '/image-editor',
    color: 'from-orange-500 to-red-500',
    stats: 'Professional tools',
  },
  {
    icon: QrCode,
    title: 'QR Code Generator',
    description: 'Generate customizable QR codes with error correction and color options.',
    href: '/qr-code',
    color: 'from-green-500 to-emerald-500',
    stats: 'Instant download',
  },
  {
    icon: BarChart3,
    title: 'Password Analyzer',
    description: 'Analyze password strength with detailed metrics and improvement suggestions.',
    href: '/',
    color: 'from-indigo-500 to-blue-500',
    stats: 'Built into password generator',
  },
  {
    icon: Zap,
    title: 'Image Compressor',
    description: 'Compress and resize images with multiple compression modes and formats.',
    href: '/image-editor',
    color: 'from-yellow-500 to-orange-500',
    stats: 'Multiple compression modes',
  },
]

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
}

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
}

export default function Dashboard() {
  return (
    <Layout>
      <div className="space-y-16">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center space-y-4"
        >
          <h1 className="text-5xl md:text-6xl font-bold gradient-text text-balance">
            Your Complete Digital Toolbox
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed text-balance">
            Powerful utilities for password generation, color design, image editing, and QR codes. All in one place with modern glassmorphic design.
          </p>
        </motion.div>

        {/* Tools Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {tools.map((tool, index) => {
            const Icon = tool.icon
            return (
              <motion.div key={index} variants={cardVariants}>
                <Link href={tool.href}>
                  <motion.div
                    whileHover={{ y: -8, scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="h-full glass-card p-6 cursor-pointer flex flex-col"
                  >
                    {/* Icon Background Gradient */}
                    <div className="relative mb-6">
                      <div
                        className={`absolute inset-0 w-14 h-14 rounded-xl bg-gradient-to-br ${tool.color} opacity-20 blur-lg`}
                      />
                      <div
                        className={`relative w-14 h-14 rounded-xl bg-gradient-to-br ${tool.color} flex items-center justify-center`}
                      >
                        <Icon className="w-7 h-7 text-white" />
                      </div>
                    </div>

                    {/* Content */}
                    <h3 className="text-xl font-bold text-foreground mb-2">{tool.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed mb-4 flex-1">
                      {tool.description}
                    </p>

                    {/* Stats Badge */}
                    <div className="inline-flex items-center gap-2 text-xs font-semibold text-primary mt-auto pt-4 border-t border-border/30">
                      <div className="w-2 h-2 rounded-full bg-primary" />
                      {tool.stats}
                    </div>
                  </motion.div>
                </Link>
              </motion.div>
            )
          })}
        </motion.div>

        {/* Features Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="card bg-gradient-to-br from-surface via-surface-alt to-surface"
        >
          <h2 className="text-2xl font-bold mb-6">Why Choose VisionCrypt?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                title: 'Privacy First',
                description: 'All processing happens in your browser. No data is stored or sent to servers.',
                icon: '🔒',
              },
              {
                title: 'Modern Design',
                description: 'Beautiful glassmorphic UI with smooth animations and responsive layout.',
                icon: '✨',
              },
              {
                title: 'Fast & Efficient',
                description: 'Instant results with zero lag. Optimized performance on all devices.',
                icon: '⚡',
              },
              {
                title: 'Easy Export',
                description: 'Download or copy results in various formats with one click.',
                icon: '📥',
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + index * 0.1 }}
                className="space-y-3"
              >
                <div className="text-3xl">{feature.icon}</div>
                <h3 className="font-bold text-foreground">{feature.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </Layout>
  )
}
