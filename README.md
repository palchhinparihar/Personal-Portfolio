<div align="center">

# Palchhin - Personal Portfolio

**Full-Stack Developer · University Researcher · Open Source Contributor**

[![Next.js](https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=next.js)](https://nextjs.org)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react&logoColor=black)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white)](https://tailwindcss.com)
[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-000?style=flat-square&logo=vercel)](https://vercel.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow?style=flat-square)](LICENSE)

</div>

---

## About

**Palchhin** — Full-Stack Developer (MERN), University Researcher at DSEU University, and active open source contributor. Currently exploring AI/ML alongside web development.

> Full details are available in the portfolio itself.

---

## Portfolio Theme

This portfolio is themed around **Demon Slayer**, specifically inspired by **Tomioka Giyu** (the Water Hashira).

- An animated **Giyu character** appears on the landing page
- The custom **water cursor** mimics Giyu's Water Breathing style — leaving fluid ripple trails as you move
- The **3D scene background** uses deep blue/dark tones matching the Water Breathing aesthetic
- Subtle **particle effects and lighting** reinforce the anime atmosphere throughout
- Section transitions and scroll animations feel like flowing water, tying the whole experience together

---

## Tech Stack

**Languages**

![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat-square&logo=javascript&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white)
![Python](https://img.shields.io/badge/Python-3776AB?style=flat-square&logo=python&logoColor=white)
![C++](https://img.shields.io/badge/C++-00599C?style=flat-square&logo=cplusplus&logoColor=white)

**Frontend**

![Next.js](https://img.shields.io/badge/Next.js-000?style=flat-square&logo=next.js)
![React](https://img.shields.io/badge/React-61DAFB?style=flat-square&logo=react&logoColor=black)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white)
![Framer Motion](https://img.shields.io/badge/Framer_Motion-000?style=flat-square&logo=framer)
![Three.js](https://img.shields.io/badge/Three.js-000?style=flat-square&logo=three.js)
![shadcn/ui](https://img.shields.io/badge/shadcn%2Fui-000?style=flat-square&logo=shadcnui)

**Backend & Database**

![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat-square&logo=node.js&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-000?style=flat-square&logo=express)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=flat-square&logo=mongodb&logoColor=white)

**Tools & Platforms**

![Git](https://img.shields.io/badge/Git-F05032?style=flat-square&logo=git&logoColor=white)
![GitHub](https://img.shields.io/badge/GitHub-181717?style=flat-square&logo=github)
![Vercel](https://img.shields.io/badge/Vercel-000?style=flat-square&logo=vercel)
![v0.dev](https://img.shields.io/badge/v0.dev-000?style=flat-square&logo=vercel&logoColor=white)

> UI components and layouts were scaffolded using [v0.dev](https://v0.dev) — Vercel's AI-powered UI generation tool.

---

## Features

- **Responsive Design** — Fully adaptive layout for all screen sizes
- **Dark / Light Theme** — System-aware theme switching via `next-themes`
- **Smooth Animations** — Page and section transitions powered by Framer Motion
- **Interactive 3D Background** — Real-time WebGL scene using Three.js
- **Custom Water Cursor** — Canvas-based fluid cursor effect
- **Accessible UI** — Radix UI primitives with keyboard navigation support
- **SEO Optimized** — Structured metadata and Open Graph tags via Next.js

---

## Getting Started

**Prerequisites:** Node.js 18+, pnpm

```bash
# Clone the repo
git clone https://github.com/palchhinparihar/Personal-Portfolio.git
cd Personal-Portfolio

# Install dependencies
pnpm install

# Start the dev server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

| Script | Description |
|---|---|
| `pnpm dev` | Start development server |
| `pnpm build` | Create production build |
| `pnpm start` | Serve the production build |
| `pnpm lint` | Run ESLint |

---

## Project Structure

```
├── app/
│   ├── globals.css            # Global styles
│   ├── layout.tsx             # Root layout + metadata + fonts
│   └── page.tsx               # Main page — assembles all sections
├── components/
│   ├── navbar.tsx             # Top navigation bar
│   ├── hero-section.tsx       # Landing / hero section
│   ├── about-section.tsx      # About me
│   ├── experience-section.tsx
│   ├── projects-section.tsx
│   ├── skills-section.tsx
│   ├── contact-section.tsx
│   ├── footer.tsx
│   ├── scene-background.tsx   # Three.js 3D background (lazy loaded)
│   ├── water-cursor.tsx       # Custom canvas cursor (lazy loaded)
│   ├── giyu-character.tsx     # Animated character (lazy loaded)
│   ├── typing-animation.tsx
│   └── ui/                    # shadcn/ui component library
├── hooks/                     # Custom React hooks
├── lib/
│   └── utils.ts               # Utility helpers (cn, etc.)
└── public/                    # Static assets
```

---

## Deployment

Deployed on [Vercel](https://vercel.com). Every push to `main` triggers an automatic production deployment.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/palchhinparihar/Personal-Portfolio)

---

## Connect

| Platform | Link |
|---|---|
| GitHub | [palchhinparihar](https://github.com/palchhinparihar) |
| LinkedIn | [linkedin.com/in/palchhinparihar](https://linkedin.com/in/palchhinparihar) |
| Twitter / X | [x.com](https://x.com/palchhinx) |
| Devpost | [devpost.com](https://devpost.com/palchhinparihar) |
| Devfolio | [devfolio.co](https://devfolio.co/@palchhinparihar) |
| Codedex | [codedex.io](https://codedex.io/@palchhin) |
