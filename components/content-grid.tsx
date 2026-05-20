"use client"

import { motion } from "framer-motion"
import { BookOpen, MessageCircle, Sparkles, Lock } from "lucide-react"

const contentCards = [
  {
    id: 1,
    title: "건전 청정 진심 토익",
    description: "Pure, clean, and heartfelt TOEIC prep. No shortcuts, just results.",
    icon: <BookOpen className="w-6 h-6" />,
    color: "primary",
    tag: "TOEIC",
    image: "/placeholder-user.jpg",
  },
  {
    id: 2,
    title: "K-Slang for Foreigners",
    description: "Learn Korean slang that textbooks won&apos;t teach you. 진짜 한국어.",
    icon: <MessageCircle className="w-6 h-6" />,
    color: "accent",
    tag: "Language",
    image: "/placeholder.jpg",
  },
  {
    id: 3,
    title: "Classic ZOZIGI",
    description: "The legendary content that started it all. Absurd comedy meets education.",
    icon: <Sparkles className="w-6 h-6" />,
    color: "primary",
    tag: "Comedy",
    image: "/placeholder-logo.png",
  },
  {
    id: 4,
    title: "The Secret Lab (19+)",
    description: "Adult-only content. Enter at your own risk. 병맛 guaranteed.",
    icon: <Lock className="w-6 h-6" />,
    color: "accent",
    tag: "19+",
    restricted: true,
    image: "/apple-icon.png",
  },
]

export function ContentGrid() {
  return (
    <section id="content" className="relative py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-accent font-mono text-sm tracking-widest uppercase">
            {"// Content Library"}
          </span>
          <h2 className="font-[family-name:var(--font-playfair)] text-3xl sm:text-4xl font-bold mt-4">
            Choose Your <span className="text-primary">Poison</span>
          </h2>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {contentCards.map((card, index) => (
            <motion.div
              key={card.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <ContentCard {...card} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

function ContentCard({
  title,
  description,
  icon,
  color,
  tag,
  restricted,
  image,
}: {
  title: string
  description: string
  icon: React.ReactNode
  color: "primary" | "accent"
  tag: string
  restricted?: boolean
  image?: string
}) {
  const borderClass = color === "primary" ? "hover:border-primary" : "hover:border-accent"
  const iconBgClass = color === "primary" ? "bg-primary/20 text-primary" : "bg-accent/20 text-accent"
  const tagClass = color === "primary" 
    ? "bg-primary/20 text-primary border-primary/30" 
    : "bg-accent/20 text-accent border-accent/30"

  return (
    <motion.a
      href="#"
      whileHover={{ y: -8 }}
      className={`group block glass rounded-2xl p-6 border border-border/50 transition-all duration-300 glow-border ${borderClass} relative overflow-hidden`}
    >
      {/* Restricted Badge */}
      {restricted && (
        <div className="absolute top-3 right-3">
          <span className="px-2 py-1 bg-destructive/20 text-destructive text-xs font-mono rounded-full border border-destructive/30">
            19+
          </span>
        </div>
      )}

      {/* 이미지 */}
      {image && (
        <div className="w-full flex justify-center mb-4">
          <img src={image} alt={title} className="rounded-xl object-cover w-28 h-28" />
        </div>
      )}

      {/* Icon */}
      <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl mb-4 ${iconBgClass}`}>
        {icon}
      </div>

      {/* Tag */}
      <span className={`inline-block px-2 py-1 text-xs font-mono rounded-full border mb-3 ${tagClass}`}>
        {tag}
      </span>

      {/* Content */}
      <h3 className="font-[family-name:var(--font-playfair)] text-lg font-semibold mb-2 group-hover:text-primary transition-colors">
        {title}
      </h3>
      <p className="text-sm text-muted-foreground leading-relaxed">
        {description}
      </p>

      {/* Hover Glow Effect */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
        <div className={`absolute -bottom-20 -right-20 w-40 h-40 rounded-full blur-3xl ${color === "primary" ? "bg-primary/20" : "bg-accent/20"}`} />
      </div>
    </motion.a>
  )
}
