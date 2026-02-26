"use client"

import { motion, useInView } from "framer-motion"
import { useRef } from "react"
import {
  FiCode,
  FiLayout,
  FiServer,
  FiTool,
} from "react-icons/fi"

const skillCategories = [
  {
    title: "Languages",
    icon: FiCode,
    skills: [
      { name: "JavaScript", level: 90 },
      { name: "TypeScript", level: 85 },
      { name: "Python", level: 75 },
      { name: "Java", level: 65 },
      { name: "C++", level: 60 },
    ],
  },
  {
    title: "Frontend",
    icon: FiLayout,
    skills: [
      { name: "React", level: 92 },
      { name: "Next.js", level: 88 },
      { name: "Tailwind CSS", level: 90 },
      { name: "Vue.js", level: 70 },
      { name: "Framer Motion", level: 78 },
    ],
  },
  {
    title: "Backend",
    icon: FiServer,
    skills: [
      { name: "Node.js", level: 85 },
      { name: "Express.js", level: 80 },
      { name: "MongoDB", level: 75 },
      { name: "PostgreSQL", level: 72 },
      { name: "REST APIs", level: 88 },
    ],
  },
  {
    title: "Tools",
    icon: FiTool,
    skills: [
      { name: "Git & GitHub", level: 90 },
      { name: "Docker", level: 68 },
      { name: "Figma", level: 75 },
      { name: "VS Code", level: 95 },
      { name: "Vercel", level: 85 },
    ],
  },
]

export default function SkillsSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" })

  return (
    <section
      ref={sectionRef}
      id="skills"
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
            What I Know
          </span>
          <h2 className="mt-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl md:text-5xl text-balance">
            Skills
          </h2>
          <div className="mx-auto mt-4 h-1 w-16 rounded-full bg-primary/60" />
        </motion.div>

        {/* Skills grid - 2x2 */}
        <div className="grid gap-6 sm:grid-cols-2">
          {skillCategories.map((category, catIndex) => {
            const Icon = category.icon
            return (
              <motion.div
                key={category.title}
                initial={{ opacity: 0, y: 40 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{
                  duration: 0.6,
                  ease: "easeOut",
                  delay: 0.2 + catIndex * 0.15,
                }}
                className="group rounded-2xl border border-border bg-card/60 p-6 backdrop-blur-sm transition-all duration-300 hover:border-primary/30 hover:shadow-[0_0_30px_rgba(74,124,255,0.06)]"
              >
                {/* Category header */}
                <div className="mb-6 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-primary/20 bg-primary/10 transition-colors group-hover:border-primary/40">
                    <Icon className="text-lg text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground">
                    {category.title}
                  </h3>
                </div>

                {/* Skill bars */}
                <div className="flex flex-col gap-4">
                  {category.skills.map((skill, skillIndex) => (
                    <div key={skill.name}>
                      <div className="mb-1.5 flex items-center justify-between">
                        <span className="text-sm font-medium text-foreground/90">
                          {skill.name}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {skill.level}%
                        </span>
                      </div>
                      <div className="h-2 w-full overflow-hidden rounded-full bg-secondary/60">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={
                            isInView ? { width: `${skill.level}%` } : {}
                          }
                          transition={{
                            duration: 1,
                            ease: "easeOut",
                            delay: 0.5 + catIndex * 0.15 + skillIndex * 0.08,
                          }}
                          className="h-full rounded-full bg-gradient-to-r from-primary to-accent"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
