# asdatable.com — Fractional AI Engineer (Static Site)

> Production‑grade AI for startups and mid‑sized companies.  
> Live: https://asdatable.com

---

## ✨ Stack

| Layer       | Tooling                                             |
|-------------|-----------------------------------------------------|
| Front‑end   | Static HTML + Tailwind CDN                          |
| Animations  | CSS keyframes, IntersectionObserver, simple tilt    |
| Forms       | FormSubmit (serverless email) + thank‑you page      |
| Analytics   | Google Analytics 4 (consent‑gated)                  |
| Consent     | vanilla‑cookieconsent                               |
| Hosting     | Cloudflare Pages + `_headers`                       |

---

## 🛠️ Local preview

Open `index.html` directly in a browser, or serve the folder:

    python3 -m http.server 8080

---

## 🚀 Deploying to Cloudflare Pages

- Framework preset: None
- Build command: (empty)
- Output directory: `.`
- Domain: attach `asdatable.com` and add a rule `www → https://asdatable.com`
- SSL: enable “Always Use HTTPS” and “Automatic HTTPS Rewrites”

`_headers`, `robots.txt`, and `sitemap.xml` are at the repo root and will be applied.

---

## 📁 Project structure

    index.html        # Single‑page site
    thanks.html       # Form success page
    checklist.html    # Lead magnet
    _headers          # Cache rules
    robots.txt        # Robots
    sitemap.xml       # Sitemap
    static/           # Logos, favicons, images

---

## 🧩 Customization

- Update CTAs in `index.html` (Calendly and email)
- Replace logos under `static/logos/`
- Edit checklist content in `checklist.html`

---

## 📄 License

MIT. If you reuse significant portions of the copy/design, consider a credit link.

---

### 💬 Work with Andreas

Book a 15‑minute intro → https://calendly.com/datable-as/llm-stack-sprint-intro-call
