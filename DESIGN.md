---
name: Life Navigator
description: A calm, source-aware planning companion that turns a life event into a clear next-step route.
colors:
  paper: "#f7f3ea"
  paper-deep: "#eee9de"
  surface: "#fffdf8"
  ink: "#17211d"
  muted: "#5e675f"
  line: "#d6d0c3"
  green: "#174c3b"
  green-soft: "#dce9df"
  amber: "#b66016"
  amber-soft: "#f8e5ce"
typography:
  display:
    fontFamily: "Georgia, Times New Roman, serif"
    fontSize: "clamp(3.2rem, 6.3vw, 6.1rem)"
    fontWeight: 600
    lineHeight: 0.93
    letterSpacing: "-0.07em"
  body:
    fontFamily: "Arial, Helvetica, sans-serif"
    fontWeight: 400
  label:
    fontFamily: "Arial, Helvetica, sans-serif"
    fontSize: "0.72rem"
    fontWeight: 800
    letterSpacing: "0.105em"
rounded:
  control: "10px"
  card: "17px"
  prominent-card: "21px"
  pill: "999px"
spacing:
  compact: "8px"
  control: "12px"
  card: "20px"
  spacious: "28px"
components:
  button-primary:
    backgroundColor: "{colors.green}"
    textColor: "#ffffff"
    rounded: "{rounded.pill}"
    padding: "11px 19px"
    height: "46px"
  button-primary-hover:
    backgroundColor: "#0e392c"
  button-secondary:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    rounded: "{rounded.control}"
    padding: "9px 13px"
    height: "44px"
  card-surface:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    rounded: "{rounded.card}"
    padding: "20px"
---

# Design System: Life Navigator

## 1. Overview

**Creative North Star: "The Guided Route Companion"**

Life Navigator feels like a calm, intelligent companion beside someone facing a meaningful life change. It uses editorial scale and generous paper-like space to make the first step feel approachable, then gives the validated roadmap a clear, deliberate visual hierarchy. The interface is warm rather than clinical, but never casual about the distinction between planning support and an official determination.

Conversation is the input mechanism, not the product destination. The visible route is the product artifact: a structured, source-aware sequence that becomes clearer as validated context arrives. Warm ivory surfaces, dark ink type, restrained forest green, and quiet linework create a composed sense of direction without borrowing third-party branding or drifting into a generic AI dashboard.

**Key Characteristics:**

- Editorial and calm, with serif display moments reserved for major orientation points.
- Structured chat that keeps the current question focused and the route visibly primary.
- Sparse, tactile surfaces with hairline borders and ambient—not theatrical—elevation.
- One original route-and-north-star mark, used as a trustworthy navigation cue.

## 2. Colors

The palette is paper, ink, and a single wayfinding green; amber is reserved for meaningful change, never decoration.

### Primary

- **Wayfinding Forest**: primary action, active route, completed indicators, focus-adjacent accents, and links. It must remain the only dominant accent on a screen.
- **Soft Canopy**: quiet green confirmation and adjusted-state background; never a substitute for a text status label.

### Tertiary

- **Measured Amber**: new or current-change emphasis only. Pair it with explicit labels such as “New” or “Updated”; colour may not carry the meaning by itself.
- **Soft Amber**: a low-intensity companion surface for the same state.

### Neutral

- **Warm Paper**: the page canvas and base layer.
- **Deep Paper**: a subtle lower-contrast inset or tonal boundary.
- **Clear Surface**: cards, inputs, and reading surfaces.
- **Route Ink**: primary readable text and strong headings.
- **Quiet Ink**: explanatory and supporting text.
- **Hairline Stone**: all standard borders, dividers, and route scaffolding.

**The One Accent Rule.** Forest green is a navigational signal, not a decorative fill. It should occupy a small portion of a view; amber is used only when a validated route change needs attention.

## 3. Typography

**Display Font:** Georgia (with Times New Roman and serif fallbacks)
**Body Font:** Arial (with Helvetica and sans-serif fallbacks)
**Label Font:** Arial (with Helvetica and sans-serif fallbacks)

**Character:** The display face gives major orientation statements a human, editorial gravity. The sans-serif body stays deliberately plain and highly legible so actions, source metadata, and task states remain easy to scan.

### Hierarchy

- **Display** (600, `clamp(3.2rem, 6.3vw, 6.1rem)`, 0.93): landing, intro, and high-level plan orientation only. Use the tight tracking token exactly; do not use it for task details.
- **Headline** (600, `clamp(2rem, 3.4vw, 3.2rem)`, compact): route and feature-level headings.
- **Title** (750–780, 1.18–1.5rem, compact): questions, task titles, and detail-drawer titles.
- **Body** (400, 0.84–1.13rem, 1.4–1.55): instructions, task summaries, source context, and boundaries. Keep explanatory copy concise.
- **Label** (800, 0.70–0.76rem, 0.08–0.105em, uppercase): screen kickers, timing lanes, metadata, and compact state markers.

**The Two Voices Rule.** Serif establishes emotional orientation; sans-serif delivers decisions and evidence. Do not introduce a third display voice, a novelty mono face, or oversized prose inside task cards.

