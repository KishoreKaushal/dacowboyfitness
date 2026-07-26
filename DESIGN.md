---
name: DaCowboy Fitness
colors:
  surface: '#141313'
  surface-dim: '#141313'
  surface-bright: '#3a3939'
  surface-container-lowest: '#0e0e0e'
  surface-container-low: '#1c1b1b'
  surface-container: '#201f1f'
  surface-container-high: '#2a2a2a'
  surface-container-highest: '#353434'
  on-surface: '#e5e2e1'
  on-surface-variant: '#c4c7c8'
  inverse-surface: '#e5e2e1'
  inverse-on-surface: '#313030'
  outline: '#8e9192'
  outline-variant: '#444748'
  surface-tint: '#c6c6c7'
  primary: '#ffffff'
  on-primary: '#2f3131'
  primary-container: '#e2e2e2'
  on-primary-container: '#636565'
  inverse-primary: '#5d5f5f'
  secondary: '#c6c6cf'
  on-secondary: '#2f3037'
  secondary-container: '#45464e'
  on-secondary-container: '#b4b4bd'
  tertiary: '#ffffff'
  on-tertiary: '#2f3131'
  tertiary-container: '#e2e2e2'
  on-tertiary-container: '#636565'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#e2e2e2'
  primary-fixed-dim: '#c6c6c7'
  on-primary-fixed: '#1a1c1c'
  on-primary-fixed-variant: '#454747'
  secondary-fixed: '#e2e1eb'
  secondary-fixed-dim: '#c6c6cf'
  on-secondary-fixed: '#1a1b22'
  on-secondary-fixed-variant: '#45464e'
  tertiary-fixed: '#e2e2e2'
  tertiary-fixed-dim: '#c6c6c7'
  on-tertiary-fixed: '#1a1c1c'
  on-tertiary-fixed-variant: '#454747'
  background: '#141313'
  on-background: '#e5e2e1'
  surface-variant: '#353434'
typography:
  display-lg:
    fontFamily: ebGaramond
    fontSize: 48px
    fontWeight: '500'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  display-lg-mobile:
    fontFamily: ebGaramond
    fontSize: 36px
    fontWeight: '500'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  headline-md:
    fontFamily: ebGaramond
    fontSize: 32px
    fontWeight: '400'
    lineHeight: '1.2'
  body-lg:
    fontFamily: geist
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
    letterSpacing: -0.01em
  body-md:
    fontFamily: geist
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
  label-sm:
    fontFamily: jetbrainsMono
    fontSize: 12px
    fontWeight: '500'
    lineHeight: '1.0'
    letterSpacing: 0.05em
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  unit: 4px
  container-max: 1200px
  gutter: 24px
  margin-desktop: 64px
  margin-mobile: 20px
---

## Brand & Style

The design system is built for a singular, independent voice in the fitness space. It rejects the loud, frantic energy of traditional fitness apps in favor of a quiet, methodical, and premium editorial experience. The identity is rooted in "First Principles"—stripping away noise to focus on the essential physics of movement and biology.

The visual style is a blend of **Glassmorphism** and **Minimalism**, heavily influenced by the precision of modern technology brands. It utilizes a deep "Obsidian" dark mode where depth is communicated through light and translucency rather than heavy shadows. The emotional response should be one of calm focus, high-end craftsmanship, and intellectual clarity.

## Colors

The palette is strictly monochromatic with a single functional accent.
- **Surface (Obsidian):** The base is an almost-black `#0A0A0A`. This provides a high-end, cinematic canvas that reduces eye strain.
- **Primary (Pure White):** Used for maximum contrast in typography and essential actions.
- **Secondary (Muted Silver):** Used for secondary information and de-prioritized UI elements to maintain hierarchy.
- **Accents:** A surgical use of vibrant blue or deep slate is permitted only for data visualization or specific progress indicators.
- **Glass:** Background blurs use a 10% white overlay with a 20px - 40px blur radius to create a sense of physical layering.

## Typography

The typography strategy creates an "Editorial Modernist" feel.
- **Headlines:** Use **EB Garamond**. It provides a literary, timeless authority that feels personal and considered. Tracking should be slightly tightened for large displays.
- **Body:** Use **Geist**. This provides a technical, precise, and highly legible contrast to the serif headings, evoking a "developer-mindset" applied to fitness.
- **Labels/Meta:** Use **JetBrains Mono**. For technical data (reps, sets, weight, timestamps), the monospaced font reinforces the "first principles" and data-driven nature of the platform.

## Layout & Spacing

This design system employs a **Fixed Grid** philosophy for desktop to maintain an editorial, magazine-like feel, and a fluid approach for mobile. 
- **Rhythm:** All spacing is derived from a 4px baseline.
- **Negative Space:** Use generous margins (64px+) between major sections to allow the content to "breathe," mirroring the mental clarity the brand promotes.
- **Breakpoints:**
  - **Desktop (1200px+):** 12-column grid, 24px gutters, wide side margins.
  - **Tablet (768px - 1199px):** 8-column grid, 20px gutters.
  - **Mobile (Under 768px):** 4-column grid, 16px gutters, 20px side margins.

## Elevation & Depth

Depth is achieved through **Tonal Layering** and **Glassmorphism**, avoiding traditional drop shadows.
- **Level 0 (Base):** `#0A0A0A` — The void.
- **Level 1 (Subtle Lift):** A 1px solid border at 10% white opacity. This defines the shape without adding visual weight.
- **Level 2 (Active/Floating):** Use a background blur (Backdrop Filter) with a subtle inner glow (top-down 1px white stroke at 15% opacity).
- **Interactions:** When an element is pressed, it should subtly shrink (scale 0.98) and increase in opacity, rather than moving "up" in space.

## Shapes

The shape language is precise and disciplined. 
- **Corner Radii:** Use a "Soft" (0.25rem) approach for most components. This provides just enough friendliness to feel modern without losing the professional, "engineered" edge of sharp corners.
- **Interactive Elements:** Buttons and input fields should strictly follow the `rounded-md` (0.25rem) or `rounded-lg` (0.5rem) tokens. 
- **Large Containers:** Cards and educational modules use `rounded-xl` (0.75rem) to softly frame long-form content.

## Components

- **Buttons:** Primary buttons are solid white with black text. Secondary buttons are transparent with a 1px white border (15% opacity). No heavy shadows.
- **Cards:** Background is a subtle gradient from `#161616` to `#0A0A0A` or a glass blur. Borders are 1px wide, `#FFFFFF` at 10% opacity.
- **Inputs:** Minimalist bottom-border only, or a fully enclosed box with a 5% white fill. The focus state is a clean 1px white outline.
- **Progress Bars:** Thin (2px - 4px) lines. Completed segments are pure white; background track is 10% white.
- **Chips:** Small, monospaced labels (JetBrains Mono) inside a subtle bordered container for tagging muscle groups or equipment.
- **Data Visualization:** Use "Nothing OS" inspired dot-matrix patterns or thin, precise line graphs to display fitness metrics.