"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { HiMenuAlt3, HiX } from "react-icons/hi"

const navLinks = [
  { label: "Home", href: "#home" },
  { label: "About", href: "#about" },
  { label: "Experience", href: "#experience" },
  { label: "Skills", href: "#skills" },
  { label: "Projects", href: "#projects" },
  { label: "Contact", href: "#contact" },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [isDesktop, setIsDesktop] = useState(false)
  const [activeSection, setActiveSection] = useState("home")

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
      
      // Detect active section
      const sections = navLinks.map(link => link.href.replace("#", ""))
      const scrollPosition = window.scrollY + 150
      
      for (let i = sections.length - 1; i >= 0; i--) {
        const section = document.getElementById(sections[i])
        if (section && section.offsetTop <= scrollPosition) {
          setActiveSection(sections[i])
          break
        }
      }
    }

    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 1024)
    }

    handleResize()
    handleScroll()
    window.addEventListener("scroll", handleScroll, { passive: true })
    window.addEventListener("resize", handleResize)

    return () => {
      window.removeEventListener("scroll", handleScroll)
      window.removeEventListener("resize", handleResize)
    }
  }, [])

  const shouldShrink = scrolled && isDesktop

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className="fixed top-0 left-0 right-0 z-50 flex justify-center px-4 lg:px-0"
    >
      <motion.div
        animate={{
          maxWidth: shouldShrink ? 720 : 1200,
          borderRadius: shouldShrink ? 999 : 0,
          marginTop: shouldShrink ? 12 : 0,
        }}
        transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
        className={`w-full transition-colors duration-300 ${
          scrolled
            ? "border border-border bg-background/80 shadow-lg shadow-primary/5 backdrop-blur-xl"
            : "bg-transparent border-transparent"
        } ${!isDesktop && scrolled ? "mt-2 rounded-2xl" : ""}`}
      >
        <nav className="flex items-center justify-between px-4 py-3 sm:px-5">
          <motion.a
            href="#home"
            className="cursor-pointer text-lg font-semibold tracking-tight text-foreground"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {"<"}
            <span className="text-primary">Palchhin</span>
            {" />"}
          </motion.a>

          <ul className="hidden items-center gap-6 lg:flex">
            {navLinks.map((link) => {
              const isActive = activeSection === link.href.replace("#", "")
              return (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className={`relative cursor-pointer text-sm font-medium transition-colors group ${
                      isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {link.label}
                    <span 
                      className={`absolute -bottom-1 left-0 h-0.5 bg-primary transition-all duration-300 ${
                        isActive ? "w-full" : "w-0 group-hover:w-full"
                      }`} 
                    />
                  </a>
                </li>
              )
            })}
          </ul>

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="cursor-pointer text-foreground lg:hidden"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
          >
            {mobileOpen ? <HiX size={24} /> : <HiMenuAlt3 size={24} />}
          </button>
        </nav>

        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden border-t border-border bg-background/95 backdrop-blur-xl lg:hidden rounded-b-2xl"
            >
              <ul className="flex flex-col gap-3 px-4 py-4 sm:px-5 sm:py-5">
                {navLinks.map((link, i) => {
                  const isActive = activeSection === link.href.replace("#", "")
                  return (
                    <motion.li
                      key={link.label}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.07 }}
                    >
                      <a
                        href={link.href}
                        onClick={() => setMobileOpen(false)}
                        className={`cursor-pointer text-base font-medium transition-colors ${
                          isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        {link.label}
                      </a>
                    </motion.li>
                  )
                })}
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.header>
  )
}
