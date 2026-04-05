'use client'

import { Layout } from "@/components/layout"
import { Colors } from "@/components/colors"
import { motion } from "framer-motion"

export default function ColorsPage() {
  return (
    <Layout>
      <div className="space-y-12">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-3"
        >
          <h1 className="text-4xl md:text-5xl font-800 gradient-text">Color Palette Generator</h1>
          <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl">
            Generate stunning color palettes instantly. Perfect for design inspiration, branding, and creative projects with multiple export formats.
          </p>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Colors />
        </motion.div>
      </div>
    </Layout>
  )
}


