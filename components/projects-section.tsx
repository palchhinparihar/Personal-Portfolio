"use client"

import { motion, useInView, useScroll, useTransform } from "framer-motion"
import { useRef, useState } from "react"
import { FiExternalLink, FiGithub, FiImage } from "react-icons/fi"

const projects = [
  {
    title: "DeepShield",
    description:
      "An AI-powered cybersecurity tool that detects deepfake videos in real-time using machine learning algorithms.",
    tags: ["Python", "TensorFlow", "React.js", "Tailwind CSS"],
    github: "https://github.com/palchhinparihar/DeepShield",
    live: "https://player.cloudinary.com/embed/?cloud_name=deffdyr0p&public_id=DeepShieldDemoVideo_ilyil4&profile=cld-default",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/deep-shield-dADU6aynOpFYiYLXX5RdwyZOxZ6PnK.png",
    span: "col-span-1 sm:col-span-2 row-span-2",
    aspect: "aspect-10/9",
  },
  {
    title: "Discord Automation Bot",
    description:
      "A Python-based Discord bot that listens for custom commands and responds with random content (e.g., memes, jokes, text) using public APIs.",
    tags: ["Python", "Discord.py", "REST APIs"],
    github: "https://github.com/palchhinparihar/discord-bot",
    live: "",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/discord-bot-Od8N2JpuKaECouLr1tbWT13tq8WKDg.png",
    span: "col-span-1 row-span-1",
    aspect: "aspect-square",
  },
  {
    title: "Personal Password Manager",
    description:
      "A Python-based CLI password manager that securely stores your credentials using Fernet encryption.",
    tags: ["Python", "Cryptography", "Fernet Encryption"],
    github: "https://github.com/palchhinparihar/personal-password-manager",
    live: "https://youtu.be/zoZQaFsP-bM?si=68YSB3us6WLXFDRj",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/ppm-5B23FoRZvhiy1pietU53QCqP08KJHZ.png",
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
      <div className="group relative h-full overflow-hidden rounded-2xl border border-border bg-card/60 backdrop-blur-sm transition-all duration-300 hover:border-primary/30 hover:shadow-[0_0_30px_rgba(168,85,247,0.1)]">
        {/* Project Image */}
        <div
          className={`relative w-full overflow-hidden ${project.aspect}`}
        >
          {project.image ? (
            <img
              src={project.image}
              alt={project.title}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-secondary/30">
              <div className="flex flex-col items-center gap-2">
                <FiImage className="text-3xl text-muted-foreground/40" />
                <span className="text-xs text-muted-foreground/40">
                  Project Image
                </span>
              </div>
            </div>
          )}

          {/* Hover overlay */}
          <motion.div
            initial={false}
            animate={{
              opacity: isHovered ? 1 : 0,
            }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 z-40 flex flex-col justify-end bg-gradient-to-t from-background via-background/80 to-transparent p-5"
            style={{ pointerEvents: isHovered ? "auto" : "none" }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
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
              {project.github && (
                <a
                  href={project.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex cursor-pointer items-center gap-1.5 rounded-lg border border-border bg-secondary/60 px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:border-primary/40 hover:text-primary hover:bg-secondary/80"
                  aria-label={`View ${project.title} on GitHub`}
                >
                  <FiGithub />
                  Code
                </a>
              )}
              {project.live && (
                <a
                  href={project.live}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex cursor-pointer items-center gap-1.5 rounded-lg border border-primary/40 bg-primary/10 px-3 py-1.5 text-xs font-medium text-primary transition-colors hover:bg-primary/20 hover:border-primary/60"
                  aria-label={`View ${project.title} live demo`}
                >
                  <FiExternalLink />
                  Live
                </a>
              )}
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
  
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  })
  
  const headingY = useTransform(scrollYProgress, [0, 1], [40, -40])
  const gridY = useTransform(scrollYProgress, [0, 1], [60, -60])

  return (
    <section
      ref={sectionRef}
      id="projects"
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
            Portfolio
          </span>
          <h2 className="mt-4 text-2xl font-bold tracking-tight text-foreground sm:text-3xl md:text-5xl text-balance">
            Projects
          </h2>
          <div className="mx-auto mt-4 h-1 w-16 rounded-full bg-primary/60" />
        </motion.div>

        {/* Masonry-style grid gallery */}
        <motion.div style={{ y: gridY }} className="grid auto-rows-auto grid-cols-1 gap-4 sm:grid-cols-3">
          {projects.map((project, i) => (
            <ProjectCard
              key={project.title}
              project={project}
              index={i}
              isInView={isInView}
            />
          ))}
        </motion.div>
      </div>
    </section>
  )
}
