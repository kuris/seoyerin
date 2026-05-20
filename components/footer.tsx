"use client"

import { motion } from "framer-motion"
import { ExternalLink, Shield } from "lucide-react"

const socialLinks = [
  {
    name: "Tistory",
    href: "https://tistory.com",
    description: "Blog & Articles",
  },
  {
    name: "Postype",
    href: "https://postype.com",
    description: "Premium Content",
  },
  {
    name: "X (Twitter)",
    href: "https://x.com",
    description: "Daily Updates",
  },
]

export function Footer() {
  return (
    <footer id="archive" className="relative py-16 border-t border-border">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-3 gap-12 mb-12">
          {/* Brand */}
          <div>
            <h3 className="font-[family-name:var(--font-playfair)] text-2xl font-bold text-primary mb-4">
              zozigi.com
            </h3>
            <p className="text-muted-foreground text-sm leading-relaxed mb-4">
              Elite Tech Expert by day, Absurd Comedy Artist by night.
              Destroying the boredom of learning since 2020.
            </p>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Shield className="w-4 h-4 text-accent" />
              <span>Archive.is Verified</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-3">
              <li>
                <a href="#content" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Content Library
                </a>
              </li>
              <li>
                <a href="#lab" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  The Secret Lab
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  About Ye-rin
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Contact
                </a>
              </li>
            </ul>
          </div>

          {/* Social Links */}
          <div>
            <h4 className="font-semibold mb-4">Connect</h4>
            <ul className="space-y-3">
              {socialLinks.map((link) => (
                <li key={link.name}>
                  <motion.a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ x: 4 }}
                    className="flex items-center justify-between group"
                  >
                    <div>
                      <span className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                        {link.name}
                      </span>
                      <span className="block text-xs text-muted-foreground">
                        {link.description}
                      </span>
                    </div>
                    <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                  </motion.a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            © 2024 Seo Ye-rin&apos;s Secret Lab. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <a href="#" className="text-xs text-muted-foreground hover:text-primary transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="text-xs text-muted-foreground hover:text-primary transition-colors">
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
