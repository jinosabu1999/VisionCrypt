'use client'

import { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'
import { Upload, Zap } from 'lucide-react'
import { useToast } from '@/components/ui/use-toast'
import { motion } from 'framer-motion'

interface CompressionState {
  mode: 'quality' | 'dimensions' | 'target-size'
  quality: number
  width: number
  height: number
  percentage: number
  targetSizeKB: number
  lockAspect: boolean
}

export function ImageCompressor() {
  const [image, setImage] = useState<string | null>(null)
  const [originalSize, setOriginalSize] = useState(0)
  const [compressedSize, setCompressedSize] = useState(0)
  const [originalDimensions, setOriginalDimensions] = useState({ width: 0, height: 0 })
  const [state, setState] = useState<CompressionState>({
    mode: 'quality',
    quality: 80,
    width: 1920,
    height: 1080,
    percentage: 100,
    targetSizeKB: 500,
    lockAspect: true,
  })
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setOriginalSize(Math.round(file.size / 1024))

    const reader = new FileReader()
    reader.onload = (event) => {
      const img = new Image()
      img.crossOrigin = 'anonymous'
      img.onload = () => {
        setImage(event.target?.result as string)
        setOriginalDimensions({ width: img.width, height: img.height })
        setState({
          ...state,
          width: img.width,
          height: img.height,
          percentage: 100,
        })
        toast({
          title: 'Success',
          description: `Image loaded: ${img.width}x${img.height}px`,
        })
      }
      img.src = event.target?.result as string
    }
    reader.readAsDataURL(file)
  }

  const compressImage = async () => {
    if (!image) {
      toast({
        title: 'Error',
        description: 'Please upload an image first',
        variant: 'destructive',
      })
      return
    }

    try {
      const img = new Image()
      img.crossOrigin = 'anonymous'
      img.onload = () => {
        const canvas = document.createElement('canvas')
        let width = state.width
        let height = state.height

        if (state.mode === 'dimensions') {
          width = state.width
          height = state.lockAspect
            ? Math.round((state.width / originalDimensions.width) * originalDimensions.height)
            : state.height
        } else if (state.mode === 'quality' && state.percentage < 100) {
          width = Math.round((originalDimensions.width * state.percentage) / 100)
          height = Math.round((originalDimensions.height * state.percentage) / 100)
        }

        canvas.width = width
        canvas.height = height

        const ctx = canvas.getContext('2d')
        if (!ctx) return

        ctx.drawImage(img, 0, 0, width, height)

        canvas.toBlob(
          (blob) => {
            if (blob) {
              setCompressedSize(Math.round(blob.size / 1024))
              const url = URL.createObjectURL(blob)
              const link = document.createElement('a')
              link.href = url
              link.download = `compressed-${Date.now()}.png`
              document.body.appendChild(link)
              link.click()
              document.body.removeChild(link)
              URL.revokeObjectURL(url)

              const reduction = ((1 - blob.size / (originalSize * 1024)) * 100).toFixed(1)
              toast({
                title: 'Success',
                description: `Compressed ${reduction}% - New size: ${Math.round(blob.size / 1024)}KB`,
              })
            }
          },
          'image/png',
          state.mode === 'quality' ? state.quality / 100 : 0.8
        )
      }
      img.src = image
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to compress image',
        variant: 'destructive',
      })
    }
  }

  const updateWidth = (value: number) => {
    let height = state.height
    if (state.lockAspect && originalDimensions.width > 0) {
      height = Math.round((value / originalDimensions.width) * originalDimensions.height)
    }
    setState({ ...state, width: value, height })
  }

  return (
    <div className="space-y-8">
      {/* File Upload */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card"
      >
        <Label className="text-xs uppercase tracking-widest text-muted-foreground font-bold block mb-4">
          Upload Image
        </Label>
        <div
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-border/50 rounded-xl p-8 text-center cursor-pointer hover:border-primary/50 transition-colors duration-300"
        >
          <Upload className="h-10 w-10 mx-auto mb-3 text-muted-foreground" />
          <p className="text-sm font-medium text-foreground mb-1">Click to upload or drag and drop</p>
          <p className="text-xs text-muted-foreground">PNG, JPG, WebP up to 10MB</p>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
          />
        </div>
      </motion.div>

      {image && (
        <>
          {/* Image Preview */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="card"
          >
            <Label className="text-xs uppercase tracking-widest text-muted-foreground font-bold block mb-4">
              Preview
            </Label>
            <div className="w-full max-h-64 overflow-hidden rounded-lg border border-border/50">
              <img src={image} alt="Preview" className="w-full h-auto object-contain" />
            </div>
            <div className="flex gap-4 mt-4 text-sm">
              <div>
                <p className="text-xs text-muted-foreground mb-1">Original Size</p>
                <p className="font-bold text-primary">{originalSize} KB</p>
              </div>
              {compressedSize > 0 && (
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Compressed Size</p>
                  <p className="font-bold text-green-500">{compressedSize} KB</p>
                </div>
              )}
            </div>
          </motion.div>

          {/* Compression Mode */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="card"
          >
            <Label className="text-sm font-bold block mb-4">Compression Mode</Label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { mode: 'quality', label: 'Quality' },
                { mode: 'dimensions', label: 'Dimensions' },
                { mode: 'target-size', label: 'Target Size' },
              ].map((option) => (
                <button
                  key={option.mode}
                  onClick={() => setState({ ...state, mode: option.mode as CompressionState['mode'] })}
                  className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-300 border ${
                    state.mode === option.mode
                      ? 'bg-primary text-white border-primary'
                      : 'border-border/50 hover:border-primary/50'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </motion.div>

          {/* Quality Mode */}
          {state.mode === 'quality' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="card"
            >
              <div className="flex items-center justify-between mb-4">
                <Label className="text-sm font-bold">Quality & Scale</Label>
                <span className="text-2xl font-bold gradient-text">{state.percentage}%</span>
              </div>
              <Slider
                value={[state.percentage]}
                onValueChange={([value]) => setState({ ...state, percentage: value })}
                min={10}
                max={100}
                step={5}
                className="w-full"
              />
              <p className="text-xs text-muted-foreground mt-3">
                New size: {Math.round((originalDimensions.width * state.percentage) / 100)}x
                {Math.round((originalDimensions.height * state.percentage) / 100)}px
              </p>
            </motion.div>
          )}

          {/* Dimensions Mode */}
          {state.mode === 'dimensions' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="card space-y-4"
            >
              <div>
                <Label className="text-sm font-bold block mb-3">Width (px)</Label>
                <Input
                  type="number"
                  value={state.width}
                  onChange={(e) => updateWidth(Number(e.target.value))}
                  className="bg-surface-alt border-border/50"
                />
              </div>
              <div>
                <Label className="text-sm font-bold block mb-3">Height (px)</Label>
                <Input
                  type="number"
                  value={state.height}
                  disabled={state.lockAspect}
                  onChange={(e) => setState({ ...state, height: Number(e.target.value) })}
                  className="bg-surface-alt border-border/50"
                />
              </div>
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input
                  type="checkbox"
                  checked={state.lockAspect}
                  onChange={(e) => setState({ ...state, lockAspect: e.target.checked })}
                  className="rounded"
                />
                <span>Lock aspect ratio</span>
              </label>
            </motion.div>
          )}

          {/* Target Size Mode */}
          {state.mode === 'target-size' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="card"
            >
              <Label className="text-sm font-bold block mb-4">Target Size (KB)</Label>
              <Input
                type="number"
                value={state.targetSizeKB}
                onChange={(e) => setState({ ...state, targetSizeKB: Number(e.target.value) })}
                className="bg-surface-alt border-border/50"
              />
              <p className="text-xs text-muted-foreground mt-3">
                Will automatically scale image to reach target file size
              </p>
            </motion.div>
          )}

          {/* Compress Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Button
              onClick={compressImage}
              className="w-full btn-smooth bg-gradient-to-r from-primary to-secondary text-white font-bold py-6"
            >
              <Zap className="h-5 w-5 mr-2" />
              Compress & Download
            </Button>
          </motion.div>
        </>
      )}
    </div>
  )
}
