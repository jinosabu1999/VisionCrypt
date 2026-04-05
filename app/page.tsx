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
          className="space-y-3"
        >
          <h1 className="text-4xl md:text-5xl font-800 gradient-text">Password Generator</h1>
          <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl">
            Create ultra-secure passwords with advanced customization. Instantly generate strong, random passwords tailored to your needs.
          </p>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="max-w-3xl"
        >
          <PasswordGenerator />
        </motion.div>
      </div>
    </Layout>
  )
}


