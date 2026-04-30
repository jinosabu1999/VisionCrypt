'use client'

import { Layout } from '@/components/layout'
import { QRCodeGenerator } from '@/components/qr-code-generator'
import { motion } from 'framer-motion'

export default function QRCodePage() {
  return (
    <Layout>
      <div className="space-y-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-3"
        >
          <h1 className="text-4xl md:text-5xl font-bold gradient-text">QR Code Generator</h1>
          <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl">
            Generate customizable QR codes with adjustable size, error correction levels, and color options. Perfect for marketing, tracking, and sharing links.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="max-w-4xl"
        >
          <QRCodeGenerator />
        </motion.div>
      </div>
    </Layout>
  )
}
