'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { RefreshCw, Copy, Check, Lock, Unlock, Download } from 'lucide-react'
import { useToast } from "@/components/ui/use-toast"
import { motion, AnimatePresence } from "framer-motion"

interface ColorItem {
  hex: string
  locked: boolean
}

function hexToHSL(hex: string): { h: number; s: number; l: number } {
  let r = parseInt(hex.slice(1, 3), 16) / 255
  let g = parseInt(hex.slice(3, 5), 16) / 255
  let b = parseInt(hex.slice(5, 7), 16) / 255

  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  let h = 0, s = 0
  const l = (max + min) / 2

  if (max !== min) {
    const d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break
      case g: h = ((b - r) / d + 2) / 6; break
      case b: h = ((r - g) / d + 4) / 6; break
    }
  }

  return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) }
}

function generateRandomColor(): string {
  return `#${Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')}`
}

export function Colors() {
  const [palette, setPalette] = useState<ColorItem[]>(
    Array.from({ length: 6 }, () => ({
      hex: generateRandomColor(),
      locked: false,
    }))
  )
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null)
  const [copyFormat, setCopyFormat] = useState<'hex' | 'hsl' | 'rgb'>('hex')
  const { toast } = useToast()

  const generateNewPalette = () => {
    setPalette(palette.map((item) => ({
      ...item,
      hex: item.locked ? item.hex : generateRandomColor(),
    })))
  }

  const toggleLock = (index: number) => {
    setPalette(palette.map((item, i) => 
      i === index ? { ...item, locked: !item.locked } : item
    ))
  }

  const getColorInFormat = (hex: string): string => {
    if (copyFormat === 'hex') return hex
    if (copyFormat === 'hsl') {
      const { h, s, l } = hexToHSL(hex)
      return `hsl(${h}, ${s}%, ${l}%)`
    }
    // RGB
    const r = parseInt(hex.slice(1, 3), 16)
    const g = parseInt(hex.slice(3, 5), 16)
    const b = parseInt(hex.slice(5, 7), 16)
    return `rgb(${r}, ${g}, ${b})`
  }

  const copyToClipboard = async (color: string, index: number) => {
    const text = getColorInFormat(color)
    await navigator.clipboard.writeText(text)
    setCopiedIndex(index)
    toast({ 
      title: "Copied",
      description: `${copyFormat.toUpperCase()} copied to clipboard` 
    })
    setTimeout(() => setCopiedIndex(null), 2000)
  }

  const downloadPalette = () => {
    const colors = palette.map(c => getColorInFormat(c.hex)).join('\n')
    const element = document.createElement('a')
    element.setAttribute('href', `data:text/plain;charset=utf-8,${encodeURIComponent(colors)}`)
    element.setAttribute('download', `palette-${Date.now()}.txt`)
    element.style.display = 'none'
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
    toast({ 
      title: "Success",
      description: 'Palette downloaded' 
    })
  }

  return (
    <div className="space-y-8">
      {/* Format Selector */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Export Format</h3>
          <div className="flex gap-2">
            {(['hex', 'hsl', 'rgb'] as const).map((format) => (
              <Button
                key={format}
                variant={copyFormat === format ? 'default' : 'outline'}
                size="sm"
                onClick={() => setCopyFormat(format)}
                className="btn-smooth"
              >
                {format.toUpperCase()}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Color Grid */}
      <div className="card">
        <h2 className="text-lg font-bold mb-6 gradient-text">Color Palette Generator</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {palette.map((color, index) => (
            <motion.div 
              key={index} 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="flex flex-col gap-3 group"
            >
              <div className="relative overflow-hidden rounded-2xl shadow-lg">
                <button
                  onClick={() => copyToClipboard(color.hex, index)}
                  className="w-full aspect-square flex items-center justify-center text-white text-3xl font-bold transition-all duration-300 hover:scale-110 active:scale-95"
                  style={{ backgroundColor: color.hex }}
                  title={`Click to copy ${getColorInFormat(color.hex)}`}
                >
                  <motion.div
                    initial={{ opacity: 0 }}
                    whileHover={{ opacity: 1 }}
                    className="absolute inset-0 bg-black/20 flex items-center justify-center"
                  >
                    <Copy className="w-6 h-6 text-white" />
                  </motion.div>
                </button>

                <motion.button
                  initial={{ scale: 0 }}
                  whileHover={{ scale: 1 }}
                  onClick={() => toggleLock(index)}
                  className="absolute top-2 right-2 p-2 rounded-full bg-black/50 hover:bg-black/70 transition-colors"
                >
                  {color.locked ? (
                    <Lock className="w-4 h-4 text-white" />
                  ) : (
                    <Unlock className="w-4 h-4 text-white/50" />
                  )}
                </motion.button>
              </div>

              <div className="space-y-2">
                <p className="font-mono text-sm font-bold text-foreground">{getColorInFormat(color.hex)}</p>
                
                <div className="flex gap-2">
                  <button
                    onClick={() => copyToClipboard(color.hex, index)}
                    className="flex-1 px-3 py-2 rounded-lg bg-surface-alt hover:bg-primary/20 transition-all duration-300 flex items-center justify-center gap-2 text-sm font-medium"
                  >
                    <AnimatePresence initial={false} mode="wait">
                      {copiedIndex === index ? (
                        <motion.div
                          key="check"
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          exit={{ scale: 0 }}
                        >
                          <Check className="w-4 h-4 text-accent" />
                        </motion.div>
                      ) : (
                        <motion.div
                          key="copy"
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          exit={{ scale: 0 }}
                        >
                          <Copy className="w-4 h-4" />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Harmony Bar */}
      <div className="card">
        <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-4">Palette Preview</h3>
        <div className="h-16 rounded-2xl overflow-hidden flex shadow-xl border border-border/50">
          {palette.map((color, index) => (
            <motion.div
              key={index}
              className="flex-1 transition-all duration-300 hover:flex-[1.3] cursor-pointer"
              style={{ backgroundColor: color.hex }}
              whileHover={{ scale: 1.02 }}
            />
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3">
        <Button
          onClick={generateNewPalette}
          className="flex-1 btn-smooth bg-gradient-to-r from-primary to-secondary text-white font-bold py-6"
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          Generate New
        </Button>
        <Button
          onClick={downloadPalette}
          variant="outline"
          className="flex-1 btn-smooth py-6"
        >
          <Download className="w-4 h-4 mr-2" />
          Export
        </Button>
      </div>
    </div>
  )
}

                    
