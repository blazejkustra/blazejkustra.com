---
version: alpha
name: "Blazej Kustra Personal Site"
description: "Blazej Kustra Personal Site is a dark-first AI app builder landing page with a near-black (#121212) canvas, white foreground text, and a vivid blue (#245aca) accent for primary CTAs. The typographic hierarchy pairs Instrument Sans (display, tight negative tracking) for headlines with Inter (body, UI) for all supporting text. Surfaces use semi-transparent dark panels with backdrop blur, and the overall density is spacious with generous vertical rhythm. The color system is semantically rich. CSS variables define a full spectrum of support colors (red, orange, yellow, green, blue, purple, magenta) with opacity steps, suggesting a theming-ready token architecture."
colors:
  accent-blue: "#245aca"
  background-base: "#121212"
  surface-panel: "#282828"
  surface-well: "#080808"
  text-secondary: "#999999"
  text-tertiary: "#666666"
  foreground-white: "#ffffff"
  border-primary: "#ffffff"
  border-separator: "#ffffff"
typography:
  display-xl:
    fontFamily: "Instrument Sans"
    fontSize: "48px"
    fontWeight: "500"
    lineHeight: "52.8px"
    letterSpacing: "-1.2px"
  display-l:
    fontFamily: "Instrument Sans"
    fontSize: "44px"
    fontWeight: "500"
    lineHeight: "48.4px"
    letterSpacing: "-1.1px"
  display-m:
    fontFamily: "Instrument Sans"
    fontSize: "30px"
    fontWeight: "500"
    lineHeight: "37.5px"
    letterSpacing: "-0.75px"
  body-base:
    fontFamily: "Inter"
    fontSize: "16px"
    fontWeight: "400"
    lineHeight: "24px"
  body-large:
    fontFamily: "Inter"
    fontSize: "18px"
    fontWeight: "400"
    lineHeight: "29.25px"
  body-relaxed:
    fontFamily: "Inter"
    fontSize: "16px"
    fontWeight: "400"
    lineHeight: "26px"
  ui-medium:
    fontFamily: "Inter"
    fontSize: "20px"
    fontWeight: "500"
    lineHeight: "28px"
  label-small:
    fontFamily: "Inter"
    fontSize: "14px"
    fontWeight: "500"
    lineHeight: "14px"
    letterSpacing: "0.2px"
  body-small:
    fontFamily: "Inter"
    fontSize: "14px"
    fontWeight: "400"
    lineHeight: "20px"
  caption:
    fontFamily: "Inter"
    fontSize: "12px"
    fontWeight: "400"
    lineHeight: "16.2px"
rounded:
  radius-pill: "999px"
  radius-card: "26px"
  radius-badge: "18px"
spacing:
  spacing-1: "4px"
  spacing-2: "6px"
  spacing-3: "8px"
  spacing-4: "10px"
  spacing-5: "12px"
  spacing-6: "14px"
  spacing-7: "16px"
  spacing-8: "20px"
  spacing-9: "24px"
  spacing-10: "32px"
  spacing-11: "48px"
  spacing-12: "56px"
  spacing-13: "72px"
  spacing-14: "96px"
  spacing-15: "144px"
  spacing-16: "256px"
---

## Overview

