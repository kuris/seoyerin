"use client"

import { motion } from "framer-motion"
import { TrendingUp, DollarSign, BarChart3, Zap } from "lucide-react"

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center pt-16 overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 -left-32 w-96 h-96 bg-primary/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-accent/20 rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-6"
          >
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-accent font-mono text-sm tracking-widest uppercase"
            >
              {"// Seo Ye-rin's Secret Lab"}
            </motion.p>
            
            <h1 className="font-[family-name:var(--font-playfair)] text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight text-balance">
              I destroy the{" "}
              <span className="text-primary">boredom</span>
              {" "}of learning.
            </h1>
            
            <p className="text-lg text-muted-foreground max-w-lg leading-relaxed">
              Elite Tech Expert by day, Absurd Comedy Artist by night. 
              Welcome to the intersection of knowledge and chaos.
            </p>

            <div className="flex flex-wrap gap-4 pt-4">
              <motion.a
                href="#lab"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-3 bg-primary text-primary-foreground font-medium rounded-lg hover:bg-primary/90 transition-colors"
              >
                Enter the Lab
              </motion.a>
              <motion.a
                href="#content"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-3 border border-border text-foreground font-medium rounded-lg hover:border-primary hover:text-primary transition-colors"
              >
                Browse Content
              </motion.a>
            </div>
          </motion.div>

          {/* Right Content - Glassmorphism Dashboard Card */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="relative"
          >
            <div className="glass rounded-2xl p-6 glow-purple scanlines">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-[family-name:var(--font-playfair)] text-xl font-semibold">
                  Daily 수익 인증
                </h3>
                <span className="px-3 py-1 bg-accent/20 text-accent text-xs font-mono rounded-full">
                  LIVE
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <DashboardStat
                  icon={<DollarSign className="w-5 h-5" />}
                  label="Today"
                  value="₩2,847,000"
                  trend="+12.5%"
                />
                <DashboardStat
                  icon={<TrendingUp className="w-5 h-5" />}
                  label="This Week"
                  value="₩18.2M"
                  trend="+8.3%"
                />
                <DashboardStat
                  icon={<BarChart3 className="w-5 h-5" />}
                  label="Subscribers"
                  value="47.2K"
                  trend="+324"
                />
                <DashboardStat
                  icon={<Zap className="w-5 h-5" />}
                  label="Engagement"
                  value="94.7%"
                  trend="+2.1%"
                />
              </div>

              {/* Mini Chart */}
              <div className="h-20 flex items-end gap-1">
                {[40, 65, 45, 80, 55, 90, 70, 85, 60, 95, 75, 88].map((h, i) => (
                  <motion.div
                    key={i}
                    initial={{ height: 0 }}
                    animate={{ height: `${h}%` }}
                    transition={{ delay: 0.5 + i * 0.05, duration: 0.4 }}
                    className="flex-1 bg-gradient-to-t from-primary to-accent rounded-t"
                  />
                ))}
              </div>
            </div>

            {/* Floating Elements */}
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ repeat: Infinity, duration: 3 }}
              className="absolute -top-4 -right-4 glass rounded-lg px-4 py-2 glow-lime"
            >
              <span className="text-accent font-mono text-sm">+₩847K</span>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

function DashboardStat({
  icon,
  label,
  value,
  trend,
}: {
  icon: React.ReactNode
  label: string
  value: string
  trend: string
}) {
  return (
    <div className="p-3 rounded-lg bg-background/50 border border-border/50">
      <div className="flex items-center gap-2 text-muted-foreground mb-1">
        {icon}
        <span className="text-xs">{label}</span>
      </div>
      <div className="font-mono font-bold text-lg">{value}</div>
      <div className="text-xs text-accent">{trend}</div>
    </div>
  )
}
