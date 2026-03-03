"use client"

import { motion, useInView, useScroll, useTransform } from "framer-motion"
import { useRef, useEffect, useState } from "react"

function StatItem({
  value,
  suffix,
  label,
  isInView,
}: {
  value: number
  suffix?: string
  label: string
  isInView: boolean
}) {
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    if (!isInView) return
    let raf = 0
    const duration = 800
    const start = performance.now()

    const step = (now: number) => {
      const t = Math.min((now - start) / duration, 1)
      setCurrent(Math.floor(t * value))
      if (t < 1) raf = requestAnimationFrame(step)
      else setCurrent(value)
    }

    raf = requestAnimationFrame(step)
    return () => cancelAnimationFrame(raf)
  }, [isInView, value])

  return (
    <div className="cursor-pointer rounded-xl border border-border bg-card/60 p-3 text-center backdrop-blur-sm transition-colors hover:border-primary/30 sm:p-4">
      <p className="text-2xl font-bold text-primary">{current}{suffix}</p>
      <p className="mt-1 text-xs font-medium text-muted-foreground">{label}</p>
    </div>
  )
}
import Image from "next/image"

export default function AboutSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" })

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  })

  const imageY = useTransform(scrollYProgress, [0, 1], [60, -60])
  const textY = useTransform(scrollYProgress, [0, 1], [40, -40])

  return (
    <section
      ref={sectionRef}
      id="about"
      className="relative z-10 px-4 py-16 sm:px-6 md:py-32"
    >
      <div className="mx-auto max-w-5xl">
        {/* Section heading */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="mb-16 text-center"
        >
          <span className="mb-3 inline-block rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-xs font-medium tracking-widest uppercase text-primary">
            About Me
          </span>
          <h2 className="mt-4 text-2xl font-bold tracking-tight text-foreground sm:text-3xl md:text-5xl text-balance">
            My Journey
          </h2>
          <div className="mx-auto mt-4 h-1 w-16 rounded-full bg-primary/60" />
        </motion.div>

        {/* Content grid */}
        <div className="grid items-center gap-8 sm:gap-12 lg:grid-cols-2 md:gap-16">
          {/* Image placeholder - slides in from left with parallax */}
          <motion.div
            initial={{ opacity: 0, x: -60 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
            style={{ y: imageY }}
            className="md:w-100 mx-auto lg:w-full"
          >
            <div className="group relative">
              {/* Decorative border offset */}
              <div className="absolute -inset-3 rounded-2xl border border-primary/20 transition-all duration-500 group-hover:border-primary/40 group-hover:-inset-4" />

              {/* Image container */}
              <div className="relative aspect-[4/5] overflow-hidden rounded-2xl border border-border bg-card">
                <Image
                  src="/profile.jpeg"
                  alt="Profile"
                  fill
                  className="object-cover"
                  priority
                />

                {/* Subtle gradient overlay */}
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background/40 via-transparent to-transparent" />
              </div>

              {/* Decorative accent dot */}
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
                className="absolute -bottom-2 -right-2 h-5 w-5 rounded-full bg-primary/80 shadow-[0_0_20px_rgba(168,85,247,0.5)]"
              />
            </div>
          </motion.div>

          {/* Description - slides in from right with parallax */}
          <motion.div
            initial={{ opacity: 0, x: 60 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.35 }}
            style={{ y: textY }}
            className="flex flex-col gap-6"
          >
            <h3 className="text-xl font-semibold text-foreground sm:text-2xl">
              A little bit about me
            </h3>

            <div className="space-y-4 text-base leading-relaxed text-muted-foreground">
              <p>
                I'm a full-stack developer who enjoys building clean, user-friendly
                web applications. I primarily work with the MERN stack and love
                turning ideas into practical, efficient solutions. I've gained
                experience through freelance projects, academic work, and
                contributions to open-source communities.
              </p>
              <p>
                I have recently completed my Bachelor of Computer Applications,
                with a 9.63/10 CGPA, at DSEU University, where I also contributed
                to AI research in deepfake detection using deep learning techniques.
              </p>
              <p>
                Beyond coding, I enjoy reading, gaming, traveling, networking, and
                journaling, while always exploring new ideas and technologies.
              </p>
            </div>

            {/* Quick stats - fade up with stagger */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, ease: "easeOut", delay: 0.6 }}
              className="mt-2 grid grid-cols-2 gap-2 sm:gap-4"
            >
              {[
                { value: 1, suffix: "+", label: "Years Experience" },
                { value: 7, suffix: "+", label: "Projects" },
                { value: 2, suffix: "+", label: "Freelance Clients" },
                { value: 4, suffix: "+", label: "Open Source Programs" },
              ].map((stat) => (
                <StatItem
                  key={stat.label}
                  value={stat.value}
                  suffix={stat.suffix}
                  label={stat.label}
                  isInView={isInView}
                />
              ))}
            </motion.div>
          </motion.div>
        </div>

        {/* GitHub contributions chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.85 }}
          className="mt-6"
        >
          <a
            href="https://github.com/palchhinparihar"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full lg:w-[80%] mx-auto block rounded-xl border border-border p-4 text-center hover:border-primary/30"
            aria-label="View palchhinparihar's GitHub profile"
          >
            <img
              src="https://ghchart.rshah.org/palchhinparihar"
              alt="GitHub contributions chart for palchhinparihar"
              loading="lazy"
              className="mx-auto max-w-full h-15 md:h-30"
              style={{ filter: 'invert(1) hue-rotate(180deg) saturate(0.9)' }}
              onError={(e) => {
                const target = e.currentTarget as HTMLImageElement
                target.onerror = null
                target.src = '/profile.jpeg'
                target.style.filter = 'none'
              }}
            />
            <p className="mt-2 text-xs font-medium text-muted-foreground">
              A glance at my GitHub contributions
            </p>
          </a>
        </motion.div>
      </div>
    </section>
  )
}
