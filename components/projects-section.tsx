"use client"

import { motion, useInView } from "framer-motion"
import { useRef, useState } from "react"
import { FiExternalLink, FiGithub, FiImage } from "react-icons/fi"

const projects = [
  {
    title: "Project Alpha",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore.",
    tags: ["React", "Node.js", "MongoDB"],
    github: "#",
    live: "#",
    span: "col-span-1 sm:col-span-2 row-span-2",
    aspect: "aspect-[4/3]",
  },
  {
    title: "Project Beta",
    description:
      "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat.",
    tags: ["Next.js", "Tailwind", "Prisma"],
    github: "#",
    live: "#",
    span: "col-span-1 row-span-1",
    aspect: "aspect-square",
  },
  {
    title: "Project Gamma",
    description:
      "Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit.",
    tags: ["TypeScript", "Firebase", "Stripe"],
    github: "#",
    live: "#",
    span: "col-span-1 row-span-1",
    aspect: "aspect-square",
  },
  {
    title: "Project Delta",
    description:
      "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque.",
    tags: ["Vue.js", "Express", "PostgreSQL"],
    github: "#",
    live: "#",
    span: "col-span-1 row-span-1",
    aspect: "aspect-square",
  },
  {
    title: "Project Epsilon",
    description:
      "Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit.",
    tags: ["React Native", "GraphQL", "AWS"],
    github: "#",
    live: "#",
    span: "col-span-1 sm:col-span-2 row-span-1",
    aspect: "aspect-[2/1]",
  },
  {
    title: "Project Zeta",
    description:
      "Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis.",
    tags: ["Python", "Flask", "Docker"],
    github: "#",
    live: "#",
    span: "col-span-1 row-span-1",
    aspect: "aspect-square",
  },
]

function ProjectCard({
  project,
  index,
  isInView,
}: {
  project: (typeof projects)[0]
  index: number
  isInView: boolean
}) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{
        duration: 0.6,
        ease: "easeOut",
        delay: 0.2 + index * 0.1,
      }}
      className={`${project.span}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="group relative h-full overflow-hidden rounded-2xl border border-border bg-card/60 backdrop-blur-sm transition-all duration-300 hover:border-primary/30 hover:shadow-[0_0_30px_rgba(74,124,255,0.08)]">
        {/* Image placeholder */}
        <div
          className={`relative w-full overflow-hidden ${project.aspect}`}
        >
          <div className="flex h-full w-full items-center justify-center bg-secondary/30">
            <div className="flex flex-col items-center gap-2">
              <FiImage className="text-3xl text-muted-foreground/40" />
              <span className="text-xs text-muted-foreground/40">
                Project Image
              </span>
            </div>
          </div>

          {/* Hover overlay */}
          <motion.div
            initial={false}
            animate={{
              opacity: isHovered ? 1 : 0,
            }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-background via-background/80 to-transparent p-5"
          >
            <h3 className="text-lg font-semibold text-foreground sm:text-xl">
              {project.title}
            </h3>
            <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
              {project.description}
            </p>

            {/* Tags */}
            <div className="mt-3 flex flex-wrap gap-1.5">
              {project.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-md border border-border bg-secondary/60 px-2 py-0.5 text-xs font-medium text-secondary-foreground"
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* Links */}
            <div className="mt-4 flex gap-3">
              <a
                href={project.github}
                className="flex items-center gap-1.5 rounded-lg border border-border bg-secondary/60 px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:border-primary/40 hover:text-primary"
                aria-label={`View ${project.title} on GitHub`}
              >
                <FiGithub />
                Code
              </a>
              <a
                href={project.live}
                className="flex items-center gap-1.5 rounded-lg border border-primary/40 bg-primary/10 px-3 py-1.5 text-xs font-medium text-primary transition-colors hover:bg-primary/20"
                aria-label={`View ${project.title} live demo`}
              >
                <FiExternalLink />
                Live
              </a>
            </div>
          </motion.div>
        </div>

        {/* Title bar always visible at bottom */}
        <motion.div
          initial={false}
          animate={{ opacity: isHovered ? 0 : 1 }}
          transition={{ duration: 0.2 }}
          className="absolute bottom-0 left-0 right-0 border-t border-border bg-card/80 px-5 py-3 backdrop-blur-sm"
        >
          <h3 className="text-sm font-semibold text-foreground">
            {project.title}
          </h3>
          <div className="mt-1 flex gap-1.5">
            {project.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="text-xs text-muted-foreground"
              >
                {tag}
                {project.tags.indexOf(tag) < Math.min(project.tags.length, 3) - 1
                  ? " /"
                  : ""}
              </span>
            ))}
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}

export default function ProjectsSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" })

  return (
    <section
      ref={sectionRef}
      id="projects"
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
            Portfolio
          </span>
          <h2 className="mt-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl md:text-5xl text-balance">
            Projects
          </h2>
          <div className="mx-auto mt-4 h-1 w-16 rounded-full bg-primary/60" />
        </motion.div>

        {/* Masonry-style grid gallery */}
        <div className="grid auto-rows-auto grid-cols-1 gap-4 sm:grid-cols-3">
          {projects.map((project, i) => (
            <ProjectCard
              key={project.title}
              project={project}
              index={i}
              isInView={isInView}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
