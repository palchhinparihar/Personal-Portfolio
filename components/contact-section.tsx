"use client"

import { motion, useInView, useScroll, useTransform } from "framer-motion"
import { useRef, useState } from "react"
import {
  FiMail,
  FiMapPin,
  FiSend,
  FiUser,
  FiMessageSquare,
  FiMonitor,
} from "react-icons/fi"
import { FaGithub, FaLinkedinIn, FaXTwitter } from "react-icons/fa6"
import { SiDevpost } from "react-icons/si"

function CodedexIcon({ size = 18 }: { size?: number }) {
  return <FiMonitor size={size} />
}

function DevfolioIcon({ size = 18 }: { size?: number }) {
  return (
    <span style={{ fontSize: size, fontWeight: 700, lineHeight: 1 }} aria-hidden="true">
      D
    </span>
  )
}

const contactInfo = [
  {
    icon: FiMail,
    label: "Email",
    value: "palchhinparihar@gmail.com",
    href: "mailto:palchhinparihar@gmail.com",
  },
  {
    icon: FiMapPin,
    label: "Location",
    value: "India",
    href: null,
  },
]

const socials = [
  { icon: FaGithub, label: "GitHub", href: "https://github.com/palchhinparihar" },
  { icon: FaLinkedinIn, label: "LinkedIn", href: "https://www.linkedin.com/in/palchhinparihar" },
  { icon: FaXTwitter, label: "Twitter", href: "https://x.com/palchhinx" },
  { icon: CodedexIcon, label: "Codedex", href: "https://www.codedex.io/@palchhin", isCustom: true },
  { icon: SiDevpost, label: "Devpost", href: "https://devpost.com/palchhinparihar" },
  { icon: DevfolioIcon, label: "Devfolio", href: "https://devfolio.co/@palchhinparihar", isCustom: true },
]

export default function ContactSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" })
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    message: "",
  })
  
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  })
  
  const headingY = useTransform(scrollYProgress, [0, 1], [30, -30])
  const leftY = useTransform(scrollYProgress, [0, 1], [50, -50])
  const rightY = useTransform(scrollYProgress, [0, 1], [70, -70])

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    setFormState((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    // placeholder -- wire up your email service here
  }

  return (
    <section
      ref={sectionRef}
      id="contact"
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
            Get In Touch
          </span>
          <h2 className="mt-4 text-2xl font-bold tracking-tight text-foreground sm:text-3xl md:text-5xl text-balance">
            Contact
          </h2>
          <div className="mx-auto mt-4 h-1 w-16 rounded-full bg-primary/60" />
          <p className="mx-auto mt-5 max-w-lg text-base leading-relaxed text-muted-foreground">
            Have a project in mind or just want to say hi? Drop me a message and
            I{"'"}ll get back to you as soon as possible.
          </p>
        </motion.div>

        <div className="grid items-start gap-8 sm:gap-10 lg:grid-cols-5">
          {/* Left -- info & socials */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
            style={{ y: leftY }}
            className="flex flex-col gap-8 lg:col-span-2"
          >
            {/* Contact info cards */}
            <div className="flex flex-col gap-4">
              {contactInfo.map((item) => {
                const Icon = item.icon
                const Tag = item.href ? "a" : "div"
                const linkProps = item.href
                  ? { href: item.href, target: "_blank", rel: "noopener noreferrer" }
                  : {}
                return (
                  <Tag
                    key={item.label}
                    {...linkProps}
                    className={`group flex items-center gap-4 rounded-2xl border border-border bg-card/60 p-5 backdrop-blur-sm transition-all duration-300 hover:border-primary/30 hover:shadow-[0_0_30px_rgba(147,51,234,0.06)] ${item.href ? "cursor-pointer" : ""}`}
                  >
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-primary/20 bg-primary/10 transition-colors group-hover:border-primary/40">
                      <Icon className="text-xl text-primary" />
                    </div>
                    <div>
                      <p className="text-xs font-medium tracking-wide uppercase text-muted-foreground">
                        {item.label}
                      </p>
                      <p className="mt-0.5 text-sm font-medium text-foreground">
                        {item.value}
                      </p>
                    </div>
                  </Tag>
                )
              })}
            </div>

            {/* Social links */}
            <div>
              <p className="mb-3 text-xs font-medium tracking-wide uppercase text-muted-foreground">
                Find me on
              </p>
              <div className="flex flex-wrap items-center gap-3">
                {socials.map((s, i) => {
                  const Icon = s.icon
                  return (
                    <motion.a
                      key={s.label}
                      href={s.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={s.label}
                      initial={{ opacity: 0, y: 20 }}
                      animate={isInView ? { opacity: 1, y: 0 } : {}}
                      transition={{ duration: 0.4, delay: 0.4 + i * 0.1 }}
                      className="flex h-11 w-11 cursor-pointer items-center justify-center rounded-xl border border-border bg-card/60 text-muted-foreground transition-all duration-300 hover:border-primary/40 hover:text-primary hover:-translate-y-0.5"
                    >
                      <Icon size={18} />
                    </motion.a>
                  )
                })}
              </div>
            </div>
          </motion.div>

          {/* Right -- contact form */}
          <motion.form
            onSubmit={handleSubmit}
            initial={{ opacity: 0, x: 40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.3, ease: "easeOut" }}
            style={{ y: rightY }}
            className="flex flex-col gap-4 rounded-2xl border border-border bg-card/60 p-5 backdrop-blur-sm sm:gap-5 sm:p-8 lg:col-span-3"
          >
            {/* Name */}
            <div className="flex flex-col gap-2">
              <label
                htmlFor="name"
                className="flex items-center gap-2 text-xs font-medium tracking-wide uppercase text-muted-foreground"
              >
                <FiUser className="text-sm text-primary" />
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formState.name}
                onChange={handleChange}
                required
                placeholder="Your name"
                className="rounded-xl border border-border bg-input/40 px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/50 outline-none transition-all duration-200 focus:border-primary/50 focus:ring-1 focus:ring-primary/30"
              />
            </div>

            {/* Email */}
            <div className="flex flex-col gap-2">
              <label
                htmlFor="email"
                className="flex items-center gap-2 text-xs font-medium tracking-wide uppercase text-muted-foreground"
              >
                <FiMail className="text-sm text-primary" />
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formState.email}
                onChange={handleChange}
                required
                placeholder="your@email.com"
                className="rounded-xl border border-border bg-input/40 px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/50 outline-none transition-all duration-200 focus:border-primary/50 focus:ring-1 focus:ring-primary/30"
              />
            </div>

            {/* Message */}
            <div className="flex flex-col gap-2">
              <label
                htmlFor="message"
                className="flex items-center gap-2 text-xs font-medium tracking-wide uppercase text-muted-foreground"
              >
                <FiMessageSquare className="text-sm text-primary" />
                Message
              </label>
              <textarea
                id="message"
                name="message"
                rows={5}
                value={formState.message}
                onChange={handleChange}
                required
                placeholder="Tell me about your project..."
                className="resize-none rounded-xl border border-border bg-input/40 px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/50 outline-none transition-all duration-200 focus:border-primary/50 focus:ring-1 focus:ring-primary/30"
              />
            </div>

            {/* Submit */}
            <motion.button
              type="submit"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="mt-2 flex cursor-pointer items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3.5 text-sm font-semibold text-primary-foreground transition-shadow duration-300 hover:shadow-[0_0_25px_rgba(147,51,234,0.3)]"
            >
              <FiSend className="text-base" />
              Send Message
            </motion.button>
          </motion.form>
        </div>
      </div>
    </section>
  )
}
