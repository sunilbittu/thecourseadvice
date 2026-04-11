# Design System: CourseAdvice — The Scholarly Perspective

**Stitch Project ID:** `6820986658869567894`
**Stack:** React 19 + Next.js (App Router) + shadcn/ui + Tailwind CSS + GSAP
**Design Philosophy:** Awwwards-grade editorial UI — "The Digital Curator"

---

## 1. Creative North Star

> A premium digital curator for academic discovery. The experience should feel like walking through a contemporary gallery or reading a high-end editorial journal — authoritative, calm, meticulously organized, and alive with subtle motion.

### Awwwards-Level Principles
- **Intentional Asymmetry** — Avoid perfect centering. Use 10%/5% margin splits, off-grid overlapping cards, and editorial whitespace as an active design element.
- **The "No-Line" Rule** — Borders are prohibited for sectioning. Use background color shifts between surface tiers instead.
- **Signature Textures** — Radial gradients (`primary` → `primary-container`), glassmorphism (`surface` at 80% + 24px blur), and tonal layering over drop shadows.
- **Motion is Meaning** — Every transition communicates hierarchy. GSAP powers scroll-triggered reveals, magnetic hover effects, and orchestrated page entrances.

---

## 2. Color Palette — CSS Custom Properties

Map these as shadcn/ui CSS variables in `globals.css` using HSL format.

### Core Palette

| Role | Token | Hex | HSL | Usage |
|:-----|:------|:----|:----|:------|
| **Primary** | `--primary` | `#00134a` | `222 100% 15%` | Headlines, nav brand, deep backgrounds |
| **Primary Container** | `--primary-container` | `#002479` | `222 100% 24%` | Hero gradient end, module numbers, dark CTAs |
| **Surface Tint / Accent** | `--surface-tint` | `#004ee8` | `220 100% 45%` | Interactive elements, active states, links, primary buttons |
| **Secondary** | `--secondary` | `#405c9f` | `222 42% 44%` | Secondary nav, sidebar active |
| **Secondary Container** | `--secondary-container` | `#99b4fe` | `222 98% 80%` | Progress bars, chart fills, tags |
| **Error** | `--destructive` | `#ba1a1a` | `0 76% 42%` | Error states, logout, delete |

### Surface Hierarchy (The "Paper Stack")

| Layer | Token | Hex | Context |
|:------|:------|:----|:--------|
| Canvas | `--background` / `--surface` | `#faf8ff` | Page background |
| Container Low | `--surface-container-low` | `#f2f3ff` | Section alternation, sidebar cards |
| Container | `--surface-container` | `#eaedff` | Input backgrounds (resting) |
| Container High | `--surface-container-high` | `#e2e7ff` | Input backgrounds (focus), hover states |
| Container Highest | `--surface-container-highest` | `#dae2fd` | Active selections, popovers |
| Lowest (Pure White) | `--card` | `#ffffff` | Cards, modals, floating elements |

### Text Colors

| Role | Token | Hex | Usage |
|:-----|:------|:----|:------|
| Primary Text | `--on-surface` / `--foreground` | `#131b2e` | Body text — never use `#000000` |
| Secondary Text | `--on-surface-variant` / `--muted-foreground` | `#444650` | Captions, labels, metadata |
| Outline | `--outline` | `#747781` | Placeholder text, disabled states |
| Outline Variant | `--outline-variant` | `#c4c6d2` | Ghost borders at 15% opacity |
| Inverse Surface | `--inverse-surface` | `#283044` | Dark cards, tooltips |

### Accent / Semantic

| Role | Hex | Usage |
|:-----|:----|:------|
| Success | `#38a169` (emerald) | Trend up indicators, check marks |
| Warning | `#d97c5b` (`on-tertiary-container`) | Amber badges, pending states |
| Tertiary Container | `#561801` | Completed status bar, star ratings |
| Primary Fixed | `#dce1ff` | Light badges, tag backgrounds |
| Primary Fixed Dim | `#b6c4ff` | Accent bars, inverse text on dark |

---

## 3. Typography

