"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Terminal, Lock, Brain, GitBranch, Circle, ChevronRight, Sparkles } from "lucide-react"
import { SerialKeyModal } from "./serial-key-modal"

export function AISection() {
  const [showModal, setShowModal] = useState(false)
  const [terminalText, setTerminalText] = useState("")

  const handleFeatureClick = () => {
    setShowModal(true)
  }

  return (
    <section id="lab" className="relative py-24 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-card/50 to-background" />
      
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-accent font-mono text-sm tracking-widest uppercase">
            {"// AI Interaction Zone"}
          </span>
          <h2 className="font-[family-name:var(--font-playfair)] text-3xl sm:text-4xl font-bold mt-4">
            The Secret <span className="text-primary">Lab</span>
          </h2>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Grammar Clinic Terminal */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="glass rounded-2xl overflow-hidden glow-border">
              {/* Terminal Header */}
              <div className="flex items-center gap-2 px-4 py-3 bg-muted/50 border-b border-border">
                <div className="flex gap-1.5">
                  <Circle className="w-3 h-3 fill-destructive text-destructive" />
                  <Circle className="w-3 h-3 fill-yellow-500 text-yellow-500" />
                  <Circle className="w-3 h-3 fill-accent text-accent" />
                </div>
                <span className="flex-1 text-center font-mono text-xs text-muted-foreground">
                  grammar-clinic-lite.exe
                </span>
                <Terminal className="w-4 h-4 text-muted-foreground" />
              </div>

              {/* Terminal Body */}
              <div className="p-6 font-mono text-sm">
                <div className="text-muted-foreground mb-4">
                  <span className="text-accent">zozigi@lab</span>
                  <span className="text-primary">:</span>
                  <span className="text-accent">~</span>
                  <span className="text-primary">$</span>
                  {" "}grammar-clinic --analyze
                </div>
                
                <div className="bg-input/50 rounded-lg p-4 mb-4">
                  <input
                    type="text"
                    value={terminalText}
                    onChange={(e) => setTerminalText(e.target.value)}
                    placeholder="Enter your sentence for grammar check..."
                    className="w-full bg-transparent text-foreground placeholder:text-muted-foreground focus:outline-none"
                    onClick={handleFeatureClick}
                    readOnly
                  />
                </div>

                <div className="flex items-center gap-2 text-muted-foreground">
                  <Sparkles className="w-4 h-4 text-primary" />
                  <span>AI-powered grammar analysis ready...</span>
                  <span className="cursor-blink">▊</span>
                </div>
              </div>

              {/* Locked Overlay */}
              <div 
                className="absolute inset-0 bg-background/80 backdrop-blur-sm flex flex-col items-center justify-center cursor-pointer"
                onClick={handleFeatureClick}
              >
                <Lock className="w-12 h-12 text-primary mb-4" />
                <h3 className="font-[family-name:var(--font-playfair)] text-xl font-bold mb-2">
                  Serial Key Required
                </h3>
                <p className="text-muted-foreground text-sm mb-4">Members Only</p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-6 py-2 bg-primary text-primary-foreground font-medium rounded-lg flex items-center gap-2"
                >
                  Get Key at Postype
                  <ChevronRight className="w-4 h-4" />
                </motion.button>
              </div>
            </div>
          </motion.div>

          {/* Mindmap Visualizer */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="glass rounded-2xl overflow-hidden glow-border">
              {/* Header */}
              <div className="flex items-center gap-2 px-4 py-3 bg-muted/50 border-b border-border">
                <Brain className="w-4 h-4 text-primary" />
                <span className="font-mono text-xs text-muted-foreground">
                  mindmap-visualizer.tsx
                </span>
              </div>

              {/* Mindmap Body */}
              <div className="p-6 min-h-[300px] relative">
                {/* Central Node */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                  <motion.div
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                    className="w-16 h-16 rounded-full bg-primary/20 border-2 border-primary flex items-center justify-center"
                  >
                    <Brain className="w-8 h-8 text-primary" />
                  </motion.div>
                </div>

                {/* Branch Nodes */}
                {[
                  { angle: 0, label: "TOEIC", delay: 0 },
                  { angle: 72, label: "Slang", delay: 0.1 },
                  { angle: 144, label: "Grammar", delay: 0.2 },
                  { angle: 216, label: "Comedy", delay: 0.3 },
                  { angle: 288, label: "Tech", delay: 0.4 },
                ].map((node, i) => {
                  const x = Math.cos((node.angle * Math.PI) / 180) * 100
                  const y = Math.sin((node.angle * Math.PI) / 180) * 80
                  return (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, scale: 0 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: node.delay }}
                      className="absolute top-1/2 left-1/2"
                      style={{ transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))` }}
                    >
                      <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent/20 border border-accent/50 text-xs font-mono text-accent">
                        <GitBranch className="w-3 h-3" />
                        {node.label}
                      </div>
                    </motion.div>
                  )
                })}

                {/* Connection Lines (SVG) */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none">
                  {[0, 72, 144, 216, 288].map((angle, i) => {
                    const x = 50 + Math.cos((angle * Math.PI) / 180) * 25
                    const y = 50 + Math.sin((angle * Math.PI) / 180) * 25
                    return (
                      <line
                        key={i}
                        x1="50%"
                        y1="50%"
                        x2={`${x}%`}
                        y2={`${y}%`}
                        stroke="oklch(0.65 0.28 300 / 0.3)"
                        strokeWidth="1"
                        strokeDasharray="4 4"
                      />
                    )
                  })}
                </svg>
              </div>

              {/* Locked Overlay */}
              <div 
                className="absolute inset-0 bg-background/80 backdrop-blur-sm flex flex-col items-center justify-center cursor-pointer"
                onClick={handleFeatureClick}
              >
                <Lock className="w-12 h-12 text-primary mb-4" />
                <h3 className="font-[family-name:var(--font-playfair)] text-xl font-bold mb-2">
                  Serial Key Required
                </h3>
                <p className="text-muted-foreground text-sm mb-4">Members Only</p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-6 py-2 bg-primary text-primary-foreground font-medium rounded-lg flex items-center gap-2"
                >
                  Get Key at Postype
                  <ChevronRight className="w-4 h-4" />
                </motion.button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <SerialKeyModal isOpen={showModal} onClose={() => setShowModal(false)} />
    </section>
  )
}
