'use client'

import { Layout } from '@/components/layout'
import { ImageEditor } from '@/components/image-editor'
import { motion } from 'framer-motion'

export default function ImageEditorPage() {
  return (
    <Layout>
      <div className="space-y-12">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-3"
        >
          <h1 className="text-4xl md:text-5xl font-800 gradient-text">Image Editor</h1>
          <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl">
            Resize images with precision. Set target dimensions, optimize file size, lock aspect ratios, and export in multiple formats instantly.
          </p>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <ImageEditor />
        </motion.div>
      </div>
    </Layout>
  )
}