Blazej Kustra Personal Site is a dark-first AI app builder landing page with a near-black (#121212) canvas, white foreground text, and a vivid blue (#245aca) accent for primary CTAs. The typographic hierarchy pairs Instrument Sans (display, tight negative tracking) for headlines with Inter (body, UI) for all supporting text. Surfaces use semi-transparent dark panels with backdrop blur, and the overall density is spacious with generous vertical rhythm. The color system is semantically rich. CSS variables define a full spectrum of support colors (red, orange, yellow, green, blue, purple, magenta) with opacity steps, suggesting a theming-ready token architecture.

**Signature traits:**
- Dual typeface system: Pairs Instrument Sans and Inter across the type hierarchy.
- Soft, rounded geometry: Generous corner rounding up to 999px.
- Single-accent color discipline: A neutral-led palette reserves #245aca as the lone accent.
- Layered elevation: Depth comes from 1 validated shadow token.

## Colors

The palette uses 9 validated color tokens across 1 theme profile. Semantic roles stay attached to observed usage so generation agents can choose accents without inventing new color meaning.

**Semantic naming:**
- **surface-background** maps to `background-base`: Role "background" is grounded by usage context "Page-level canvas background, mapped to --bg CSS variable".
- **action-text** maps to `foreground-white`: Role "text" is grounded by usage context "Primary text, nav links, headings, button labels — highest frequency color (331 hits)".
- **action-primary** maps to `accent-blue`: Role "primary" is grounded by usage context "Primary CTA button fill (Download), link accent, interactive highlights".
- **border-border** maps to `border-separator`: Role "border" is grounded by usage context "Subtle dividers and hairlines at 10% white opacity".

### Primary Brand
- **Accent Blue** (#245aca): Primary CTA button fill (Download), link accent, interactive highlights. Role: primary.

### Text Scale
- **Foreground White** (#ffffff): Primary text, nav links, headings, button labels — highest frequency color (331 hits). Role: text.

### Interactive
- **Border Primary** (#ffffff): Primary border at 20% white opacity for outlined buttons and card edges. Role: border. {authored: #ffffff33, alpha: 0.2}
- **Border Separator** (#ffffff): Subtle dividers and hairlines at 10% white opacity. Role: border. {authored: #ffffff1a, alpha: 0.102}

### Surface & Shadows
- **Background Base** (#121212): Page-level canvas background, mapped to --bg CSS variable. Role: background.
- **Surface Panel** (#282828): Semi-transparent panel surfaces with 94% opacity, used for floating cards and nav backdrop. Role: background.
- **Surface Well** (#080808): Deep surface variant for footer and well areas. Role: background.
- **Text Secondary** (#999999): Secondary body text at 60% white mixed into background — subtitles, captions. Role: background.
- **Text Tertiary** (#666666): Tertiary/muted text at 40% white mixed into background — metadata, disclaimers. Role: background.

## Typography

Typography uses Instrument Sans, Inter across extracted hierarchy roles. Keep hierarchy mapped to these token rows before adding decorative type styles.

Mixes Instrument Sans and Inter for visual contrast. Weight range spans medium, regular. Sizes range from 12px to 48px.

### Font Roles
- **Headline Font**: Inter
- **Body Font**: Inter

### Type Scale Evidence
| Role | Font | Size | Weight | Line Height | Letter Spacing | Stack / Features | Notes |
|------|------|------|--------|-------------|----------------|------------------|-------|
| Hero headline — largest display text on the page | Instrument Sans | 48px | 500 | 52.8px | -1.2px | Instrument Sans, sans-serif | Extracted token |
| Section headline — large display text for major sections | Instrument Sans | 44px | 500 | 48.4px | -1.1px | Instrument Sans, sans-serif | Extracted token |
| Sub-section headline or card title in display style | Instrument Sans | 30px | 500 | 37.5px | -0.75px | Instrument Sans, sans-serif | Extracted token |
| Primary body copy, nav items, general UI text — most frequent (151 hits) | Inter | 16px | 400 | 24px | normal | Inter, sans-serif | Extracted token |
| Hero subtitle / lead paragraph text | Inter | 18px | 400 | 29.25px | normal | Inter, sans-serif | Extracted token |
| Slightly looser body text for longer reading passages | Inter | 16px | 400 | 26px | normal | Inter, sans-serif | Extracted token |
| Card titles, feature headings, medium-weight UI labels | Inter | 20px | 500 | 28px | normal | Inter, sans-serif | Extracted token |
| Uppercase-style labels, badge text, small caps UI | Inter | 14px | 500 | 14px | 0.2px | Inter, sans-serif | Extracted token |
| Secondary body text, captions, metadata | Inter | 14px | 400 | 20px | normal | Inter, sans-serif | Extracted token |
| Fine print, disclaimers, system requirement notes | Inter | 12px | 400 | 16.2px | normal | Inter, sans-serif | Extracted token |

## Layout

Responsive system uses 1 breakpoint tier(s): desktop.

This system uses a 4px base grid with scale values 1, 1.5, 2, 2.5, 3, 3.5, 4, 5, 6, 8, 12, 14, 18, 24, 36, 64, 76, 96.

### Responsive Strategy
- **desktop (Unknown)**: Expand layout density and horizontal composition for wide viewports.

### Spacing System
| Token | Value | Px | Notes |
|------|-------|----|-------|
| spacing-1 | 4px | 4 | Extracted spacing token |
| spacing-2 | 6px | 6 | Extracted spacing token |
| spacing-3 | 8px | 8 | Extracted spacing token |
| spacing-4 | 10px | 10 | Extracted spacing token |
| spacing-5 | 12px | 12 | Extracted spacing token |
| spacing-6 | 14px | 14 | Extracted spacing token |
| spacing-7 | 16px | 16 | Extracted spacing token |
| spacing-8 | 20px | 20 | Extracted spacing token |
| spacing-9 | 24px | 24 | Extracted spacing token |
| spacing-10 | 32px | 32 | Extracted spacing token |
| spacing-11 | 48px | 48 | Extracted spacing token |
| spacing-12 | 56px | 56 | Extracted spacing token |
| spacing-13 | 72px | 72 | Extracted spacing token |
| spacing-14 | 96px | 96 | Extracted spacing token |
| spacing-15 | 144px | 144 | Extracted spacing token |
| spacing-16 | 256px | 256 | Extracted spacing token |
| spacing-17 | 304px | 304 | Extracted spacing token |
| spacing-18 | 384px | 384 | Extracted spacing token |

## Elevation & Depth

Keep depth flat unless validated shadow or interaction evidence appears in the extraction payload. Do not invent shadows beyond this evidence boundary.

### Shadow Evidence
| Shadow Token | Layers | Details |
|--------------|--------|---------|
| glow-white-subtle | 1 | 0px 0px 20px 0px rgba(255, 255, 255, 0.06) |

### Interaction Signals
| Theme | Signal | Evidence |
|-------|--------|----------|
| Light | backdrop-filter | blur(12px) saturate(1.8) |
| Light | outline-color | rgb(255, 255, 255) ; color(srgb 0.442353 0.442353 0.442353) ; color(srgb 0.628235 0.628235 0.628235) |
| Light | outline-width | 3px |
| Light | outline-offset | 0px |
| Light | transform | matrix(1, 0, 0, 1, 0, 0) |

## Shapes

Shape language maps directly to rounded tokens. Keep component corners consistent with the role mapping below before introducing bespoke geometry.

### Radius Roles
| Token | Value | Px | Role Mapping |
|------|-------|----|--------------|
| radius-badge | 18px | 18 | Card corner |
| radius-card | 26px | 26 | Large surface corner |
| radius-pill | 999px | 999 | Large surface corner |

### Geometry Evidence
| Radius Token | Shape | Units |
|--------------|-------|-------|
| radius-pill | 999px | px |
| radius-card | 26px | px |
| radius-badge | 18px | px |

## Components

(none detected)

## Do's and Don'ts

Guardrails protect Dual typeface system, Soft, rounded geometry, Single-accent color discipline without adding unsupported visual claims.

| Do | Don't |
|----|---------|
| Do maintain consistent spacing using the base grid | Don't make unsupported claims about absent visual features |
| Do maintain WCAG AA contrast ratios (4.5:1 for normal text) | Don't mix rounded and sharp corners in the same view |
| Do use the primary color only for the single most important action per screen |  |
| Do verify evidence before writing new design-system guidance |  |

## Responsive Evidence

### Breakpoints
| Name | Width | Key Changes |
|------|-------|-------------|
| Breakpoint 1 | Unknown | (prefers-reduced-motion: reduce) |

## Agent Prompt Guide

### Example Component Prompts
- Create button component using validated primary color role and spacing tokens.
- Create card component with mapped radius role and evidence-backed elevation.
- Create form input component using inferred typography hierarchy and border roles.

### Iteration Guide
1. Start with extracted palette and typography roles only.
2. Map spacing and radius directly from token tables before visual polish.
3. Apply component patterns one section at a time and compare against source intent.
4. Keep elevation claims tied to explicit evidence in output.
5. Iterate with smallest diffs and re-check section hierarchy after each change.
