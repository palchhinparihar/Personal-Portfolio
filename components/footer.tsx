"use client"

import { motion, useInView } from "framer-motion"
import { useRef } from "react"
import { FaGithub, FaLinkedinIn, FaXTwitter } from "react-icons/fa6"
import { SiDevpost } from "react-icons/si"
import { FiArrowUp, FiHeart, FiMonitor } from "react-icons/fi"

function CodedexIcon({ size = 16 }: { size?: number }) {
  return <FiMonitor size={size} />
}

function DevfolioIcon({ size = 16 }: { size?: number }) {
  return (
    <span style={{ fontSize: size, fontWeight: 700, lineHeight: 1 }} aria-hidden="true">
      D
    </span>
  )
}

const navLinks = [
  { label: "Home", href: "#home" },
  { label: "About", href: "#about" },
  { label: "Experience", href: "#experience" },
  { label: "Projects", href: "#projects" },
  { label: "Skills", href: "#skills" },
  { label: "Contact", href: "#contact" },
]

const socialLinks = [
  { icon: FaGithub, href: "https://github.com/palchhinparihar", label: "GitHub" },
  { icon: FaLinkedinIn, href: "https://www.linkedin.com/in/palchhinparihar", label: "LinkedIn" },
  { icon: FaXTwitter, href: "https://x.com/palchhinx", label: "Twitter" },
  { icon: CodedexIcon, href: "https://www.codedex.io/@palchhin", label: "Codedex", isCustom: true },
  { icon: SiDevpost, href: "https://devpost.com/palchhinparihar", label: "Devpost" },
  { icon: DevfolioIcon, href: "https://devfolio.co/@palchhinparihar", label: "Devfolio", isCustom: true },
]

export default function Footer() {
  const footerRef = useRef<HTMLElement>(null)
  const isInView = useInView(footerRef, { once: true, margin: "-50px" })

  return (
    <footer
      ref={footerRef}
      className="relative z-10 border-t border-border bg-card/30 backdrop-blur-sm"
    >
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 md:py-16">
        <div className="grid gap-8 sm:gap-10 md:grid-cols-3">
          {/* Brand */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="flex flex-col gap-4"
          >
            <a href="#home" className="cursor-pointer text-xl font-semibold tracking-tight text-foreground">
              {"<"}
              <span className="text-primary">Palchhin</span>
              {" />"}
            </a>
            <p className="max-w-xs text-sm leading-relaxed text-muted-foreground">
              Building beautiful, performant, and accessible digital
              experiences. Always learning, always creating.
            </p>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="flex flex-col gap-4"
          >
            <h3 className="text-sm font-semibold tracking-wide uppercase text-foreground">
              Quick Links
            </h3>
            <ul className="flex flex-col gap-2.5">
              {navLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="cursor-pointer text-sm text-muted-foreground transition-colors duration-200 hover:text-primary"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Socials + Back to top */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-col gap-5"
          >
            <h3 className="text-sm font-semibold tracking-wide uppercase text-foreground">
              Connect
            </h3>
            <div className="flex flex-wrap items-center gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg border border-border bg-secondary/40 text-muted-foreground transition-all duration-200 hover:border-primary/40 hover:text-primary hover:-translate-y-0.5"
                >
                  {social.isCustom ? (
                    <social.icon size={15} />
                  ) : (
                    <social.icon size={15} />
                  )}
                </a>
              ))}
            </div>

            {/* Back to top */}
            <motion.a
              href="#home"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className="mt-2 flex w-fit cursor-pointer items-center gap-2 rounded-lg border border-border bg-secondary/40 px-4 py-2 text-xs font-medium text-muted-foreground transition-all duration-200 hover:border-primary/40 hover:text-primary"
            >
              <FiArrowUp className="text-sm" />
              Back to top
            </motion.a>
          </motion.div>
        </div>

        {/* Divider + Copyright */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-10 flex flex-col items-center gap-3 border-t border-border pt-8 md:flex-row md:justify-between"
        >
          <p className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} Palchhin. All rights reserved.
          </p>
          <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
            Made by me with <FiHeart className="text-primary" />
          </p>
        </motion.div>
      </div>
    </footer>
  )
}
