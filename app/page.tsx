'use client'

import { Layout } from "@/components/layout"
import { PasswordGenerator } from "@/components/password-generator"
import { motion } from "framer-motion"

export default function Home() {
  return (
    <Layout>
      <div className="space-y-12">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-4"
        >
          <h1 className="text-5xl md:text-6xl font-bold gradient-text text-balance">
            Password Generator
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl">
            Create ultra-secure passwords with advanced customization. Get real-time strength analysis and instantly generate strong, random passwords tailored to your needs.
          </p>
          <div className="flex flex-wrap gap-2 pt-2">
            <div className="text-xs font-semibold text-primary bg-primary/10 px-3 py-1 rounded-full border border-primary/30">
              ✓ Real-time Analysis
            </div>
            <div className="text-xs font-semibold text-secondary bg-secondary/10 px-3 py-1 rounded-full border border-secondary/30">
              ✓ Customizable Options
            </div>
            <div className="text-xs font-semibold text-accent bg-accent/10 px-3 py-1 rounded-full border border-accent/30">
              ✓ Copy & Download
            </div>
          </div>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="max-w-4xl"
        >
          <PasswordGenerator />
        </motion.div>
      </div>
    </Layout>
  )
}


