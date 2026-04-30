'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Check, X, AlertCircle } from 'lucide-react'

interface StrengthMetrics {
  length: boolean
  uppercase: boolean
  lowercase: boolean
  numbers: boolean
  special: boolean
}

interface StrengthScore {
  score: number
  label: string
  color: string
  description: string
}

export function PasswordStrengthAnalyzer({ password = '' }) {
  const [metrics, setMetrics] = useState<StrengthMetrics>({
    length: false,
    uppercase: false,
    lowercase: false,
    numbers: false,
    special: false,
  })

  const calculateStrength = (pwd: string): StrengthScore => {
    const newMetrics: StrengthMetrics = {
      length: pwd.length >= 12,
      uppercase: /[A-Z]/.test(pwd),
      lowercase: /[a-z]/.test(pwd),
      numbers: /[0-9]/.test(pwd),
      special: /[!@#$%^&*()_+\-=[\]{}|;:,.<>?]/.test(pwd),
    }
    setMetrics(newMetrics)

    const metricCount = Object.values(newMetrics).filter(Boolean).length
    const lengthScore = Math.min(pwd.length / 20, 1) * 20

    let score = 0
    if (pwd.length === 0) {
      return {
        score: 0,
        label: 'No Password',
        color: 'bg-gray-400',
        description: 'Enter a password to analyze',
      }
    }
    if (pwd.length < 6) {
      score = 10
    } else if (pwd.length < 8) {
      score = 20
    } else if (pwd.length < 12) {
      score = 40 + metricCount * 10
    } else {
      score = 60 + metricCount * 8 + lengthScore
    }

    if (score < 30) {
      return {
        score: Math.min(score, 29),
        label: 'Very Weak',
        color: 'bg-red-500',
        description: 'Extremely vulnerable to attacks',
      }
    } else if (score < 50) {
      return {
        score,
        label: 'Weak',
        color: 'bg-orange-500',
        description: 'Easy to crack with common tools',
      }
    } else if (score < 70) {
      return {
        score,
        label: 'Fair',
        color: 'bg-yellow-500',
        description: 'Moderately resistant to attacks',
      }
    } else if (score < 85) {
      return {
        score,
        label: 'Strong',
        color: 'bg-blue-500',
        description: 'Highly resistant to brute force attacks',
      }
    } else {
      return {
        score: Math.min(score, 100),
        label: 'Very Strong',
        color: 'bg-green-500',
        description: 'Extremely difficult to crack',
      }
    }
  }

  const strength = calculateStrength(password)

  const suggestions: string[] = []
  if (!metrics.length && password.length > 0)
    suggestions.push('Use at least 12 characters for better security')
  if (!metrics.uppercase) suggestions.push('Add uppercase letters (A-Z)')
  if (!metrics.lowercase) suggestions.push('Add lowercase letters (a-z)')
  if (!metrics.numbers) suggestions.push('Include numbers (0-9)')
  if (!metrics.special) suggestions.push('Add special characters (!@#$%^&*)')

  return (
    <div className="space-y-4">
      {/* Strength Bar */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-2"
      >
        <div className="flex items-center justify-between">
          <span className="text-xs uppercase tracking-widest text-muted-foreground font-bold">
            Password Strength
          </span>
          <span className={`text-sm font-bold ${strength.color.replace('bg-', 'text-')}`}>
            {strength.label}
          </span>
        </div>
        <div className="w-full h-2 bg-surface-alt rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${Math.min(strength.score, 100)}%` }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className={`h-full rounded-full transition-all ${strength.color}`}
          />
        </div>
        <p className="text-xs text-muted-foreground">{strength.description}</p>
      </motion.div>

      {/* Metrics Checklist */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 sm:grid-cols-2 gap-2"
      >
        {[
          {
            label: 'At least 12 characters',
            met: metrics.length,
          },
          {
            label: 'Uppercase letters (A-Z)',
            met: metrics.uppercase,
          },
          {
            label: 'Lowercase letters (a-z)',
            met: metrics.lowercase,
          },
          {
            label: 'Numbers (0-9)',
            met: metrics.numbers,
          },
          {
            label: 'Special characters',
            met: metrics.special,
          },
        ].map((metric, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 + index * 0.05 }}
            className="flex items-center gap-2 text-xs"
          >
            {metric.met ? (
              <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
            ) : (
              <X className="w-4 h-4 text-red-500/50 flex-shrink-0" />
            )}
            <span
              className={
                metric.met ? 'text-foreground font-medium' : 'text-muted-foreground'
              }
            >
              {metric.label}
            </span>
          </motion.div>
        ))}
      </motion.div>

      {/* Improvement Suggestions */}
      {suggestions.length > 0 && password.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="rounded-lg bg-blue-500/10 border border-blue-500/30 p-3"
        >
          <div className="flex gap-2">
            <AlertCircle className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-xs font-semibold text-blue-300 mb-1">Suggestions:</p>
              <ul className="text-xs text-blue-200/80 space-y-0.5">
                {suggestions.slice(0, 3).map((suggestion, index) => (
                  <li key={index} className="flex gap-2">
                    <span className="flex-shrink-0">•</span>
                    <span>{suggestion}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  )
}
