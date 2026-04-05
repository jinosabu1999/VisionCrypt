'use client'

import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Upload, Download, RotateCcw, Target, HardDrive } from 'lucide-react'
import { useToast } from '@/components/ui/use-toast'

interface ResizeOptions {
  width: number
  height: number
  lockAspect: boolean
  unit: 'px' | 'percent'
  maxFileSize: number
  useTargetSize: boolean
  targetWidth: number
  targetHeight: number
}

export function ImageEditor() {
  const [image, setImage] = useState<string | null>(null)
  const [fileSize, setFileSize] = useState(0)
  const [originalDimensions, setOriginalDimensions] = useState({ width: 0, height: 0 })
  const [resizeOptions, setResizeOptions] = useState<ResizeOptions>({
    width: 800,
    height: 600,
    lockAspect: true,
    unit: 'px',
    maxFileSize: 100,
    useTargetSize: false,
    targetWidth: 512,
    targetHeight: 512,
  })
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setFileSize(Math.round(file.size / 1024))

    const reader = new FileReader()
    reader.onload = (event) => {
      const img = new Image()
      img.crossOrigin = "anonymous"
      img.onload = () => {
        setImage(event.target?.result as string)
        setOriginalDimensions({ width: img.width, height: img.height })
        setResizeOptions({
          ...resizeOptions,
          width: img.width,
          height: img.height,
          targetWidth: Math.min(512, img.width),
          targetHeight: Math.min(512, img.height),
        })
      }
      img.src = event.target?.result as string
    }
    reader.readAsDataURL(file)
  }

  const updateWidth = (value: number) => {
    let newHeight = resizeOptions.height
    if (resizeOptions.lockAspect && originalDimensions.width > 0) {
      const aspectRatio = originalDimensions.height / originalDimensions.width
      newHeight = Math.round(value * aspectRatio)
    }
    setResizeOptions({
      ...resizeOptions,
      width: value,
      height: newHeight,
    })
  }

  const updateHeight = (value: number) => {
    let newWidth = resizeOptions.width
    if (resizeOptions.lockAspect && originalDimensions.height > 0) {
      const aspectRatio = originalDimensions.width / originalDimensions.height
      newWidth = Math.round(value * aspectRatio)
    }
    setResizeOptions({
      ...resizeOptions,
      width: newWidth,
      height: value,
    })
  }

  const resizeImage = () => {
    if (!image || !canvasRef.current) return

    const img = new Image()
    img.crossOrigin = "anonymous"
    img.onload = () => {
      const canvas = canvasRef.current!
      let width = resizeOptions.width
      let height = resizeOptions.height

      if (resizeOptions.useTargetSize) {
        width = resizeOptions.targetWidth
        height = resizeOptions.targetHeight
      } else if (resizeOptions.unit === 'percent') {
        width = Math.round((img.width * resizeOptions.width) / 100)
        height = Math.round((img.height * resizeOptions.height) / 100)
      }

      canvas.width = width
      canvas.height = height
      const ctx = canvas.getContext('2d')!
      ctx.drawImage(img, 0, 0, width, height)

      let quality = 0.95
      let resizedImage = canvas.toDataURL('image/jpeg', quality)
      let fileSizeKB = Math.round((resizedImage.length * 3) / 4 / 1024)

      // If file size exceeds max, reduce quality
      while (fileSizeKB > resizeOptions.maxFileSize && quality > 0.1) {
        quality -= 0.05
        resizedImage = canvas.toDataURL('image/jpeg', quality)
        fileSizeKB = Math.round((resizedImage.length * 3) / 4 / 1024)
      }

      setImage(resizedImage)
      setFileSize(fileSizeKB)
      toast({
        title: "Success",
        description: `Image resized to ${width}x${height} (${fileSizeKB}KB)`,
      })
    }
    img.src = image
  }

  const downloadImage = () => {
    if (!canvasRef.current) return

    const link = document.createElement('a')
    link.href = canvasRef.current.toDataURL('image/png')
    link.download = `image-${Date.now()}.png`
    link.click()
    toast({
      title: "Success",
      description: 'Image downloaded successfully',
    })
  }

  const resetImage = () => {
    setImage(null)
    setFileSize(0)
    setResizeOptions({
      width: 800,
      height: 600,
      lockAspect: true,
      unit: 'px',
      maxFileSize: 100,
      useTargetSize: false,
      targetWidth: 512,
      targetHeight: 512,
    })
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="relative border-2 border-dashed border-primary/30 rounded-2xl p-8 text-center hover:border-primary transition-all duration-300 cursor-pointer glass hover:bg-white/10"
          onClick={() => fileInputRef.current?.click()}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
          />
          <Upload className="h-12 w-12 mx-auto mb-3 text-accent" />
          <p className="font-bold text-lg">Upload an image</p>
          <p className="text-sm text-muted-foreground">PNG, JPG, WebP (max 50MB)</p>
        </div>
      </div>

      {image && (
        <>
          <div className="card space-y-6">
            {/* Target Size Mode */}
            <div className="p-4 bg-surface-alt/50 rounded-xl border border-border/50">
              <div className="flex items-center justify-between mb-4">
                <Label className="flex items-center gap-2"><Target className="h-4 w-4" /> Target Size</Label>
                <Switch
                  checked={resizeOptions.useTargetSize}
                  onCheckedChange={(checked) =>
                    setResizeOptions({ ...resizeOptions, useTargetSize: checked })
                  }
                />
              </div>
              {resizeOptions.useTargetSize && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="target-width" className="text-xs">Target Width (px)</Label>
                    <Input
                      id="target-width"
                      type="number"
                      value={resizeOptions.targetWidth}
                      onChange={(e) => setResizeOptions({ ...resizeOptions, targetWidth: Number(e.target.value) })}
                      className="mt-2"
                    />
                  </div>
                  <div>
                    <Label htmlFor="target-height" className="text-xs">Target Height (px)</Label>
                    <Input
                      id="target-height"
                      type="number"
                      value={resizeOptions.targetHeight}
                      onChange={(e) => setResizeOptions({ ...resizeOptions, targetHeight: Number(e.target.value) })}
                      className="mt-2"
                    />
                  </div>
                </div>
              )}
            </div>

            {!resizeOptions.useTargetSize && (
              <>
                <div className="space-y-3">
                  <Label className="text-sm font-semibold">Resize by</Label>
                  <div className="flex gap-2">
                    {(['px', 'percent'] as const).map((unit) => (
                      <Button
                        key={unit}
                        variant={resizeOptions.unit === unit ? 'default' : 'outline'}
                        onClick={() => setResizeOptions({ ...resizeOptions, unit })}
                        className="flex-1"
                      >
                        {unit === 'px' ? 'Pixels' : 'Percent'}
                      </Button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="width" className="text-xs">Width {resizeOptions.unit === 'percent' ? '(%)' : '(px)'}</Label>
                    <Input
                      id="width"
                      type="number"
                      value={resizeOptions.width}
                      onChange={(e) => updateWidth(Number(e.target.value))}
                      className="mt-2"
                    />
                  </div>
                  <div>
                    <Label htmlFor="height" className="text-xs">Height {resizeOptions.unit === 'percent' ? '(%)' : '(px)'}</Label>
                    <Input
                      id="height"
                      type="number"
                      value={resizeOptions.height}
                      onChange={(e) => updateHeight(Number(e.target.value))}
                      className="mt-2"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 bg-surface-alt/50 rounded-lg border border-border/50">
                  <Label htmlFor="aspect" className="text-sm">Lock aspect ratio</Label>
                  <Switch
                    id="aspect"
                    checked={resizeOptions.lockAspect}
                    onCheckedChange={(checked) =>
                      setResizeOptions({ ...resizeOptions, lockAspect: checked })
                    }
                  />
                </div>
              </>
            )}

            {/* File Size Control */}
            <div className="p-4 bg-surface-alt/50 rounded-xl border border-border/50">
              <Label className="flex items-center gap-2 text-sm font-semibold mb-3"><HardDrive className="h-4 w-4" /> Max File Size</Label>
              <div className="flex items-center gap-3">
                <Input
                  type="number"
                  value={resizeOptions.maxFileSize}
                  onChange={(e) => setResizeOptions({ ...resizeOptions, maxFileSize: Number(e.target.value) })}
                  min="10"
                  max="5000"
                  className="flex-1"
                />
                <span className="text-sm text-muted-foreground font-medium">KB</span>
              </div>
            </div>

            <Button onClick={resizeImage} className="w-full btn-smooth bg-gradient-to-r from-primary to-secondary text-white font-bold py-6">
              Resize Image
            </Button>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-lg font-semibold">Preview</Label>
              <div className="text-xs text-muted-foreground">
                {fileSize > 0 && <span>{fileSize} KB</span>}
              </div>
            </div>
            <div className="bg-gradient-to-br from-muted/50 to-surface-alt rounded-2xl p-6 flex items-center justify-center max-h-96 overflow-auto border border-border/50">
              <img
                src={image}
                alt="Preview"
                className="max-w-full max-h-full rounded-xl shadow-lg"
              />
            </div>
            <canvas ref={canvasRef} className="hidden" />
          </div>

          <div className="flex gap-3">
            <Button onClick={downloadImage} className="flex-1 btn-smooth bg-gradient-to-r from-accent to-secondary text-white font-bold py-6">
              <Download className="h-4 w-4 mr-2" />
              Download
            </Button>
            <Button onClick={resetImage} variant="outline" className="flex-1 btn-smooth">
              <RotateCcw className="h-4 w-4 mr-2" />
              Reset
            </Button>
          </div>
        </>
      )}
    </div>
  )
}