### Font Stack
```css
--font-headline: 'Manrope', system-ui, sans-serif;
--font-body: 'Inter', system-ui, sans-serif;
--font-label: 'Inter', system-ui, sans-serif;
```

### Type Scale (Awwwards-Inspired)

| Level | Font | Size | Weight | Letter-Spacing | Line-Height | Usage |
|:------|:-----|:-----|:-------|:----------------|:------------|:------|
| Display LG | Manrope | 3.5rem (56px) | 800 | -0.03em | 1.05 | Hero headlines |
| Display MD | Manrope | 3rem (48px) | 800 | -0.02em | 1.1 | Page titles |
| Headline LG | Manrope | 2.5rem (40px) | 700 | -0.02em | 1.15 | Section headers |
| Headline MD | Manrope | 2rem (32px) | 700 | -0.015em | 1.2 | Sub-headers |
| Headline SM | Manrope | 1.5rem (24px) | 700 | -0.01em | 1.3 | Card titles |
| Title LG | Inter | 1.25rem (20px) | 700 | -0.01em | 1.4 | Card names, sidebar headers |
| Title MD | Inter | 1rem (16px) | 600 | 0 | 1.5 | Labels, form headers |
| Body LG | Inter | 1rem (16px) | 400 | 0 | 1.6 | Long-form descriptions ("Leaded" look) |
| Body MD | Inter | 0.875rem (14px) | 400 | 0 | 1.5 | Default body text |
| Body SM | Inter | 0.75rem (12px) | 500 | 0 | 1.4 | Instructor names, metadata |
| Label | Inter | 0.625rem (10px) | 700 | 0.2em | 1 | All-caps category labels, tracking text |

### Typography Rules
- **High-Contrast Scale** — Jump aggressively between sizes. Pair `headline-sm` (24px) with `body-md` (14px). Never place 16px next to 18px.
- **The "Leaded" Look** — Use `line-height: 1.6` on `body-lg` for course descriptions to mimic premium print.
- **Tight Tracking on Headlines** — All Manrope headlines use negative letter-spacing (-0.02em to -0.03em).
- **Uppercase Labels** — Category labels, status text, and metadata use `text-[10px] font-bold uppercase tracking-[0.2em]`.

---

## 4. Spacing & Layout

### Grid System
- **Max width:** `1440px` (content), `1920px` (nav/footer)
- **Page padding:** `px-8` (32px) standard, `px-12` (48px) for footer grids
- **Section spacing:** `py-24` (96px) between major sections
- **Card gap:** `gap-6` (24px) to `gap-8` (32px)
- **12-column grid** for dashboard layouts (`grid-cols-12`)

### Asymmetric Editorial Margins
```
Left margin:  10% on editorial layouts
Right margin: 5% on editorial layouts
```

### Whitespace Philosophy
> If a layout feels empty, add *more* space, not more elements.

---

## 5. Elevation & Depth

### Tonal Layering (Preferred over Shadows)
Depth is achieved by "stacking" surface tiers:
- `card (#ffffff)` on `surface-container-low (#f2f3ff)` = natural lift
- `surface-container-highest (#dae2fd)` for active/hover overlay

### Shadow System (When Required)

| Level | CSS | Usage |
|:------|:----|:------|
| Editorial | `0 20px 40px -15px rgba(19, 27, 46, 0.06)` | Cards at rest |
| Floating | `0 25px 50px -12px rgba(0, 78, 232, 0.15)` | Primary CTA buttons |
| Ambient | `0 40px 80px rgba(19, 27, 46, 0.04)` | Dragged/floating elements |
| Hero Glow | `0 0 120px 40px rgba(0, 78, 232, 0.15)` | Behind hero images |

### The "Ghost Border" Rule
If accessibility requires a stroke: `border border-outline-variant/15` (suggestion of a container, not a hard edge).

---

## 6. Border Radius

| Token | Value | Usage |
|:------|:------|:------|
| `--radius-sm` | `0.25rem` (4px) | Minimum — even "sharp" elements get this |
| `--radius` | `0.5rem` (8px) | Default buttons, inputs, small cards |
| `--radius-lg` | `0.75rem` (12px) | Cards, modals |
| `--radius-xl` | `1rem` (16px) | Hero cards, dashboard sections |
| `--radius-2xl` | `1.5rem` (24px) | Recommended cards, feature sections |
| `--radius-full` | `9999px` | Pills, avatars, tags |

