"use client"

import { motion, useInView, AnimatePresence } from "framer-motion"
import { useRef, useState } from "react"
import {
  SiJavascript,
  SiTypescript,
  SiPython,
  SiCplusplus,
  SiReact,
  SiNextdotjs,
  SiTailwindcss,
  SiVuedotjs,
  SiFramer,
  SiNodedotjs,
  SiExpress,
  SiMongodb,
  SiPostgresql,
  SiGit,
  SiDocker,
  SiFigma,
  SiVisualstudiocode,
  SiVercel,
  SiHtml5,
  SiCss3,
} from "react-icons/si"
import { FiCode, FiLayout, FiServer, FiTool } from "react-icons/fi"

const categories = [
  {
    key: "languages",
    label: "Languages",
    icon: FiCode,
    skills: [
      { name: "JavaScript", icon: SiJavascript, color: "#F7DF1E" },
      { name: "TypeScript", icon: SiTypescript, color: "#3178C6" },
      { name: "Python", icon: SiPython, color: "#3776AB" },
      { name: "C++", icon: SiCplusplus, color: "#00599C" },
      { name: "HTML5", icon: SiHtml5, color: "#E34F26" },
      { name: "CSS3", icon: SiCss3, color: "#1572B6" },
    ],
  },
  {
    key: "frontend",
    label: "Frontend",
    icon: FiLayout,
    skills: [
      { name: "React", icon: SiReact, color: "#61DAFB" },
      { name: "Next.js", icon: SiNextdotjs, color: "#FFFFFF" },
      { name: "Tailwind CSS", icon: SiTailwindcss, color: "#06B6D4" },
      { name: "Vue.js", icon: SiVuedotjs, color: "#4FC08D" },
      { name: "Framer Motion", icon: SiFramer, color: "#BB4BFF" },
    ],
  },
  {
    key: "backend",
    label: "Backend",
    icon: FiServer,
    skills: [
      { name: "Node.js", icon: SiNodedotjs, color: "#339933" },
      { name: "Express.js", icon: SiExpress, color: "#FFFFFF" },
      { name: "MongoDB", icon: SiMongodb, color: "#47A248" },
      { name: "PostgreSQL", icon: SiPostgresql, color: "#4169E1" },
    ],
  },
  {
    key: "tools",
    label: "Tools",
    icon: FiTool,
    skills: [
      { name: "Git", icon: SiGit, color: "#F05032" },
      { name: "Docker", icon: SiDocker, color: "#2496ED" },
      { name: "Figma", icon: SiFigma, color: "#F24E1E" },
      { name: "VS Code", icon: SiVisualstudiocode, color: "#007ACC" },
      { name: "Vercel", icon: SiVercel, color: "#FFFFFF" },
    ],
  },
]

export default function SkillsSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" })
  const [activeTab, setActiveTab] = useState("languages")

  const activeCategory = categories.find((c) => c.key === activeTab)

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

        {/* Tab selector */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-12 flex flex-wrap items-center justify-center gap-3"
        >
          {categories.map((cat) => {
            const Icon = cat.icon
            const isActive = activeTab === cat.key
            return (
              <button
                key={cat.key}
                onClick={() => setActiveTab(cat.key)}
                className={`relative flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium transition-all duration-300 ${
                  isActive
                    ? "text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground bg-secondary/40 hover:bg-secondary/70"
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeSkillTab"
                    className="absolute inset-0 rounded-full bg-primary"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
                <span className="relative z-10 flex items-center gap-2">
                  <Icon className="text-base" />
                  {cat.label}
                </span>
              </button>
            )
          })}
        </motion.div>

        {/* Skills display */}
        <AnimatePresence mode="wait">
          {activeCategory && (
            <motion.div
              key={activeCategory.key}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
              className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5"
            >
              {activeCategory.skills.map((skill, i) => {
                const SkillIcon = skill.icon
                return (
                  <motion.div
                    key={skill.name}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{
                      duration: 0.35,
                      delay: i * 0.06,
                      ease: "easeOut",
                    }}
                    className="group flex flex-col items-center gap-3 rounded-2xl border border-border bg-card/60 p-6 backdrop-blur-sm transition-all duration-300 hover:border-primary/30 hover:-translate-y-1 hover:shadow-[0_0_30px_rgba(74,124,255,0.08)]"
                  >
                    <div
                      className="flex h-14 w-14 items-center justify-center rounded-xl border border-border bg-secondary/40 transition-all duration-300 group-hover:border-transparent group-hover:shadow-[0_0_20px_var(--glow)]"
                      style={
                        { "--glow": `${skill.color}33` } as React.CSSProperties
                      }
                    >
                      <SkillIcon
                        className="text-2xl transition-colors duration-300"
                        style={{ color: skill.color }}
                      />
                    </div>
                    <span className="text-center text-sm font-medium text-foreground/80 transition-colors group-hover:text-foreground">
                      {skill.name}
                    </span>
                  </motion.div>
                )
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  )
}
