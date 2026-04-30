'use client'

import { useState } from 'react'
import { Button } from '@/components/UI/button'
import { Download, Copy, Check, ChevronDown } from 'lucide-react'
import { useToast } from '@/components/UI/use-toast'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/UI/dropdown-menu'
import { motion } from 'framer-motion'

interface ExportButtonProps {
  data: string | Blob
  filename: string
  formats?: Array<{
    label: string
    action: () => void
  }>
}

export function ExportButton({ data, filename, formats }: ExportButtonProps) {
  const [copied, setCopied] = useState(false)
  const { toast } = useToast()

  const handleDownload = () => {
    if (data instanceof Blob) {
      const url = URL.createObjectURL(data)
      const link = document.createElement('a')
      link.href = url
      link.download = filename
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
    } else {
      const element = document.createElement('a')
      element.setAttribute('href', `data:text/plain;charset=utf-8,${encodeURIComponent(data)}`)
      element.setAttribute('download', filename)
      element.style.display = 'none'
      document.body.appendChild(element)
      element.click()
      document.body.removeChild(element)
    }

    toast({
      title: 'Success',
      description: `${filename} downloaded successfully`,
    })
  }

  const handleCopy = async () => {
    if (data instanceof Blob) {
      toast({
        title: 'Error',
        description: 'Cannot copy binary file to clipboard',
        variant: 'destructive',
      })
      return
    }

    try {
      await navigator.clipboard.writeText(data)
      setCopied(true)
      toast({
        title: 'Success',
        description: 'Content copied to clipboard',
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

  if (formats && formats.length > 0) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button className="btn-smooth bg-gradient-to-r from-primary to-secondary text-white font-bold py-6">
            <Download className="h-5 w-5 mr-2" />
            Export
            <ChevronDown className="h-4 w-4 ml-2" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="bg-surface border-border/50">
          {formats.map((format, index) => (
            <DropdownMenuItem
              key={index}
              onClick={format.action}
              className="cursor-pointer hover:bg-surface-alt"
            >
              {format.label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }

  return (
    <div className="flex gap-2">
      <Button
        onClick={handleDownload}
        className="btn-smooth bg-gradient-to-r from-primary to-secondary text-white font-bold py-6 flex-1"
      >
        <Download className="h-5 w-5 mr-2" />
        Download
      </Button>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleCopy}
        className="px-6 py-3 rounded-lg bg-surface-alt border border-border/50 hover:bg-primary/20 hover:border-primary/50 transition-all duration-300"
      >
        {copied ? (
          <Check className="h-5 w-5 text-green-500" />
        ) : (
          <Copy className="h-5 w-5 text-primary" />
        )}
      </motion.button>
    </div>
  )
}
