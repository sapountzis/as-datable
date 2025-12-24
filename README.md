# asdatable.com — Fractional AI Engineer

> Production-grade AI for startups and mid-sized companies.  
> Live: https://asdatable.com

---

## ✨ Stack

| Layer       | Tooling                                             |
|-------------|-----------------------------------------------------|
| Framework   | React 18 + TypeScript                               |
| Build Tool  | Vite                                                |
| Styling     | Tailwind CSS + CSS Variables                        |
| UI Library  | Shadcn UI (Radix UI primitives)                     |
| Routing     | React Router DOM v6                                 |
| Icons       | Lucide React                                        |
| Animations  | CSS keyframes + IntersectionObserver (useInView)    |
| Forms       | Web3Forms (serverless email) + thank-you pages      |
| SEO         | react-helmet-async                                  |
| State       | @tanstack/react-query                               |
| Consent     | Custom React component (CookieConsent)              |
| Analytics   | Google Analytics 4 (consent-gated)                  |
| Hosting     | Cloudflare Pages + `_headers`                       |

---

## 🛠️ Local Development

### Prerequisites

- Node.js 18+ (or Bun)
- npm, pnpm, or bun

### Install dependencies

```bash
npm install
# or
bun install
```

### Run dev server

```bash
npm run dev
# or
bun run dev
```

The site will be available at `http://localhost:5173` (or the port shown in terminal).

---

## 🚀 Building for Production

```bash
npm run build
# or
bun run build
```

This generates optimized static files in the `dist/` directory.

### Preview production build locally

```bash
npm run preview
# or
bun run preview
```

---

## 🌐 Deploying to Cloudflare Pages

- Framework preset: **None** (or Vite)
- Build command: `npm run build` (or `bun run build`)
- Output directory: `dist`
- Domain: attach `asdatable.com` and add a rule `www → https://asdatable.com`
- SSL: enable "Always Use HTTPS" and "Automatic HTTPS Rewrites"

`_headers`, `robots.txt`, and `sitemap.xml` are at the repo root and will be applied.

---

## 📁 Project Structure

```
/
├── src/
│   ├── main.tsx              # App entry point
│   ├── App.tsx               # Root component with routing
│   ├── index.css             # Global styles + Tailwind
│   ├── components/
│   │   ├── CookieConsent.tsx # Custom cookie consent
│   │   ├── NavLink.tsx       # Router NavLink wrapper
│   │   ├── home/             # Home page sections
│   │   │   ├── Hero.tsx
│   │   │   ├── About.tsx
│   │   │   ├── WhoIHelp.tsx
│   │   │   ├── Offers.tsx
│   │   │   ├── HowItWorks.tsx
│   │   │   ├── Principles.tsx
│   │   │   ├── WorkPreview.tsx
│   │   │   ├── FAQ.tsx
│   │   │   └── Contact.tsx
│   │   ├── layout/           # Layout components
│   │   │   ├── Layout.tsx
│   │   │   ├── Header.tsx
│   │   │   └── Footer.tsx
│   │   └── ui/               # Shadcn UI components
│   │       ├── AnimateIn.tsx
│   │       ├── button.tsx
│   │       ├── card.tsx
│   │       ├── accordion.tsx
│   │       ├── alert.tsx
│   │       ├── dialog.tsx
│   │       ├── form.tsx
│   │       ├── input.tsx
│   │       ├── textarea.tsx
│   │       ├── toast.tsx
│   │       └── ... (40+ components)
│   ├── pages/                # Route pages
│   │   ├── Index.tsx         # Home page
│   │   ├── Work.tsx          # Case studies list
│   │   ├── CaseStudy.tsx     # Individual case study
│   │   ├── Brief.tsx         # Project brief form
│   │   ├── Resources.tsx     # Resources hub
│   │   ├── Checklist.tsx     # AI Systems Launch Checklist
│   │   ├── Thanks.tsx        # Form success
│   │   ├── ThanksChecklist.tsx
│   │   ├── Privacy.tsx
│   │   ├── Terms.tsx
│   │   └── NotFound.tsx
│   ├── data/
│   │   └── caseStudies.ts    # Case study content
│   ├── hooks/
│   │   ├── useInView.ts      # Scroll animation hook
│   │   ├── use-mobile.tsx    # Mobile breakpoint hook
│   │   └── use-toast.ts      # Toast notifications
│   └── lib/
│       └── utils.ts          # cn() utility for Tailwind
├── public/                   # Static assets
│   ├── logos/
│   ├── profile.webp
│   ├── favicon.ico
│   └── ...
├── dist/                     # Build output (gitignored)
├── _headers                  # Cloudflare cache rules
├── robots.txt
├── sitemap.xml
├── index.html                # Vite entry HTML
├── vite.config.ts
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

---

## 🧩 Customization

### Update content

- **Home sections**: Edit components in `src/components/home/`
- **Case studies**: Update `src/data/caseStudies.ts`
- **SEO metadata**: Modify `<Helmet>` tags in page components
- **CTAs**: Update Calendly links and email in `Contact.tsx` and `Hero.tsx`
- **Logos**: Replace files in `public/logos/`

### Add new pages

1. Create a new component in `src/pages/`
2. Add a route in `src/App.tsx`
3. Update navigation in `src/components/layout/Header.tsx` if needed

### Styling

- **Global styles**: `src/index.css`
- **Theme colors**: CSS variables in `src/index.css` (`:root` section)
- **Tailwind config**: `tailwind.config.ts`
- **Component styles**: Inline Tailwind classes or component-specific CSS

---

## 🎨 UI Components

This project uses **Shadcn UI**, a collection of reusable components built with:

- **Radix UI** primitives (accessible, unstyled)
- **Tailwind CSS** for styling
- **class-variance-authority** for variant management

All components are in `src/components/ui/` and can be customized directly.

### Key components used

- `AnimateIn` — Scroll-triggered animations
- `Accordion` — FAQ sections
- `Button` — CTA buttons
- `Card` — Content cards
- `Dialog` / `AlertDialog` — Modals
- `Form` / `Input` / `Textarea` — Form elements
- `Toast` / `Sonner` — Notifications
- `Tooltip` — Hover hints

---

## 📦 Dependencies

### Core

- `react` + `react-dom` — UI framework
- `vite` — Build tool
- `typescript` — Type safety
- `tailwindcss` — Utility-first CSS

### Routing & SEO

- `react-router-dom` — Client-side routing
- `react-helmet-async` — Dynamic head tags

### UI & Animations

- `@radix-ui/*` — Accessible component primitives
- `lucide-react` — Icon library
- `clsx` + `tailwind-merge` — Class name utilities

### State & Data

- `@tanstack/react-query` — Server state management

### Forms

- `react-hook-form` — Form validation
- `@hookform/resolvers` + `zod` — Schema validation

---

## 🧪 Scripts

| Command          | Description                          |
|------------------|--------------------------------------|
| `npm run dev`    | Start dev server (Vite)              |
| `npm run build`  | Build for production                 |
| `npm run preview`| Preview production build locally     |
| `npm run lint`   | Run ESLint                           |

---

## 📄 License

MIT. If you reuse significant portions of the copy/design, consider a credit link.

---

### 💬 Work with Andreas

Book a 15-minute intro → https://calendly.com/datable-as/llm-stack-sprint-intro-call
