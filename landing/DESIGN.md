---
name: Suniye landing
description: Warm Hindi reading guidance with the native app's cream and teal identity
colors:
  paper: "#fff9ef"
  ink: "#18332f"
  teal: "#0b5d53"
  teal-dark: "#07483f"
  muted: "#4d6259"
  line: "#ced8ca"
  ochre: "#efc76c"
  soft: "#f1f0e5"
typography:
  display:
    fontFamily: '"Kohinoor Devanagari", "Noto Sans Devanagari", Mangal, Manrope, system-ui, sans-serif'
    fontSize: "clamp(3.1rem, 5.9vw, 5.5rem)"
    fontWeight: 700
    lineHeight: 1.38
    letterSpacing: "-0.025em"
  headline:
    fontSize: "clamp(2.1rem, 3.8vw, 3.55rem)"
    fontWeight: 700
    lineHeight: 1.45
  title:
    fontSize: "1.5rem"
    fontWeight: 700
    lineHeight: 1.55
  body:
    fontFamily: '"Kohinoor Devanagari", "Noto Sans Devanagari", Mangal, Manrope, system-ui, sans-serif'
    fontSize: "1.125rem"
    fontWeight: 400
    lineHeight: 1.85
rounded:
  control: "12px"
  phone-frame: "31px"
  phone-image: "24px"
spacing:
  control-gap: "12px"
  section-mobile: "54px"
  section-desktop: "88px"
components:
  button-primary:
    backgroundColor: "{colors.teal}"
    textColor: "{colors.paper}"
    rounded: "{rounded.control}"
    padding: "13px 22px"
  button-primary-hover:
    backgroundColor: "{colors.teal-dark}"
  button-secondary:
    textColor: "{colors.teal}"
    rounded: "{rounded.control}"
    padding: "13px 22px"
  button-download:
    backgroundColor: "{colors.ochre}"
    textColor: "{colors.ink}"
    rounded: "{rounded.control}"
    padding: "13px 22px"
---

# Design System: Suniye landing

## Overview

**Creative North Star: "A family reading guide"**

The native app's warm paper and deep teal define this dedicated web surface. Large Hindi type, calm spacing and real native captures make reading and listening approachable. This document records the landing implementation; it does not change the Android design system.

**Key Characteristics:**

- Hindi first, with restrained Latin labels.
- Flat tonal regions, light rules and unchanged native screenshots.
- Deliberate audio controls with a reachable Stop and visible focus.

## Colors

### Primary

Deep teal owns actions, spoken content and the final download region. Its darker companion signals hover and active playback.

### Secondary

Warm ochre identifies the source amount and the download action. It also provides visible focus on teal.

### Neutral

Cream paper is the page ground; deep green ink is the main reading color. Muted green supports captions, and pale green rules and soft regions separate content without decoration.

## Typography

Hindi uses the established native fallback stack because no redistributable Hindi font was supplied and the brief disallows downloads. Latin uses the existing locally licensed Manrope variable font. This is a project-specific approved fallback, not a rule for unrelated work.

The frontmatter records desktop roles. At 700px, body becomes 1.0625rem and the display becomes clamp(2.45rem, 9.2vw, 3.6rem). Comfortable Hindi leading and rem-based body/control text preserve enlarged-text readability. Amounts use tabular numerals; headlines balance their lines.

## Layout

The content container caps at 1160px, with 48px side gutters on wide screens, 32px below 1000px and 20px below 700px. Reading sections use 88px vertical spacing on desktop and 54px on mobile. Desktop columns become a single reading sequence on mobile. Navigation wraps visibly. The release ledger scrolls within its own labelled table container.

## Elevation & Depth

No shadows. Tonal regions, divider rules and the dark frame around genuine screenshots create separation. Native screenshots remain unchanged.

## Shapes

Controls have gently curved corners. Phone frames follow the native image silhouette. Main reading regions remain rectangular; the page uses no floating feature-card grid.

## Components

Buttons have a minimum 56px height; navigation and text controls have a minimum 48px height. Focus uses a 3px outline with a 5px offset, teal on paper and ochre on teal. Hover changes color or underline thickness without moving the layout.

The listening panel pairs an ochre original amount with a teal spoken amount. Play, Slow and Stop expose pending, playing, stopped, finished and failed states in Hindi. Native audio controls remain usable when JavaScript is disabled. A 240ms ease-out color transition indicates playback; reduced motion removes transitions and smooth scrolling.

The version ledger is a native details element and semantic table. Disclosure, footer and main navigation retain normal keyboard behavior.

## Do's and Don'ts

- Do preserve the app's cream and teal identity and unchanged screenshots.
- Do keep source text adjacent to speech and control states understandable in Hindi.
- Do keep keyboard focus, native fallbacks and reduced motion visible in new page work.
- Don't invent family testimonials, model proof or release outcomes as decoration.
- Don't add heavy 3D, remote fonts or autoplay to this landing surface.

The Impeccable playbooks informed this implementation. Local context/concept tooling was unavailable; verification.md records the direct files read and the bounded review evidence. This final token record refreshes the provisional DESIGN.md authored in this same task, within the delegated documentation scope.
