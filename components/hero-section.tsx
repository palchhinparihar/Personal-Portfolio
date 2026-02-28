"use client"

import { motion, useScroll, useTransform } from "framer-motion"
import { useRef } from "react"
import { FiFileText, FiSend, FiMonitor } from "react-icons/fi"
import { FaGithub, FaLinkedinIn, FaXTwitter } from "react-icons/fa6"
import { SiDevpost } from "react-icons/si"
import TypingAnimation from "./typing-animation"

function CodedexIcon({ size = 18 }: { size?: number }) {
  return <FiMonitor size={size} />
}

function DevfolioIcon({ size = 18 }: { size?: number }) {
  return (
    <span style={{ fontSize: size, fontWeight: 700, lineHeight: 1 }} aria-hidden="true">
      D
    </span>
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
  { icon: FaGithub, href: "https://github.com/palchhinparihar", label: "GitHub" },
  { icon: FaLinkedinIn, href: "https://www.linkedin.com/in/palchhinparihar", label: "LinkedIn" },
  { icon: FaXTwitter, href: "https://x.com/palchhinx", label: "Twitter" },
  { icon: CodedexIcon, href: "https://www.codedex.io/@palchhin", label: "Codedex", isCustom: true },
  { icon: SiDevpost, href: "https://devpost.com/palchhinparihar", label: "Devpost" },
  { icon: DevfolioIcon, href: "https://devfolio.co/@palchhinparihar", label: "Devfolio", isCustom: true },
]

export default function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  })

  const y = useTransform(scrollYProgress, [0, 1], [0, 150])
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.95])

  return (
    <section
      ref={sectionRef}
      id="home"
      className="relative flex min-h-screen items-center justify-center px-4 sm:px-6"
    >
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        style={{ y, opacity, scale }}
        className="relative z-10 mx-auto max-w-3xl text-center"
      >
        {/* Greeting tag */}
        <motion.div variants={itemVariants} className="mb-6">
          <span className="inline-block rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-xs font-medium tracking-widest uppercase text-primary">
            Welcome to my portfolio
          </span>
        </motion.div>

        {/* Main heading with typing animation */}
        <motion.h1
          variants={itemVariants}
          className="mb-4 font-serif font-medium italic leading-tight tracking-wide text-foreground sm:text-4xl md:text-5xl lg:text-7xl"
        >
          <TypingAnimation 
            text="Hi, Palchhin here~" 
            typingSpeed={120}
            startDelay={800}
          />
        </motion.h1>

        {/* Tagline */}
        <motion.p
          variants={itemVariants}
          className="mx-auto mb-10 max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-base"
        >
          An INTJ-A tech girlie who loves building little worlds on a screen... yup, that's me. 🍃
        </motion.p>

        {/* CTA buttons */}
        <motion.div
          variants={itemVariants}
          className="flex flex-wrap items-center justify-center gap-4"
        >
          <motion.a
            href="https://drive.google.com/file/d/13zlOvXdMIaUSIJcOi_QFgHzyq9HV9IDt/view?usp=drive_link"
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.97 }}
            className="group flex cursor-pointer items-center justify-center gap-2 rounded-lg bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition-shadow hover:shadow-[0_0_35px_rgba(168,85,247,0.45)] sm:px-6"
          >
            <FiFileText className="text-lg transition-transform group-hover:-rotate-6" />
            View Resume
          </motion.a>

          <motion.a
            href="#contact"
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.97 }}
            className="group flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-border bg-secondary/60 px-5 py-3 text-sm font-semibold text-secondary-foreground backdrop-blur-sm transition-all hover:border-primary/50 hover:shadow-[0_0_35px_rgba(168,85,247,0.2)] sm:px-6"
          >
            <FiSend className="text-lg transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            Connect
          </motion.a>
        </motion.div>

        {/* Social links */}
        <motion.div
          variants={itemVariants}
          className="mt-10 flex flex-wrap items-center justify-center gap-3 sm:mt-12 sm:gap-4"
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
          className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 sm:block md:bottom-12"
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
