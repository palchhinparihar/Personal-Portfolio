"use client"

import { motion, useInView } from "framer-motion"
import { useRef } from "react"
import { FiUser } from "react-icons/fi"

export default function AboutSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" })

  return (
    <section
      ref={sectionRef}
      id="about"
      className="relative z-10 px-6 py-24 md:py-32"
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
          <h2 className="mt-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl md:text-5xl text-balance">
            My Journey
          </h2>
          <div className="mx-auto mt-4 h-1 w-16 rounded-full bg-primary/60" />
        </motion.div>

        {/* Content grid */}
        <div className="grid items-center gap-12 md:grid-cols-2 md:gap-16">
          {/* Image placeholder - slides in from left */}
          <motion.div
            initial={{ opacity: 0, x: -60 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
          >
            <div className="group relative">
              {/* Decorative border offset */}
              <div className="absolute -inset-3 rounded-2xl border border-primary/20 transition-all duration-500 group-hover:border-primary/40 group-hover:-inset-4" />

              {/* Image container */}
              <div className="relative aspect-[4/5] overflow-hidden rounded-2xl border border-border bg-card">
                {/* Placeholder content */}
                <div className="flex h-full w-full flex-col items-center justify-center gap-4 bg-secondary/30">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full border border-border bg-secondary/60">
                    <FiUser className="text-2xl text-muted-foreground" />
                  </div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Your photo here
                  </p>
                </div>

                {/* Subtle gradient overlay */}
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background/40 via-transparent to-transparent" />
              </div>

              {/* Decorative accent dot */}
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
                className="absolute -bottom-2 -right-2 h-5 w-5 rounded-full bg-primary/80 shadow-[0_0_20px_rgba(74,124,255,0.4)]"
              />
            </div>
          </motion.div>

          {/* Description - slides in from right */}
          <motion.div
            initial={{ opacity: 0, x: 60 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.35 }}
            className="flex flex-col gap-6"
          >
            <h3 className="text-xl font-semibold text-foreground sm:text-2xl">
              A little bit about me
            </h3>

            <div className="space-y-4 text-base leading-relaxed text-muted-foreground">
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
                enim ad minim veniam, quis nostrud exercitation ullamco laboris
                nisi ut aliquip ex ea commodo consequat.
              </p>
              <p>
                Duis aute irure dolor in reprehenderit in voluptate velit esse
                cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat
                cupidatat non proident, sunt in culpa qui officia deserunt mollit
                anim id est laborum.
              </p>
              <p>
                Sed ut perspiciatis unde omnis iste natus error sit voluptatem
                accusantium doloremque laudantium, totam rem aperiam, eaque ipsa
                quae ab illo inventore veritatis et quasi architecto beatae vitae
                dicta sunt explicabo.
              </p>
            </div>

            {/* Quick stats - fade up with stagger */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, ease: "easeOut", delay: 0.6 }}
              className="mt-2 grid grid-cols-3 gap-4"
            >
              {[
                { value: "2+", label: "Years Exp." },
                { value: "10+", label: "Projects" },
                { value: "5+", label: "Tech Stack" },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="cursor-pointer rounded-xl border border-border bg-card/60 p-4 text-center backdrop-blur-sm transition-colors hover:border-primary/30"
                >
                  <p className="text-2xl font-bold text-primary">{stat.value}</p>
                  <p className="mt-1 text-xs font-medium text-muted-foreground">
                    {stat.label}
                  </p>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
