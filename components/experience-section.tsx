"use client"

import { motion, useInView } from "framer-motion"
import { useRef, useState } from "react"
import { FiBriefcase, FiCalendar, FiExternalLink, FiChevronDown } from "react-icons/fi"

const experiences = [
  {
    company: "Open Source",
    role: "Contributor & Maintainer",
    period: "Oct 2025 - Jan 2026",
    type: "Open Source",
    sections: [
      {
        title: "WordWizard Maintainer (Oct 2025 - Jan 2026)",
        points: [
          "Managed 40+ external contributions during Hacktoberfest 2025, reviewing PRs and mentoring contributors.",
          "Developed core features and maintained project stability and quality.",
          "Collaborated with global developers to enhance functionality and community engagement.",
        ],
        link: "https://github.com/palchhinparihar/WordWizard",
      },
      {
        title: "Hacktoberfest 2025 Contributor",
        points: [
          "Completed 12+ pull requests across multiple repositories, improving UI responsiveness and component logic.",
          "Worked across diverse codebases, adapting to different project standards and workflows.",
        ],
      },
      {
        title: "Code Social (WOCS) Contributor",
        points: [
          "Ranked among Top 15 contributors with 19 completed pull requests.",
          "Managed contributor workflows, reviewed PRs, and guided contributors to maintain project quality.",
        ],
      },
      {
        title: "Social of Winter Code (SWOC) Contributions (Jan 2026 - Present)",
        points: [
          "Actively contributing 6+ pull requests to SWOC repositories.",
          "Focusing on enhancing features and fixing bugs to improve overall projects' quality.",
        ],
      },
    ],
    tags: ["GitHub", "Git", "Open Source", "Code Review"],
  },
  {
    company: "Freelancing",
    role: "Full-Stack Developer (MERN)",
    period: "Jun 2025 - Present",
    type: "Freelance",
    sections: [
      {
        title: "Multi-Vendor E-commerce (Jun 2025 - Nov 2025)",
        points: [
          "Built a smaller-scale, Amazon-style platform for secure vendor onboarding, product uploads, and commission management.",
          "Developed customer-facing features for browsing, checkout, and live order tracking; designed to support 50+ vendors.",
        ],
        link: "#",
      },
      {
        title: "Client Portfolio Website (Jun 2025)",
        points: [
          "Designed and deployed a client portfolio website with modern UI/UX and interactive features.",
          "Integrated backend for testimonials section for enhanced engagement.",
        ],
        link: "https://sandeepsingh-portfolio.netlify.app",
      },
      {
        title: "GNG Decor (Jun 2025)",
        points: [
          "Developed a responsive home decor website for GNG Decor, improving booking conversions by 30% in the first week.",
          "Implemented blog and appointment modules, optimized UI for 90+ Lighthouse scores.",
        ],
        link: "https://gngdecor.in",
      },
    ],
    tags: ["React", "Node.js", "MongoDB", "Express.js"],
  },
  {
    company: "DSEU University",
    role: "University Researcher",
    period: "Feb 2025 - May 2025",
    type: "Research",
    sections: [
      {
        title: "Research Work",
        points: [
          "Built and evaluated Xception-based LSTM and GRU models for deepfake detection; GRU achieved 82% accuracy and 0.8966 F1-score.",
          "Preprocessed DFDC videos (10 frames per sample) under GPU constraints for efficient model training.",
          "Preparing manuscript for journal publication; used TensorFlow, Keras, OpenCV, and related tools.",
        ],
      },
    ],
    tags: ["Python", "TensorFlow", "Keras", "OpenCV"],
  },
  {
    company: "Aashray Foundation",
    role: "Volunteer",
    period: "Jun 2022 - Jun 2023",
    type: "Volunteer",
    sections: [
      {
        title: "Teaching & Awareness",
        points: [
          "Led and coordinated a teaching initiative for 15+ students, managing 10+ volunteers.",
          "Conducted a menstrual health awareness session for 12+ young women.",
          "Recognized as Volunteer of the Month (Dec 2022) for leadership and impact.",
        ],
      },
    ],
    tags: ["Leadership", "Teaching", "Community Service"],
  },
]

function ExperienceCard({
  exp,
  index,
  isInView,
  isLeft,
}: {
  exp: (typeof experiences)[0]
  index: number
  isInView: boolean
  isLeft: boolean
}) {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <motion.div
      key={index}
      initial={{ opacity: 0, x: isLeft ? -50 : 50 }}
      animate={isInView ? { opacity: 1, x: 0 } : {}}
      transition={{
        duration: 0.7,
        ease: "easeOut",
        delay: 0.3 + index * 0.2,
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
          </div>

          {/* Sections with expandable content */}
          <div className="mt-4">
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="flex w-full cursor-pointer items-center justify-between text-sm font-medium text-primary transition-colors hover:text-primary/80"
            >
              <span>
                {isExpanded ? "Hide details" : `View ${exp.sections.length} ${exp.sections.length === 1 ? "project" : "projects"}`}
              </span>
              <motion.div
                animate={{ rotate: isExpanded ? 180 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <FiChevronDown />
              </motion.div>
            </button>

            <motion.div
              initial={false}
              animate={{
                height: isExpanded ? "auto" : 0,
                opacity: isExpanded ? 1 : 0,
              }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="overflow-hidden"
            >
              <div className="mt-4 space-y-4">
                {exp.sections.map((section, sIdx) => (
                  <div
                    key={sIdx}
                    className="rounded-lg border border-border/50 bg-secondary/20 p-4"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="text-sm font-semibold text-foreground">
                        {section.title}
                      </h4>
                      {section.link && section.link !== "#" && (
                        <a
                          href={section.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-shrink-0 text-primary transition-colors hover:text-primary/80"
                          aria-label="View project"
                        >
                          <FiExternalLink size={14} />
                        </a>
                      )}
                    </div>
                    <ul className="mt-2 space-y-1.5">
                      {section.points.map((point, pIdx) => (
                        <li
                          key={pIdx}
                          className="flex items-start gap-2 text-xs leading-relaxed text-muted-foreground"
                        >
                          <span className="mt-1.5 h-1 w-1 flex-shrink-0 rounded-full bg-primary/60" />
                          {point}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

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
}

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
            {experiences.map((exp, i) => (
              <ExperienceCard
                key={i}
                exp={exp}
                index={i}
                isInView={isInView}
                isLeft={i % 2 === 0}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