**Rule:** Never use `0px` corners. Even the most "professional" elements need `radius-sm`.

---

## 7. Components — shadcn/ui Mapping

### Navigation

| Pattern | shadcn Component | Styling |
|:--------|:-----------------|:--------|
| Top Nav | Custom `<Navbar>` | Sticky, glassmorphism (`bg-surface/80 backdrop-blur-xl`), `h-20`, max-w-1920 |
| Side Nav | `<Sidebar>` from shadcn | Fixed, `w-64`, `bg-slate-50`, no border (use bg shift), left accent bar on active |
| Breadcrumbs | `<Breadcrumb>` | `text-sm text-on-surface-variant`, chevron separators |
| Mobile Nav | Custom bottom bar | Fixed bottom, icon + 10px label, active = filled icon + primary color |

### Buttons

| Variant | shadcn Variant | Styling |
|:--------|:---------------|:--------|
| Primary CTA | `default` | `bg-surface-tint text-white`, rounded-lg, 1px inner-top glow (white 10%), hover: `brightness-110` |
| Primary Dark | `default` | `bg-primary text-white`, for hero/footer CTAs |
| Secondary/Ghost | `outline` | No fill, `text-surface-tint`, ghost border (`border-outline-variant/15`) |
| Danger | `destructive` | `text-error`, used for logout/delete |
| Icon Button | `ghost` + `size="icon"` | `p-2 rounded-lg hover:bg-surface-container-high` |

### Cards

| Type | Construction | Notes |
|:-----|:-------------|:------|
| Course Card | `<Card>` | White bg, rounded-xl, editorial-shadow, hover: `-translate-y-1`, image with `grayscale group-hover:grayscale-0` |
| Stat Card | `<Card>` | `border-l-4 border-surface-tint`, surface-container-low bg, large number in Manrope 800 |
| Feature Card (dark) | Custom | `bg-gradient-to-br from-primary-container to-primary`, white text, decorative blur circle |
| Institution Card | `<Card>` | White bg, centered logo, hover: `-translate-y-1`, ghost border |

**Card Rules:**
- Forbid internal dividers — use whitespace (1.5rem) between title and metadata
- Left accent bar (`4px wide`, `primary-fixed-dim #b6c4ff`) for status indicators
- Image cards: `group-hover:scale-105 transition-transform duration-500`

### Inputs

| State | Styling |
|:------|:--------|
| Resting | `bg-surface-container-high border-none rounded-lg p-4` |
| Focused | `bg-surface-container-highest ring-1 ring-primary` (ghost border appears) |
| Search Bento | Multi-field row in `bg-white p-2 rounded-xl`, each field has `bg-surface-container-low` |

### Progress Indicators
- Thick track: `h-2 rounded-full bg-white/20` (on dark) or `bg-surface-container-highest` (on light)
- Fill: `bg-surface-tint` or `bg-secondary-container`
- Paired with `label-md` text ("80% Complete")

### Tables (Analytics)
- Header: `bg-slate-50/30`, `text-xs uppercase tracking-wider text-on-surface-variant`
- Rows: `hover:bg-surface-container-low`, group-hover on course name changes to `text-surface-tint`
- Status badges: `rounded-full px-3 py-1 text-xs font-bold` with emerald/amber color coding

---

## 8. GSAP Animation System — Awwwards Motion

### Philosophy
Motion should feel **orchestrated, not decorative**. Every animation communicates hierarchy and guides the eye.

### Page Entrance Choreography
```js
// Staggered section reveal on page load
gsap.from('.section', {
  y: 60,
  opacity: 0,
  duration: 0.8,
  stagger: 0.15,
  ease: 'power3.out',
})
```

