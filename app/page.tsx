import { Header } from "@/components/header"
import { HeroSection } from "@/components/hero-section"
import { AISection } from "@/components/ai-section"
import { Mindmap } from "@/components/mindmap"
import { Footer } from "@/components/footer"

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <Header />
      <HeroSection />
      <AISection />
      <Mindmap />
      <Footer />
    </main>
  )
}
