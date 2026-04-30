'use client'

import { Layout } from '@/components/layout'
import { ImageEditor } from '@/components/image-editor'
import { ImageCompressor } from '@/components/image-compressor'
import { motion } from 'framer-motion'
import { useState } from 'react'

export default function ImageEditorPage() {
  const [activeTab, setActiveTab] = useState<'editor' | 'compressor'>('editor')

  return (
    <Layout>
      <div className="space-y-12">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-3"
        >
          <h1 className="text-4xl md:text-5xl font-bold gradient-text">Image Editor</h1>
          <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl">
            Professional image editing and compression tools. Resize with precision, compress efficiently, and export in multiple formats.
          </p>
        </motion.div>

        {/* Tab Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.05 }}
          className="flex gap-2 border-b border-border/50"
        >
          {[
            { id: 'editor', label: 'Resize & Edit' },
            { id: 'compressor', label: 'Compress & Optimize' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as 'editor' | 'compressor')}
              className={`px-6 py-3 text-sm font-semibold rounded-t-lg transition-all duration-300 ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-primary to-secondary text-white border-b-2 border-primary'
                  : 'text-muted-foreground hover:text-foreground hover:bg-surface-alt/50'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          {activeTab === 'editor' ? <ImageEditor /> : <ImageCompressor />}
        </motion.div>
      </div>
    </Layout>
  )
}
