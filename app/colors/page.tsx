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
          className="space-y-4"
        >
          <h1 className="text-5xl md:text-6xl font-bold gradient-text text-balance">Color Palette Generator</h1>
          <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl">
            Generate stunning color palettes instantly. Perfect for design inspiration, branding, and creative projects with multiple export formats.
          </p>
          <div className="flex flex-wrap gap-2 pt-2">
            <div className="text-xs font-semibold text-primary bg-primary/10 px-3 py-1 rounded-full border border-primary/30">
              ✓ AI-Powered Generation
            </div>
            <div className="text-xs font-semibold text-secondary bg-secondary/10 px-3 py-1 rounded-full border border-secondary/30">
              ✓ Multiple Export Formats
            </div>
            <div className="text-xs font-semibold text-accent bg-accent/10 px-3 py-1 rounded-full border border-accent/30">
              ✓ Instant Preview
            </div>
          </div>
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