## 4. Elevation

Life Navigator uses a hybrid of hairline boundaries and soft ambient lift. Most structure comes from paper-toned surfaces and `1px` stone borders; shadows identify interactive or significant containers without making the UI feel like stacked dashboard tiles.

### Shadow Vocabulary

- **Ambient Card** (`0 18px 46px rgba(44, 39, 30, .09)`): prominent input, question, confirmation, and major route surfaces.
- **Quiet Card** (`0 10px 24px rgba(39, 33, 26, .055)`): individual roadmap task cards.
- **Micro Lift** (`0 5px 14px rgba(35, 30, 24, .06)`): small route nodes and compact notices.
- **Drawer Depth** (`-14px 0 38px rgba(28, 25, 19, .14)`): task-details drawer only, paired with a restrained backdrop.

**The Quiet Depth Rule.** Shadows are diffuse and warm. If a shadow becomes the first thing the eye notices, remove it or reduce it; borders and tonal contrast should still explain the layout with shadows disabled.

## 5. Components

### Buttons

Buttons are tactile and decisive, never loud.

- **Shape:** primary actions are full pills (`999px`); reply, answer, and progress controls use compact rounded rectangles (`10–12px`).
- **Primary:** Wayfinding Forest with white text, `46px` minimum height, and `11px 19px` padding. Hover darkens to the defined deep green and lifts only `-1px`.
- **Secondary:** transparent warm-paper treatment with a stone border; use for answers, suggested prompts, and lower-emphasis actions.
- **Focus:** use the visible `3px` amber outline with `3px` offset. Every touch target is at least `44px` high.

### Chips

Chips are evidence and context labels, not navigation chrome.

- **Style:** compact, stone-bordered, low-contrast paper surfaces with `999px` radius for source and state metadata.
- **State:** task-change labels always combine the chip colour with text such as “New” or “Updated”; local progress remains labelled in words.

### Cards / Containers

Cards are quiet paper surfaces that prioritize readable action.

- **Corner Style:** `17–24px` for major cards; `12–14px` for compact content.
- **Background:** Clear Surface on Warm Paper, with a Hairline Stone border. Use Wayfinding Forest borders only for primary input and intentional active states.
- **Shadow Strategy:** Ambient Card for major input/question surfaces, Quiet Card for task cards, otherwise flat.
- **Internal Padding:** `20px` baseline; prominent input cards may use `25–28px` horizontal insets.

### Inputs / Fields

Inputs should read as an invitation to state what changed, not as an enterprise form.

- **Style:** clear or transparent surface, no boxed-in field chrome inside the input card, and a forest-green baseline for the main composer.
- **Focus:** visible global amber outline; never rely only on a changed border colour.
- **Error / Disabled:** error text uses the existing muted rust tone and stays adjacent to the control; do not invent a red system or hide an error in placeholder text.

### Navigation

The brand mark is a continuous route ending at a north-star cue. It appears in the header and empty/loading orientation states as an original Life Navigator mark, never as a borrowed AI-brand symbol.

### Route Timeline and Task Details

The route is the signature component.

- **Route:** a vertical stone connector with forest-outlined nodes, timing/group headings, concise summaries, and explicit current/new/updated labels.
- **Task inspection:** opens a focused drawer on larger screens and a bottom sheet on smaller screens. The detail view separates what to do, why it appears, timing and verification, sources, and the planning-only boundary.
- **Conversation:** assistant cards are light surfaces; user answers are forest-green. Older messages may scroll away so the active question stays present.

## 6. Do's and Don'ts

### Do:

- **Do** make the validated roadmap visibly primary once planning begins; keep the current question and route in a strong two-pane desktop composition, then stack them deliberately on small screens.
- **Do** use Warm Paper, Clear Surface, Route Ink, and Wayfinding Forest as the default visual vocabulary; keep forest green rare enough to retain navigational meaning.
- **Do** use the serif display style only for orientation headlines and the sans-serif for questions, task summaries, evidence, and boundaries.
- **Do** preserve `44px` minimum interactive targets, the `3px` visible focus outline, semantic controls, reduced-motion alternatives, and text labels alongside all colour-coded states.
- **Do** render source, timing, verification, and change explanations only from validated catalog/compiler data.

### Don't:

- **Don't** make the experience wizard-like or wiki-like, or present heavy data on every screen; the interaction should feel chat-like while remaining structured and purposeful.
- **Don't** turn chat into a generic transcript or chatbot. Conversation gathers only decision-changing context; the route remains the product artifact.
- **Don't** add gradients, neon, glassmorphism, particles, stock imagery, emoji decoration, coloured card sidebars, or generic feature-grid marketing patterns.
- **Don't** introduce a second accent palette, purple AI gradients, terminal/cyberpunk motifs, or borrowed OpenAI logos, marks, product names, or affiliation language.
- **Don't** use colour alone for “new,” “updated,” verification, or local progress; pair each with clear text.
- **Don't** turn timing lanes into personal deadlines or use the UI to imply eligibility, policy outcomes, legal advice, medical advice, or official determinations.
