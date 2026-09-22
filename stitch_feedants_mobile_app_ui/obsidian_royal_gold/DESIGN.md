---
name: Obsidian & Royal Gold
colors:
  surface: '#111416'
  surface-dim: '#111416'
  surface-bright: '#373a3c'
  surface-container-lowest: '#0b0f11'
  surface-container-low: '#191c1e'
  surface-container: '#1d2022'
  surface-container-high: '#272a2d'
  surface-container-highest: '#323537'
  on-surface: '#e1e2e5'
  on-surface-variant: '#d3c4b1'
  inverse-surface: '#e1e2e5'
  inverse-on-surface: '#2e3133'
  outline: '#9c8f7d'
  outline-variant: '#4f4536'
  surface-tint: '#f5bd58'
  primary: '#f7bf59'
  on-primary: '#422c00'
  primary-container: '#d9a441'
  on-primary-container: '#573c00'
  inverse-primary: '#7d5700'
  secondary: '#ebc165'
  on-secondary: '#402d00'
  secondary-container: '#795900'
  on-secondary-container: '#ffd375'
  tertiary: '#51e0a5'
  on-tertiary: '#003824'
  tertiary-container: '#29c48b'
  on-tertiary-container: '#004b32'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#ffdeaa'
  primary-fixed-dim: '#f5bd58'
  on-primary-fixed: '#271900'
  on-primary-fixed-variant: '#5f4100'
  secondary-fixed: '#ffdf9f'
  secondary-fixed-dim: '#ebc165'
  on-secondary-fixed: '#261a00'
  on-secondary-fixed-variant: '#5c4300'
  tertiary-fixed: '#6ffbbe'
  tertiary-fixed-dim: '#4edea3'
  on-tertiary-fixed: '#002113'
  on-tertiary-fixed-variant: '#005236'
  background: '#111416'
  on-background: '#e1e2e5'
  surface-variant: '#323537'
typography:
  headline-xl:
    fontFamily: Playfair Display
    fontSize: 36px
    fontWeight: '700'
    lineHeight: 44px
    letterSpacing: -0.01em
  headline-lg:
    fontFamily: Playfair Display
    fontSize: 28px
    fontWeight: '600'
    lineHeight: 36px
    letterSpacing: 0em
  headline-lg-mobile:
    fontFamily: Playfair Display
    fontSize: 22px
    fontWeight: '600'
    lineHeight: 30px
    letterSpacing: 0em
  headline-md:
    fontFamily: Playfair Display
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
  title-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 16px
    fontWeight: '600'
    lineHeight: 22px
  body-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 15px
    fontWeight: '400'
    lineHeight: 24px
  body-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 13px
    fontWeight: '400'
    lineHeight: 20px
  body-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 11px
    fontWeight: '400'
    lineHeight: 16px
  label-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 13px
    fontWeight: '600'
    lineHeight: 18px
    letterSpacing: 0.02em
  label-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 11px
    fontWeight: '600'
    lineHeight: 14px
    letterSpacing: 0.04em
  price-numeral:
    fontFamily: Plus Jakarta Sans
    fontSize: 18px
    fontWeight: '700'
    lineHeight: 22px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  gutter: 1rem
  margin: 1rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 0.75rem
  space-lg: 1rem
  space-xl: 1.5rem
---

## Brand & Style

This design system embodies an ultra-luxurious, regal creative platform celebrating classical Indian performing arts, music, dance, and creative disciplines through the lens of modern, high-tier fintech craft. It targets talented creators, connoisseurs, performers, and discerning patrons who expect an atmosphere of prestige, ritual honor, and seamless digital execution.

The aesthetic fuses **Classical Luxury Editorial** with **Polished Modern Skeuomorphism & Glassmorphism**:
- Deep, velvety obsidian and charcoal canvases that allow radiant warm media and classical art imagery to breathe.
- Champagne and antique royal gold illumination providing an elevated, trophy-grade aura.
- Precision hierarchy, high-legibility typographic pairing, and jewel-like actionable cards that evoke tactile excellence and institutional trust.

## Colors

The palette is engineered exclusively for an immersive dark-mode experience, drawing inspiration from classical temple bronzes, evening raga stages, and heirloom gold jewelry:

- **Primary (`#D9A441`) & Champagne Gold Variants (`#F2C76B`, `#B88628`):** Used for primary CTAs, active indicator tabs, trophies, highlight states, and critical transactional tags.
- **Obsidian Dark Surfaces:**
  - Base canvas: `#080B0D`
  - Elevated card background: `#0D1114`
  - Nested container / input fields: `#151A1E`
  - Subtle interactive state: `#191F23`
- **Text & Foreground:** Warm heirloom cream (`#F6F1E7`) serves as the primary text, avoiding harsh sterile whites. Muted secondary labels use warm mineral sand (`#9E988D` and `#706C64`).
- **Accent Tints:**
  - Success / Live badges: `#10B981` (Emerald Green)
  - Golden borders: `rgba(217, 164, 65, 0.20)`
  - Active glowing outlines: `rgba(242, 199, 107, 0.45)`

