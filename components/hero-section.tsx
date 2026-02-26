"use client"

import { motion } from "framer-motion"
import { FiFileText, FiSend } from "react-icons/fi"
import { FaGithub, FaLinkedinIn, FaXTwitter } from "react-icons/fa6"
import { SiDevpost } from "react-icons/si"

function CodedexIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M4 4h4v4H4zm6 0h4v4h-4zm6 0h4v4h-4zM4 10h4v4H4zm6 0h4v4h-4zm6 0h4v4h-4zM4 16h4v4H4zm6 0h4v4h-4zm6 0h4v4h-4z" />
    </svg>
  )
}

function DevfolioIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M3 3h7.5l4.5 9-4.5 9H3l4.5-9L3 3zm10.5 0H21l-4.5 9 4.5 9h-7.5l4.5-9-4.5-9z" />
    </svg>
  )
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.3,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
}

const socialLinks = [
  { icon: FaGithub, href: "https://github.com", label: "GitHub" },
  { icon: FaLinkedinIn, href: "https://linkedin.com", label: "LinkedIn" },
  { icon: FaXTwitter, href: "https://x.com", label: "Twitter" },
  { icon: CodedexIcon, href: "https://codedex.io", label: "Codedex", isCustom: true },
  { icon: SiDevpost, href: "https://devpost.com", label: "Devpost" },
  { icon: DevfolioIcon, href: "https://devfolio.co", label: "Devfolio", isCustom: true },
]

export default function HeroSection() {
  return (
    <section
      id="home"
      className="relative flex min-h-screen items-center justify-center px-6"
    >
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 mx-auto max-w-3xl text-center"
      >
        {/* Greeting tag */}
        <motion.div variants={itemVariants} className="mb-6">
          <span className="inline-block rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-xs font-medium tracking-widest uppercase text-primary">
            Welcome to my portfolio
          </span>
        </motion.div>

        {/* Main heading */}
        <motion.h1
          variants={itemVariants}
          className="mb-4 text-4xl font-bold leading-tight tracking-tight text-foreground sm:text-5xl md:text-6xl lg:text-7xl text-balance"
        >
          Hi, <span className="text-primary">Palchhin</span> here
          <span className="text-accent">~</span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          variants={itemVariants}
          className="mx-auto mb-10 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg"
        >
          A passionate developer crafting beautiful, performant, and
          accessible web experiences. Turning ideas into reality, one pixel at
          a time.
        </motion.p>

        {/* CTA buttons */}
        <motion.div
          variants={itemVariants}
          className="flex flex-wrap items-center justify-center gap-4"
        >
          <motion.a
            href="/resume.pdf"
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.97 }}
            className="group flex cursor-pointer items-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-shadow hover:shadow-[0_0_35px_rgba(168,85,247,0.45)]"
          >
            <FiFileText className="text-lg transition-transform group-hover:-rotate-6" />
            View Resume
          </motion.a>

          <motion.a
            href="#contact"
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.97 }}
            className="group flex cursor-pointer items-center gap-2 rounded-lg border border-border bg-secondary/60 px-6 py-3 text-sm font-semibold text-secondary-foreground backdrop-blur-sm transition-all hover:border-primary/50 hover:shadow-[0_0_35px_rgba(168,85,247,0.2)]"
          >
            <FiSend className="text-lg transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            Connect
          </motion.a>
        </motion.div>

        {/* Social links */}
        <motion.div
          variants={itemVariants}
          className="mt-12 flex items-center justify-center gap-4"
        >
          {socialLinks.map((social) => (
            <motion.a
              key={social.label}
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={social.label}
              whileHover={{ scale: 1.2, y: -3 }}
              whileTap={{ scale: 0.9 }}
              className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-border bg-secondary/40 text-muted-foreground transition-all hover:border-primary/50 hover:text-foreground hover:shadow-[0_0_20px_rgba(168,85,247,0.3)]"
            >
              {social.isCustom ? (
                <social.icon size={18} />
              ) : (
                <social.icon size={18} />
              )}
            </motion.a>
          ))}
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2, duration: 1 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 md:bottom-12"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
            className="flex flex-col items-center gap-2"
          >
            <span className="text-xs font-medium tracking-widest uppercase text-muted-foreground">
              Scroll
            </span>
            <div className="flex h-8 w-5 items-start justify-center rounded-full border-2 border-muted-foreground/40 p-1">
              <motion.div
                animate={{ y: [0, 8, 0] }}
                transition={{
                  repeat: Infinity,
                  duration: 1.8,
                  ease: "easeInOut",
                }}
                className="h-1.5 w-1.5 rounded-full bg-primary"
              />
            </div>
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  )
}
