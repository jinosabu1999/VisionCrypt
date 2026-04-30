'use client'

import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/UI/button'
import { Input } from '@/components/UI/input'
import { Label } from '@/components/UI/label'
import { Slider } from '@/components/UI/slider'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/UI/select'
import { Copy, Download, RefreshCw } from 'lucide-react'
import { useToast } from '@/components/UI/use-toast'
import { motion } from 'framer-motion'
import QRCode from 'qrcode'

interface QROptions {
  text: string
  size: number
  errorCorrection: 'L' | 'M' | 'Q' | 'H'
  darkColor: string
  lightColor: string
}

export function QRCodeGenerator() {
  const [options, setOptions] = useState<QROptions>({
    text: 'https://visioncrypt.app',
    size: 300,
    errorCorrection: 'H',
    darkColor: '#00D4FF',
    lightColor: '#0f172a',
  })
  const [qrCode, setQrCode] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const { toast } = useToast()

  const generateQR = async () => {
    if (!options.text.trim()) {
      toast({
        title: 'Error',
        description: 'Please enter text or URL to generate QR code',
        variant: 'destructive',
      })
      return
    }

    try {
      const dataUrl = await QRCode.toDataURL(options.text, {
        width: options.size,
        margin: 2,
        errorCorrectionLevel: options.errorCorrection,
        color: {
          dark: options.darkColor,
          light: options.lightColor,
        },
      })
      setQrCode(dataUrl)
      toast({
        title: 'Success',
        description: 'QR code generated successfully',
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to generate QR code',
        variant: 'destructive',
      })
    }
  }

  useEffect(() => {
    generateQR()
  }, [])

  const downloadQR = () => {
    if (!qrCode) return

    const link = document.createElement('a')
    link.href = qrCode
    link.download = `qrcode-${Date.now()}.png`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    toast({
      title: 'Success',
      description: 'QR code downloaded successfully',
    })
  }

  const copySVG = async () => {
    if (!qrCode) return

    try {
      await navigator.clipboard.writeText(qrCode)
      setCopied(true)
      toast({
        title: 'Success',
        description: 'QR code copied to clipboard',
      })
      setTimeout(() => setCopied(false), 2000)
    } catch {
      toast({
        title: 'Error',
        description: 'Failed to copy to clipboard',
        variant: 'destructive',
      })
    }
  }

  return (
    <div className="space-y-8">
      {/* Input Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card"
      >
        <Label className="text-xs uppercase tracking-widest text-muted-foreground font-bold block mb-3">
          Text or URL
        </Label>
        <Input
          value={options.text}
          onChange={(e) => setOptions({ ...options, text: e.target.value })}
          placeholder="Enter text or URL for QR code"
          className="bg-surface-alt text-foreground border-border/50"
        />
      </motion.div>

      {/* QR Code Preview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="card flex flex-col items-center justify-center py-12 min-h-96"
      >
        {qrCode ? (
          <motion.div
            key={qrCode}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="relative"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-xl blur-xl" />
            <img
              src={qrCode}
              alt="Generated QR Code"
              ref={canvasRef}
              className="relative w-64 h-64 rounded-lg border-2 border-primary/50"
            />
          </motion.div>
        ) : (
          <div className="text-center text-muted-foreground">
            <p>Generate a QR code to see preview</p>
          </div>
        )}
      </motion.div>

      {/* Size Control */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="card"
      >
        <div className="flex items-center justify-between mb-4">
          <Label className="text-sm font-bold">QR Code Size</Label>
          <span className="text-2xl font-bold gradient-text">{options.size}px</span>
        </div>
        <Slider
          value={[options.size]}
          onValueChange={([value]) => setOptions({ ...options, size: value })}
          min={150}
          max={600}
          step={10}
          className="w-full"
        />
        <div className="flex justify-between text-xs text-muted-foreground mt-3">
          <span>150px</span>
          <span>600px</span>
        </div>
      </motion.div>

      {/* Error Correction Level */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="card"
      >
        <Label className="text-sm font-bold block mb-4">Error Correction Level</Label>
        <Select
          value={options.errorCorrection}
          onValueChange={(value) =>
            setOptions({ ...options, errorCorrection: value as QROptions['errorCorrection'] })
          }
        >
          <SelectTrigger className="bg-surface-alt border-border/50">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-surface border-border">
            <SelectItem value="L">Low (7% recovery)</SelectItem>
            <SelectItem value="M">Medium (15% recovery)</SelectItem>
            <SelectItem value="Q">Quartile (25% recovery)</SelectItem>
            <SelectItem value="H">High (30% recovery)</SelectItem>
          </SelectContent>
        </Select>
      </motion.div>

      {/* Color Customization */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="card grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        <div>
          <Label className="text-sm font-bold block mb-3">Dark Color</Label>
          <div className="flex gap-3">
            <input
              type="color"
              value={options.darkColor}
              onChange={(e) => setOptions({ ...options, darkColor: e.target.value })}
              className="w-12 h-12 rounded-lg border border-border/50 cursor-pointer"
            />
            <Input
              value={options.darkColor}
              onChange={(e) => setOptions({ ...options, darkColor: e.target.value })}
              placeholder="#000000"
              className="flex-1 bg-surface-alt border-border/50"
            />
          </div>
        </div>
        <div>
          <Label className="text-sm font-bold block mb-3">Light Color</Label>
          <div className="flex gap-3">
            <input
              type="color"
              value={options.lightColor}
              onChange={(e) => setOptions({ ...options, lightColor: e.target.value })}
              className="w-12 h-12 rounded-lg border border-border/50 cursor-pointer"
            />
            <Input
              value={options.lightColor}
              onChange={(e) => setOptions({ ...options, lightColor: e.target.value })}
              placeholder="#FFFFFF"
              className="flex-1 bg-surface-alt border-border/50"
            />
          </div>
        </div>
      </motion.div>

      {/* Action Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-4"
      >
        <Button
          onClick={generateQR}
          className="btn-smooth bg-gradient-to-r from-primary to-secondary text-white font-bold py-6"
        >
          <RefreshCw className="h-5 w-5 mr-2" />
          Generate QR
        </Button>
        <Button
          onClick={copySVG}
          variant="outline"
          className="btn-smooth border-border/50 hover:bg-primary/10"
        >
          <Copy className="h-5 w-5 mr-2" />
          {copied ? 'Copied!' : 'Copy'}
        </Button>
        <Button
          onClick={downloadQR}
          disabled={!qrCode}
          className="btn-smooth bg-accent text-accent-foreground font-bold py-6"
        >
          <Download className="h-5 w-5 mr-2" />
          Download
        </Button>
      </motion.div>
    </div>
  )
}