### Scroll-Triggered Animations
```js
// Cards cascade in from below
gsap.from('.card', {
  scrollTrigger: { trigger: '.card-grid', start: 'top 80%' },
  y: 80,
  opacity: 0,
  duration: 0.6,
  stagger: 0.1,
  ease: 'power2.out',
})

// Headline text split & reveal
gsap.from('.hero-headline .word', {
  y: '110%',
  rotateX: -20,
  duration: 0.7,
  stagger: 0.05,
  ease: 'power4.out',
})

// Counter number roll-up
gsap.from('.stat-number', {
  textContent: 0,
  duration: 1.5,
  snap: { textContent: 1 },
  ease: 'power2.out',
})
```

### Micro-Interactions
```js
// Magnetic button hover (Awwwards signature)
button.addEventListener('mousemove', (e) => {
  const { left, top, width, height } = button.getBoundingClientRect()
  const x = (e.clientX - left - width / 2) * 0.3
  const y = (e.clientY - top - height / 2) * 0.3
  gsap.to(button, { x, y, duration: 0.3, ease: 'power2.out' })
})
button.addEventListener('mouseleave', () => {
  gsap.to(button, { x: 0, y: 0, duration: 0.5, ease: 'elastic.out(1, 0.4)' })
})

// Card hover lift
gsap.utils.toArray('.course-card').forEach(card => {
  card.addEventListener('mouseenter', () =>
    gsap.to(card, { y: -8, boxShadow: '0 25px 50px -12px rgba(0,78,232,0.15)', duration: 0.3 })
  )
  card.addEventListener('mouseleave', () =>
    gsap.to(card, { y: 0, boxShadow: '0 20px 40px -15px rgba(19,27,46,0.06)', duration: 0.4 })
  )
})
```

### Page Transitions
```js
// Smooth route transitions (Next.js App Router)
// Exit: slide up + fade
gsap.to('.page-content', { y: -40, opacity: 0, duration: 0.3, ease: 'power2.in' })
// Enter: slide up from below
gsap.from('.page-content', { y: 40, opacity: 0, duration: 0.5, ease: 'power3.out' })
```

### Parallax & Decorative
```js
// Hero background parallax
gsap.to('.hero-gradient', {
  scrollTrigger: { trigger: '.hero', scrub: 1 },
  y: -100,
  scale: 1.1,
})

// Floating decorative blur circles
gsap.to('.blur-circle', {
  y: -20,
  x: 10,
  duration: 4,
  repeat: -1,
  yoyo: true,
  ease: 'sine.inOut',
})
```

---

## 9. Screens Inventory

| Screen | Route | Layout | Status |
|:-------|:------|:-------|:-------|
| Student Homepage / Search | `/` | Public — Top Nav + Full Width | Designed |
| Student Dashboard | `/dashboard` | Auth — Sidebar + Main | Designed |
| Course Details | `/courses/[slug]` | Public — Top Nav + 2-Column (8/4) | Designed |
| My Courses | `/my-courses` | Auth — Sidebar + Main | Designed |
| Institution Dashboard | `/institution` | Auth — Sidebar + Main | Designed |
| Institution Analytics | `/institution/analytics` | Auth — Sidebar + Main | Designed |
| Resources Hub v1 | `/resources` | Public — Top Nav + Full Width | Designed |
| Resources Hub v2 | `/resources` (alt) | Auth — Sidebar + Main | Designed |
| Settings / Profile | `/settings/profile` | Auth — Top Nav + Sidebar + Main | Designed |

---

## 10. Do's and Don'ts

### Do
- Use asymmetrical margins for editorial layouts
- Embrace whitespace — if it feels empty, add *more* space
- Use `on-surface-variant (#444650)` for secondary text
- Use GSAP `power3.out` and `power4.out` eases for organic motion
- Split hero text into words/chars for staggered reveals
- Use grayscale-to-color image transitions on hover
- Pair radial gradients with glassmorphism on hero sections

### Don't
- Use `#000000` for text — use `on-surface (#131b2e)` for deep navy-ink
- Use `1px solid` borders for sectioning — use background color shifts
- Use `0px` corners — minimum is `radius-sm (0.25rem)`
- Use generic CSS transitions when GSAP provides richer control
- Use linear eases — they feel mechanical and cheap
- Add elements to fill space — add whitespace instead
- Over-animate — motion should be subtle and purposeful, not carnival
