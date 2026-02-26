"use client"

import { motion, useInView, useScroll, useTransform } from "framer-motion"
import { useRef } from "react"
import { FiUser } from "react-icons/fi"

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
        <div className="grid items-center gap-8 sm:gap-12 md:grid-cols-2 md:gap-16">
          {/* Image placeholder - slides in from left with parallax */}
          <motion.div
            initial={{ opacity: 0, x: -60 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
            style={{ y: imageY }}
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
              className="mt-2 grid grid-cols-3 gap-2 sm:gap-4"
            >
              {[
                { value: "2+", label: "Years Exp." },
                { value: "10+", label: "Projects" },
                { value: "5+", label: "Tech Stack" },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="cursor-pointer rounded-xl border border-border bg-card/60 p-3 text-center backdrop-blur-sm transition-colors hover:border-primary/30 sm:p-4"
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
