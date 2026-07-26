---
name: Academic Editorial Fitness
colors:
  surface: '#f8f9ff'
  surface-dim: '#d3daea'
  surface-bright: '#f8f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#eff4ff'
  surface-container: '#e6eefe'
  surface-container-high: '#e1e8f8'
  surface-container-highest: '#dbe3f2'
  on-surface: '#141c27'
  on-surface-variant: '#444748'
  inverse-surface: '#29313c'
  inverse-on-surface: '#eaf1ff'
  outline: '#747878'
  outline-variant: '#c4c7c7'
  surface-tint: '#5f5e5e'
  primary: '#000000'
  on-primary: '#ffffff'
  primary-container: '#1c1b1b'
  on-primary-container: '#858383'
  inverse-primary: '#c8c6c5'
  secondary: '#635e54'
  on-secondary: '#ffffff'
  secondary-container: '#e7dfd2'
  on-secondary-container: '#676258'
  tertiary: '#000000'
  on-tertiary: '#ffffff'
  tertiary-container: '#1c1b1a'
  on-tertiary-container: '#868382'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#e5e2e1'
  primary-fixed-dim: '#c8c6c5'
  on-primary-fixed: '#1c1b1b'
  on-primary-fixed-variant: '#474746'
  secondary-fixed: '#eae1d5'
  secondary-fixed-dim: '#cdc5ba'
  on-secondary-fixed: '#1f1b14'
  on-secondary-fixed-variant: '#4b463d'
  tertiary-fixed: '#e6e2df'
  tertiary-fixed-dim: '#cac6c4'
  on-tertiary-fixed: '#1c1b1a'
  on-tertiary-fixed-variant: '#484645'
  background: '#f8f9ff'
  on-background: '#141c27'
  surface-variant: '#dbe3f2'
typography:
  display-lg:
    fontFamily: EB Garamond
    fontSize: 48px
    fontWeight: '500'
    lineHeight: 56px
    letterSpacing: -0.02em
  display-lg-mobile:
    fontFamily: EB Garamond
    fontSize: 36px
    fontWeight: '500'
    lineHeight: 42px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: EB Garamond
    fontSize: 32px
    fontWeight: '500'
    lineHeight: 40px
  headline-sm:
    fontFamily: EB Garamond
    fontSize: 24px
    fontWeight: '500'
    lineHeight: 32px
  body-lg:
    fontFamily: Source Sans 3
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Source Sans 3
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-md:
    fontFamily: Source Sans 3
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
    letterSpacing: 0.05em
  caption:
    fontFamily: Source Sans 3
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 16px
spacing:
  unit: 4px
  gutter: 24px
  margin-mobile: 20px
  margin-desktop: 64px
  max-width: 1140px
---

## Brand & Style

This design system is built upon a foundation of quiet authority, intellectual rigor, and disciplined wellness. It avoids the aggressive, high-energy tropes of traditional fitness applications in favor of an **Academic Editorial** aesthetic. The interface should feel like a premium printed journal—a space for thoughtful reflection on physical health and long-term education.

The design movement is a blend of **Minimalism** and **Modern Editorial**. It prioritizes high-quality typography, generous whitespace, and a restrained color palette to create an atmosphere of calm focus. The user is treated as a student of their own body, navigating a curated, scholarly environment rather than a gamified app.

## Colors

The palette is strictly limited to organic, paper-inspired tones to reinforce the "printed matter" feel. 

- **Primary Text (#1A1A1A):** Used for all headlines and primary body copy to ensure maximum legibility and a classic ink-on-paper look.
- **Accent: Warm Stone (#D6CEC2):** Reserved for subtle highlights, interactive states, and call-to-action backgrounds. It should feel like a natural linen or heavy cardstock.
- **Secondary Text (#5E6673):** Utilized for metadata, captions, and secondary labels to create a clear hierarchy.
- **Surface & Background (#FAF9F7, #F3F4F6):** The warm white background provides a soft, low-strain canvas, while the light grey surfaces differentiate UI containers without introducing heavy shadows.

## Typography

Typography is the primary driver of the brand's personality. We employ a classic serif for expression and a highly legible sans-serif for utility.

- **Headlines:** Use **EB Garamond**. It should be set with slightly tighter tracking for large display sizes to mimic high-end typesetting. Ensure optical sizing is respected, emphasizing its elegant serifs.
- **Body & Interface:** Use **Source Sans 3**. This provides a functional, modern contrast to the serif headings. It is used for all instructional text, data entry, and navigation.
- **Labels:** Labels and small identifiers should be set in Source Sans 3, Uppercase, with increased letter-spacing (5%) to evoke the feeling of a scholarly index or table of contents.

## Layout & Spacing

The layout philosophy follows a **Fixed Grid** model on desktop to preserve the editorial "page" feel, transitioning to a flexible fluid model on mobile.

- **Desktop:** A 12-column grid with a maximum content width of 1140px. This ensures line lengths remain optimal for reading long-form educational fitness content.
- **Margins:** Generous outer margins (64px+) are essential to convey a premium, unhurried atmosphere. 
- **Rhythm:** Vertical spacing should be aggressive. Use large gaps between sections to allow the typography to breathe. Content groups should be separated by clear horizontal rules (#E5E7EB) rather than just whitespace, mimicking a newspaper's structure.

## Elevation & Depth

This system rejects heavy shadows and neomorphism. Depth is achieved through **Tonal Layering** and **Low-Contrast Outlines**.

- **Layers:** Use the Surface color (#F3F4F6) to define cards and distinct areas against the Background (#FAF9F7).
- **Borders:** Physicality is represented by thin (1px) borders in Light Grey (#E5E7EB). This provides a "technical drawing" or "ledger" feel.
- **Shadows:** If a shadow is absolutely necessary for a modal or popover, use a very faint, large-radius ambient shadow: `0 4px 20px rgba(26, 26, 26, 0.04)`.

## Shapes

To maintain the "Academic Editorial" rigor, the shape language is strictly **Sharp (0)**. 

Every element—including buttons, input fields, and cards—uses 0px border radii. This produces a structured, architectural, and serious appearance. Circles may only be used for functional icon containers or progress indicators (e.g., a circular "ring" chart for daily goals), but the UI framework itself remains rectangular and disciplined.

## Components

- **Buttons:** Primary buttons are Solid Soft Black (#1A1A1A) with White text. Secondary buttons are outlined in #1A1A1A. Hover states involve a shift to Warm Stone (#D6CEC2). No rounding.
- **Inputs:** Text fields are simple underlines (1px, #1A1A1A) or fully bordered boxes with #E5E7EB. Focus states use a slightly thicker #1A1A1A bottom border.
- **Cards:** Cards are defined by #F3F4F6 backgrounds or 1px #E5E7EB outlines. No shadows. Content within cards follows a strict vertical rhythm.
- **Chips/Tags:** Used for exercise categories (e.g., "STRENGTH," "HYPERTROPHY"). These are set in Label-MD typography with a Warm Stone (#D6CEC2) background.
- **Lists:** Workout lists should resemble a bibliography or a clean table of contents. Use thin horizontal dividers between items and ample vertical padding.
- **Data Visualization:** Use high-contrast line charts. Lines should be thin (1px to 2px) in #1A1A1A, avoiding fills or gradients.