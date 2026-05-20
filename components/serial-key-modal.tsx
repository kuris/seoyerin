"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Key, ExternalLink, AlertCircle } from "lucide-react"

interface SerialKeyModalProps {
  isOpen: boolean
  onClose: () => void
}

export function SerialKeyModal({ isOpen, onClose }: SerialKeyModalProps) {
  const [serialKey, setSerialKey] = useState("")
  const [error, setError] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!serialKey.trim()) {
      setError("Please enter a serial key")
      return
    }
    // For demo purposes, show error
    setError("Invalid serial key. Get your key at Postype!")
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-background/80 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative glass rounded-2xl p-6 w-full max-w-md glow-purple"
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Icon */}
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 rounded-full bg-primary/20 border-2 border-primary flex items-center justify-center">
                <Key className="w-8 h-8 text-primary" />
              </div>
            </div>

            {/* Content */}
            <div className="text-center mb-6">
              <h3 className="font-[family-name:var(--font-playfair)] text-2xl font-bold mb-2">
                Enter Serial Key
              </h3>
              <p className="text-muted-foreground text-sm">
                Access exclusive AI features with your membership key
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <input
                  type="text"
                  value={serialKey}
                  onChange={(e) => {
                    setSerialKey(e.target.value)
                    setError("")
                  }}
                  placeholder="XXXX-XXXX-XXXX-XXXX"
                  className="w-full px-4 py-3 bg-input border border-border rounded-lg font-mono text-center tracking-widest placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-2 mt-2 text-destructive text-sm"
                  >
                    <AlertCircle className="w-4 h-4" />
                    {error}
                  </motion.div>
                )}
              </div>

              <motion.button
                type="submit"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-3 bg-primary text-primary-foreground font-medium rounded-lg hover:bg-primary/90 transition-colors"
              >
                Activate
              </motion.button>
            </form>

            {/* Divider */}
            <div className="flex items-center gap-4 my-6">
              <div className="flex-1 h-px bg-border" />
              <span className="text-muted-foreground text-xs">OR</span>
              <div className="flex-1 h-px bg-border" />
            </div>

            {/* CTA */}
            <motion.a
              href="https://www.postype.com/@yasulfactory"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center justify-center gap-2 w-full py-3 border border-accent text-accent font-medium rounded-lg hover:bg-accent/10 transition-colors"
            >
              Get Your Key at Postype
              <ExternalLink className="w-4 h-4" />
            </motion.a>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
