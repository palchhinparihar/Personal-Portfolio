"use client"

import { motion, useInView } from "framer-motion"
import { useRef } from "react"
import { FiBriefcase, FiCalendar, FiMapPin } from "react-icons/fi"

const experiences = [
  {
    role: "Senior Frontend Developer",
    company: "TechNova Inc.",
    location: "San Francisco, CA",
    period: "Jan 2024 - Present",
    type: "Full-time",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam.",
    tags: ["React", "TypeScript", "Next.js", "Tailwind CSS"],
  },
  {
    role: "Full Stack Developer",
    company: "CloudBase Studios",
    location: "Remote",
    period: "Jun 2023 - Dec 2023",
    type: "Contract",
    description:
      "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident.",
    tags: ["Node.js", "MongoDB", "React", "AWS"],
  },
  {
    role: "Frontend Developer Intern",
    company: "PixelCraft Agency",
    location: "New York, NY",
    period: "Jan 2023 - May 2023",
    type: "Internship",
    description:
      "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam eaque ipsa quae.",
    tags: ["JavaScript", "Vue.js", "SCSS", "Figma"],
  },
]

export default function ExperienceSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" })

  return (
    <section
      ref={sectionRef}
      id="experience"
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
            Career
          </span>
          <h2 className="mt-4 text-2xl font-bold tracking-tight text-foreground sm:text-3xl md:text-5xl text-balance">
            Experience
          </h2>
          <div className="mx-auto mt-4 h-1 w-16 rounded-full bg-primary/60" />
        </motion.div>

        {/* Timeline layout */}
        <div className="relative">
          {/* Vertical timeline line */}
          <motion.div
            initial={{ scaleY: 0 }}
            animate={isInView ? { scaleY: 1 } : {}}
            transition={{ duration: 1.2, ease: "easeOut", delay: 0.3 }}
            className="absolute left-6 top-0 hidden h-full w-px origin-top bg-border md:left-1/2 md:block"
          />

          <div className="flex flex-col gap-12 md:gap-16">
            {experiences.map((exp, i) => {
              const isLeft = i % 2 === 0
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: isLeft ? -50 : 50 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{
                    duration: 0.7,
                    ease: "easeOut",
                    delay: 0.3 + i * 0.2,
                  }}
                  className={`relative flex flex-col md:flex-row md:items-start ${
                    isLeft ? "md:flex-row" : "md:flex-row-reverse"
                  }`}
                >
                  {/* Timeline dot */}
                  <div className="absolute left-6 top-8 z-10 hidden md:left-1/2 md:block">
                    <div className="relative -translate-x-1/2">
                      <div className="h-4 w-4 rounded-full border-2 border-primary bg-background shadow-[0_0_12px_rgba(168,85,247,0.5)]" />
                    </div>
                  </div>

                  {/* Card */}
                  <div
                    className={`group w-full md:w-[calc(50%-2.5rem)] ${
                      isLeft ? "md:pr-0" : "md:pl-0"
                    }`}
                  >
                    <div className="rounded-2xl border border-border bg-card/60 p-6 backdrop-blur-sm transition-all duration-300 hover:border-primary/30 hover:shadow-[0_0_30px_rgba(168,85,247,0.08)]">
                      {/* Type badge and period */}
                      <div className="mb-4 flex flex-wrap items-center gap-3">
                        <span className="rounded-full border border-accent/30 bg-accent/10 px-3 py-1 text-xs font-medium text-accent">
                          {exp.type}
                        </span>
                        <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                          <FiCalendar className="text-primary/60" />
                          {exp.period}
                        </span>
                      </div>

                      {/* Role & Company */}
                      <h3 className="text-lg font-semibold text-foreground sm:text-xl">
                        {exp.role}
                      </h3>
                      <div className="mt-1.5 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1.5">
                          <FiBriefcase className="text-primary/60" />
                          {exp.company}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <FiMapPin className="text-primary/60" />
                          {exp.location}
                        </span>
                      </div>

                      {/* Description */}
                      <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                        {exp.description}
                      </p>

                      {/* Tags */}
                      <div className="mt-4 flex flex-wrap gap-2">
                        {exp.tags.map((tag) => (
                          <span
                            key={tag}
                            className="cursor-pointer rounded-md border border-border bg-secondary/50 px-2.5 py-1 text-xs font-medium text-secondary-foreground transition-colors hover:border-primary/30"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
