# WebSEM B2B Landing Page

Landing page și blog pentru WebSEM B2B Lead Intelligence, construit cu Astro.

**Live URL:** https://b2b.websem.ro

---

## 🚀 Quick Start

```bash
# Instalare dependințe
npm install

# Development server (http://localhost:4321)
npm run dev

# Build pentru producție
npm run build

# Preview build local
npm run preview
```

---

## 📁 Structura Proiectului

```
websem-astro/
├── public/                 # Static assets (imagini, favicon, robots.txt)
│   └── robots.txt
├── src/
│   ├── components/         # Componente Astro reutilizabile
│   │   ├── Header.astro
│   │   ├── Footer.astro
│   │   ├── Hero.astro
│   │   ├── BenefitsSection.astro
│   │   ├── StatsSection.astro
│   │   ├── VendorFailures.astro
│   │   ├── FeaturesSection.astro
│   │   ├── CapabilitiesSection.astro
│   │   ├── ClientsCarousel.astro
│   │   ├── CtaSection.astro
│   │   └── BookingModal.astro
│   ├── content/            # Content Collections (blog, case studies)
│   │   ├── config.ts       # Schema definitions
│   │   └── blog/           # Articole blog (Markdown/MDX)
│   ├── layouts/            # Layout templates
│   │   ├── LandingPage.astro
│   │   └── BlogLayout.astro
│   ├── pages/              # Pagini (routing automat)
│   │   ├── index.astro     # Homepage
│   │   └── blog/
│   │       ├── index.astro         # Blog listing
│   │       └── [...slug].astro     # Blog post dinamic
│   └── styles/
│       └── global.css      # Stiluri globale
├── astro.config.mjs        # Configurare Astro
├── package.json
└── tsconfig.json
```

---

## 📝 Cum să adaugi un articol nou pe Blog

### 1. Creează fișierul

Creează un fișier `.md` sau `.mdx` în `src/content/blog/`:

```bash
src/content/blog/numele-articolului.md
```

**Convenție naming:** folosește slug-ul URL-ului dorit (ex: `ghid-email-outreach.md` → `/blog/ghid-email-outreach`)

### 2. Adaugă frontmatter

```yaml
---
title: "Titlul Articolului"
description: "Descriere scurtă pentru SEO (max 160 caractere)"
pubDate: 2024-01-20
author: "WebSEM Team"
category: "lead-generation"
tags: ["b2b", "sales", "outreach"]
heroImage: "/images/blog/hero-image.jpg"
heroImageAlt: "Descriere imagine"
featured: false
draft: false
---
```

### 3. Scrie conținutul în Markdown

```markdown
## Introducere

Text introductiv aici...

### Subtitlu

- Bullet point 1
- Bullet point 2

> Citat sau highlight

**Text bold** și *text italic*

[Link text](https://example.com)
```

### 4. Deploy

```bash
git add .
git commit -m "Add blog post: titlul-articolului"
git push
```

Vercel va face deploy automat în ~30 secunde.

---

## 📋 Schema Blog Post

| Câmp | Tip | Required | Descriere |
|------|-----|----------|-----------|
| `title` | string | ✅ | Titlul articolului |
| `description` | string | ✅ | Descriere SEO |
| `pubDate` | date | ✅ | Data publicării (YYYY-MM-DD) |
| `author` | string | ❌ | Default: "WebSEM Team" |
| `category` | enum | ❌ | Vezi categorii disponibile |
| `tags` | string[] | ❌ | Array de tags |
| `heroImage` | string | ❌ | Path către imagine hero |
| `heroImageAlt` | string | ❌ | Alt text pentru imagine |
| `featured` | boolean | ❌ | Afișat în secțiunea Featured |
| `draft` | boolean | ❌ | `true` = nu apare în producție |
| `updatedDate` | date | ❌ | Data ultimei actualizări |
| `readingTime` | number | ❌ | Minute (calculat automat dacă lipsește) |

### Categorii disponibile:
- `seo`
- `lead-generation`
- `b2b-sales`
- `marketing`
- `ai`
- `email-outreach`
- `case-study`
- `tutorial`

---

## 🎨 Componente Landing Page

Toate componentele acceptă props pentru personalizare. Exemple:

### Hero
```astro
<Hero
    badge="Custom Badge"
    titleLine1="Titlu linia 1"
    titleLine2="Linia 2 cu gradient"
    subtitle="Subtitlu descriptiv"
/>
```

### BenefitsSection
```astro
<BenefitsSection
    title="De ce noi"
    subtitle="Subtitlu secțiune"
    benefits={[
        { title: "Titlu", description: "Descriere", stat: "100%" }
    ]}
/>
```

### StatsSection
```astro
<StatsSection
    stats={[
        { value: "265M+", label: "Contacte B2B" },
        { value: "98%", label: "Acuratețe" }
    ]}
/>
```

---

## 🔧 Configurare

### astro.config.mjs

```javascript
export default defineConfig({
  site: 'https://b2b.websem.ro',  // URL-ul site-ului
  integrations: [mdx()],
  compressHTML: true,
  build: {
    inlineStylesheets: 'auto',
    assets: '_assets',
  },
});
```

### Variabile CSS (global.css)

```css
:root {
    --black: #0a0a0a;
    --white: #ffffff;
    --gray-400: #a3a3a3;
    --gray-500: #737373;
    --accent: #6366f1;
    --accent-light: #818cf8;
    --gradient-primary: linear-gradient(135deg, #667eea, #764ba2);
}
```

---

## 📦 Dependințe principale

| Pachet | Versiune | Descriere |
|--------|----------|-----------|
| `astro` | ^4.5.0 | Framework |
| `@astrojs/mdx` | ^2.x | MDX support pentru blog |

---

## 🚀 Deployment

Proiectul este configurat cu **Vercel** pentru deployment automat.

### Workflow:
1. Push pe `main` branch
2. Vercel detectează automat schimbările
3. Build și deploy în ~30-60 secunde
4. Live pe https://b2b.websem.ro

### Manual deploy:
```bash
npm run build
# Output în /dist - poate fi servit de orice static host
```

---

## 📊 SEO Checklist

Fiecare pagină include:
- [x] Meta title și description
- [x] Canonical URL
- [x] Open Graph tags
- [x] Twitter Card tags
- [x] JSON-LD structured data (blog posts)
- [x] robots.txt
- [ ] sitemap.xml (TODO: re-enable după upgrade Astro 5)

---

## 🛠 Dezvoltare viitoare

### TODO:
- [ ] Upgrade la Astro 5 și re-enable sitemap
- [ ] Adaugă imagini pentru logo carousel (public/images/logos/)
- [ ] Configurează Calendly URL real în BookingModal
- [ ] Adaugă favicon personalizat
- [ ] Integrare form submission (Netlify Forms / Formspree / custom)
- [ ] Case Studies collection
- [ ] Newsletter subscription

### Idei:
- Contact page separată
- Pricing page
- Resources/Downloads section
- Multi-language support (ro/en)

---

## 📞 Contact

**WebSEM**
- Email: office@websem.ro
- Telefon: 0760.60.48.49
- Website: https://websem.ro

---

## 📄 Licență

Proprietar - WebSEM © 2024
