"use client"

import { motion, useInView, AnimatePresence, useScroll, useTransform } from "framer-motion"
import { useRef, useState } from "react"
import {
  SiJavascript,
  SiPython,
  SiCplusplus,
  SiC,
  SiReact,
  SiTailwindcss,
  SiBootstrap,
  SiNodedotjs,
  SiExpress,
  SiMongodb,
  SiGit,
  SiGithub,
  SiNetlify,
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
      { name: "C", icon: SiC, color: "#A8B9CC" },
      { name: "C++", icon: SiCplusplus, color: "#00599C" },
      { name: "Python", icon: SiPython, color: "#3776AB" },
      { name: "JavaScript", icon: SiJavascript, color: "#F7DF1E" },
    ],
  },
  {
    key: "frontend",
    label: "Frontend",
    icon: FiLayout,
    skills: [
      { name: "HTML5", icon: SiHtml5, color: "#E34F26" },
      { name: "CSS3", icon: SiCss3, color: "#1572B6" },
      { name: "React", icon: SiReact, color: "#61DAFB" },
      { name: "Tailwind CSS", icon: SiTailwindcss, color: "#06B6D4" },
      { name: "Bootstrap", icon: SiBootstrap, color: "#7952B3" },
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
    ],
  },
  {
    key: "tools",
    label: "Tools",
    icon: FiTool,
    skills: [
      { name: "Git", icon: SiGit, color: "#F05032" },
      { name: "GitHub", icon: SiGithub, color: "#FFFFFF" },
      { name: "Netlify", icon: SiNetlify, color: "#00C7B7" },
    ],
  },
]

export default function SkillsSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" })
  const [activeTab, setActiveTab] = useState("languages")

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  })
  
  const headingY = useTransform(scrollYProgress, [0, 1], [30, -30])
  const gridY = useTransform(scrollYProgress, [0, 1], [50, -50])

  const activeCategory = categories.find((c) => c.key === activeTab)

  return (
    <section
      ref={sectionRef}
      id="skills"
      className="relative z-10 px-4 py-16 sm:px-6 md:py-32"
    >
      <div className="mx-auto max-w-5xl">
        {/* Section heading */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: "easeOut" }}
          style={{ y: headingY }}
          className="mb-16 text-center"
        >
          <span className="mb-3 inline-block rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-xs font-medium tracking-widest uppercase text-primary">
            What I Know
          </span>
          <h2 className="mt-4 text-2xl font-bold tracking-tight text-foreground sm:text-3xl md:text-5xl text-balance">
            Skills
          </h2>
          <div className="mx-auto mt-4 h-1 w-16 rounded-full bg-primary/60" />
        </motion.div>

        {/* Tab selector */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-8 flex flex-wrap items-center justify-center gap-2 sm:mb-12 sm:gap-3"
        >
          {categories.map((cat) => {
            const Icon = cat.icon
            const isActive = activeTab === cat.key
            return (
              <button
                key={cat.key}
                onClick={() => setActiveTab(cat.key)}
                className={`relative flex cursor-pointer items-center gap-1.5 rounded-full px-3.5 py-2 text-xs font-medium transition-all duration-300 sm:gap-2 sm:px-5 sm:py-2.5 sm:text-sm ${
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
        <motion.div style={{ y: gridY }}>
          <AnimatePresence mode="wait">
            {activeCategory && (
              <motion.div
                key={activeCategory.key}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.35, ease: "easeOut" }}
                className="flex flex-wrap justify-center gap-3 sm:gap-4"
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
                    className="group flex w-[calc(50%-0.375rem)] cursor-pointer flex-col items-center gap-2 rounded-2xl border border-border bg-card/60 p-4 backdrop-blur-sm transition-all duration-300 hover:border-primary/30 hover:-translate-y-1 hover:shadow-[0_0_30px_rgba(147,51,234,0.08)] sm:w-auto sm:min-w-[140px] sm:gap-3 sm:p-6"
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
        </motion.div>
      </div>
    </section>
  )
}
