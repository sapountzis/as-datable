# Andreas Sapountzis — Portfolio

A high-performance, "zero-bloat" personal portfolio built with **Next.js 16 (App Router)** and **React 19**, deployed to the edge via **Cloudflare Workers**.

![Tech Stack](https://img.shields.io/badge/Next.js-16-black) ![Tech Stack](https://img.shields.io/badge/React-19-blue) ![Tech Stack](https://img.shields.io/badge/Tailwind-v4-cyan) ![Tech Stack](https://img.shields.io/badge/Cloudflare_Workers-orange)

## 🚀 Key Features

- **Architecture**: Static-first Next.js App Router setup with selective `"use client"` hydration.
- **Performance**:
    - **React Compiler**: Enabled for automatic fine-grained memoization.
    - **Optimized Assets**: Local font hosting (IBM Plex Serif, Plus Jakarta Sans) and zero layout shift.
    - **Zero Bloat**: Aggressive tree-shaking and removal of 115+ unused dependencies and 30+ dead components compared to the original source.
- **Design**:
    - **Tailwind CSS v4**: Utilizing the new high-performance CSS engine.
    - **Visuals**: Glassmorphism, custom CSS variables, and a "Neural Fabric" Three.js hero animation.
    - **Responsive**: Mobile-first fluid layout.

## 🛠️ Development

### Prerequisites
- Node.js 18+
- NPM

### Commands

**Development Server:**
```bash
npm run dev
```
Runs the standard Next.js dev server at `http://localhost:3000`.

**Production Build:**
```bash
npm run build
```
Creates an optimized production build and checks for type errors.

**Preview (Worker Runtime):**
```bash
npm run preview
```
Simulates the Cloudflare Workers environment locally using Miniflare. Use this to verify edge compatibility.

**Deploy:**
```bash
npm run deploy
```
Builds the OpenNext adapter and pushes the worker/assets to your Cloudflare account.

## 📂 Project Structure

```
├── src/
│   ├── app/                # Next.js App Router (Pages & Layouts)
│   ├── components/
│   │   ├── home/           # Homepage-specific sections (Hero, WorkPreview, etc.)
│   │   ├── layout/         # Global layout (Header, Footer)
│   │   └── ui/             # Minimal Shadcn/Radix primitives (Toast, AnimateIn)
│   ├── hooks/              # Custom hooks (useInView, useMobile)
│   └── lib/                # Utilities
├── public/                 # Static assets (images, fonts, _headers)
├── next.config.ts          # Next.js config (React Compiler, Security Headers)
├── open-next.config.ts     # Cloudflare adapter configuration
└── wrangler.jsonc          # Cloudflare Workers configuration
```

## 🔒 Security & Best Practices
- **Headers**: Configured with strict security headers (HSTS, X-Frame-Options, etc.).
- **Privacy**: GA4 configured with strict Consent Mode v2 via `CookieConsent` component.
- **Linting**: Strict ESLint + TypeScript configuration.

---
*Reference Implementation for Advanced Agentic Coding.*