## Typography

Typography establishes an aristocratic contrast between classical poise and modern UI efficiency:

- **Playfair Display** introduces heritage, lyrical authority, and artistic gravitas. Reserved for display titles, screen headings, winner announcements, and ceremony titling.
- **Plus Jakarta Sans** delivers crisp, legible, fintech-grade utility across metadata, financial values, micro-chips, tab navigations, and contest guidelines.
- Financial figures, timers, and metrics are rendered with bold numeric weights in Plus Jakarta Sans for instant, effortless scannability.

## Layout & Spacing

A mobile-first layout strategy optimized for React Native viewport bounds, centered on high-density information architecture that never feels cramped:

- **Screen Canvas:** Mobile screens standardly utilize a 16px (`1rem`) outer margin. Tablet and desktop viewports constrain competition flows to maximum reading widths (440px on mobile shell simulators, 720px for tablet feeds, 1140px on desktop web displays).
- **Rhythm & Grid:** Built upon a standard 4px / 8px incremental scale. Vertical gap rhythms use 12px between related metadata rows, 16px between stacked contest cards, and 24px across macro screen sections.
- **Floating Controls & Safe Margins:** Fixed bottom navigation and primary action bars maintain a minimum of 16px side clearance with 24px bottom clearance (plus iOS safe area dynamic inset).

## Elevation & Depth

Visual depth relies on tonal layering combined with warm ambient auric glows rather than generic black drop shadows:

- **Base Level (Canvas):** Pure Obsidian `#080B0D`.
- **Level 1 (Card & Module Surfaces):** Charcoal `#0D1114` with a crisp 1px perimeter outline of `rgba(217, 164, 65, 0.15)`.
- **Level 2 (Active/Selected Card & Sheet Containers):** `#151A1E` bounded by `rgba(217, 164, 65, 0.3)`.
- **Ambient Gold Glow (CTAs & Floating Hero Modules):** Buttons with primary linear gradients (`#D9A441` to `#F2C76B`) cast an ambient diffuse bloom: `box-shadow: 0px 8px 24px rgba(217, 164, 65, 0.25)`.
- **Glassmorphism / Frost Elements:** Floating sticky bottom bars and header overlays use `backdrop-filter: blur(20px)` over `rgba(13, 17, 20, 0.85)` with a top border in `rgba(217, 164, 65, 0.18)`.

## Shapes

The interface balances soft organic curvature with sleek contemporary surfaces:

- **Cards & Banners:** Standardized radius of 16px to 24px (`rounded-xl` to `rounded-2xl`), evoking collectible event passes and trophy showcases.
- **Input Fields & Modal Sheets:** 12px to 14px radius for focused, tactile usability.
- **Pill Badges & Filter Chips:** Full continuous capsule radius (`9999px`) for category filters, entry fees, and registration countdown ribbons.
- **Avatar Frames:** 100% circular with 2px metallic rings (`#D9A441`).

## Components

### Buttons
- **Primary Action (CTA):** High-shine champagne gold gradient (`linear-gradient(135deg, #F2C76B 0%, #D9A441 100%)`) with obsidian dark text (`#080B0D`), bold weight, and subtle inner top-edge highlight.
- **Secondary / Outlined:** Dark charcoal surface (`#0D1114`) with a 1px border (`#D9A441`), champagne text, and soft gold hover/active states.
- **Floating Main Create/Submit Button:** Circular or pill-shaped, radiant gold center badge with subtle gold drop shadow.

### Chips & Filter Pills
- **Inactive:** Obsidian background (`#151A1E`), soft subtle gray outline, warm cream text (`#9E988D`).
- **Active:** Champagne gold fill (`#D9A441`) with dark black text (`#080B0D`) or gold border with subtle inner glow.

### Cards
- **Competition Card:** 16-20px rounded obsidian card featuring a 16:9 thumbnail preview, top-right wishlist/favorite badge, floating category tag, clear prize pool counter (`₹1,500`), entry fee tag, spot availability gauge, and gold accent borders.
- **Winner / Judge Card:** Rounded media cards with circular profile badges, gold trophy iconography, and gold name styling.

### Input Fields
- Deep charcoal background (`#151A1E`), border in `rgba(217, 164, 65, 0.2)`. On focus, transitions to gold border (`#F2C76B`) with 4px gold outer ring (`rgba(217, 164, 65, 0.15)`). Warm cream placeholder and input text.

### Badges & Status Indicators
- **Registration Open / Live:** Pill container with an emerald-green illuminated dot (`#10B981`) and matching border.
- **Featured Competition:** Golden badge with a star icon (`★ Featured`) in high-contrast gold text on dark-amber glass backing.