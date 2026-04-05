'use client'

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Copy, RefreshCw, Check, Shield, Zap } from 'lucide-react'
import { useToast } from "@/components/ui/use-toast"
import { motion } from "framer-motion"

export function PasswordGenerator() {
  const [password, setPassword] = useState("")
  const [length, setLength] = useState(12)
  const [includeUppercase, setIncludeUppercase] = useState(true)
  const [includeLowercase, setIncludeLowercase] = useState(true)
  const [includeNumbers, setIncludeNumbers] = useState(true)
  const [includeSymbols, setIncludeSymbols] = useState(true)
  const [copied, setCopied] = useState(false)
  const { toast } = useToast()

  const generatePassword = () => {
    let charset = ""
    if (includeUppercase) charset += "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
    if (includeLowercase) charset += "abcdefghijklmnopqrstuvwxyz"
    if (includeNumbers) charset += "0123456789"
    if (includeSymbols) charset += "!@#$%^&*()_+-=[]{}|;:,.<>?"

    let newPassword = ""
    for (let i = 0; i < length; i++) {
      newPassword += charset.charAt(Math.floor(Math.random() * charset.length))
    }
    setPassword(newPassword)
  }

  useEffect(() => {
    generatePassword()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(password)
    setCopied(true)
    toast({
      title: "Success",
      description: "Password copied to clipboard",
    })
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="space-y-8">
      {/* Password Display */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card"
      >
        <Label className="text-xs uppercase tracking-widest text-muted-foreground font-bold block mb-3">Your Secure Password</Label>
        <div className="relative group">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <Input
            value={password}
            readOnly
            placeholder="Generated password will appear here"
            className="relative pr-12 text-lg font-mono font-bold tracking-wider bg-surface-alt text-accent border-border/50 rounded-2xl placeholder-muted-foreground/40"
          />
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-lg hover:bg-primary/20 transition-colors"
            onClick={copyToClipboard}
          >
            {copied ? (
              <motion.div
                key="check"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
              >
                <Check className="h-5 w-5 text-accent" />
              </motion.div>
            ) : (
              <motion.div
                key="copy"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
              >
                <Copy className="h-5 w-5 text-primary" />
              </motion.div>
            )}
          </motion.button>
        </div>
      </motion.div>

      {/* Length Control */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="card"
      >
        <div className="flex items-center justify-between mb-4">
          <Label className="text-sm font-bold flex items-center gap-2"><Zap className="w-4 h-4" /> Password Length</Label>
          <span className="text-3xl font-bold gradient-text">{length}</span>
        </div>
        <Slider
          value={[length]}
          onValueChange={([value]) => {
            setLength(value)
            generatePassword()
          }}
          min={6}
          max={32}
          step={1}
          className="w-full"
        />
        <div className="flex justify-between text-xs text-muted-foreground mt-3 font-semibold">
          <span>6 characters</span>
          <span>32 characters</span>
        </div>
      </motion.div>

      {/* Character Options */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="card"
      >
        <div className="flex items-center gap-2 mb-5">
          <Shield className="w-5 h-5 text-accent" />
          <h3 className="text-sm font-bold uppercase tracking-widest">Character Types</h3>
        </div>
        <div className="grid gap-3 grid-cols-1 sm:grid-cols-2">
          {[
            { id: 'uppercase', label: 'Uppercase Letters', state: includeUppercase, setState: setIncludeUppercase },
            { id: 'lowercase', label: 'Lowercase Letters', state: includeLowercase, setState: setIncludeLowercase },
            { id: 'numbers', label: 'Numbers', state: includeNumbers, setState: setIncludeNumbers },
            { id: 'symbols', label: 'Symbols', state: includeSymbols, setState: setIncludeSymbols },
          ].map((option) => (
            <motion.div 
              key={option.id}
              whileHover={{ scale: 1.02 }}
              className="flex items-center justify-between rounded-xl bg-surface-alt/50 border border-border/30 p-4 hover:border-primary/50 transition-all duration-300"
            >
              <Label htmlFor={option.id} className="text-sm font-semibold cursor-pointer">{option.label}</Label>
              <Switch
                id={option.id}
                checked={option.state}
                onCheckedChange={(checked) => {
                  option.setState(checked)
                  generatePassword()
                }}
              />
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Generate Button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Button
          className="w-full btn-smooth bg-gradient-to-r from-primary to-secondary text-white font-bold py-6 text-lg"
          onClick={generatePassword}
        >
          <RefreshCw className="h-5 w-5 mr-2" />
          Generate New Password
        </Button>
      </motion.div>
    </div>
  )
}


