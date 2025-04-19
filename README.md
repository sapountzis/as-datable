# AS DATABLE • Marketing Site (SvelteKit + Tailwind 3)

> The public website for **AS DATABLE** – I help teams ship **stable, scalable LLM & ML systems** in 10 days.  
> Live site ▶︎ https://asdatable.com

---

## ✨ Tech stack

| Layer       | Tooling                                                              |
|-------------|---------------------------------------------------------------------|
| Front‑end   | **SvelteKit 5** with runes + TypeScript                              |
| Styling     | **Tailwind 3** (custom glass & grid utilities)                       |
| Hosting     | **Cloudflare Pages** + edge caching (static/_headers)                |
| Forms       | Replaced by Calendly; legacy Turnstile form removed                  |
| Animations  | Svelte `transition` + custom keyframes                               |
| Analytics   | Google Analytics 4 (consent‑gated via Cookie Consent)                |

---

## 🚀 Local development

    git clone https://github.com/<your‑org>/as‑datable‑website.git
    cd as‑datable‑website
    pnpm install          # or npm / yarn
    pnpm dev              # hot‑reloads at http://localhost:5173

### Production build

    pnpm build            # outputs to .svelte-kit/

Preview locally:

    pnpm preview

---

## 🛫 Deploying to Cloudflare Pages

1. Create a new Pages project → “Import from GitHub”.
2. Build command: `pnpm build`
3. Output directory: `.svelte-kit/cloudflare`
4. Environment variables (if you re‑enable Turnstile or other secrets):

       TURNSTILE_SITEKEY = xxx
       GA_MEASUREMENT_ID = G‑XXXX

5. Set production branch to `main` → every push auto‑deploys.

---

## 🗺️ Project structure

    src/
    ├─ lib/components/   # Re‑usable, animated Svelte components
    ├─ routes/           # +layout.svelte & +page.svelte = page composition
    ├─ app.css           # Tailwind layers + custom utilities
    static/              # Assets, sitemap, headers
    tailwind.config.ts   # Colour palette & glass utilities

---

## 🪄 Contributing

Open to typo fixes, accessibility improvements, and performance PRs.  
For larger changes, please open an issue first.

    pnpm lint        # Prettier + ESlint
    pnpm check       # svelte‑check type safety

---

## 📄 License

MIT – Free to fork, adapt, and learn from.  
If you reuse the copy or design, please keep a credit link.

---

### 💬 Need an LLM stack audited?

Book a 15‑minute diagnostic call 👉 https://calendly.com/datable-as/llm-stack-sprint-intro-call
