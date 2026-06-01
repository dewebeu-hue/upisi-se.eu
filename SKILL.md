---
name: premium-product-ui
description: Use this skill whenever creating, redesigning, polishing, implementing, or reviewing application UI/UX, frontend screens, design systems, dashboards, SaaS interfaces, mobile/web app layouts, onboarding, navigation, forms, landing pages, or product flows. The skill helps Codex produce premium, modern, usable, scalable digital product interfaces inspired by top product-design standards without copying any specific agency or brand.
---

# Premium Product UI/UX Skill

## Purpose

Use this skill to design, implement, improve, or review digital product interfaces at a premium product-agency quality bar.

This skill is universal. It must work across future projects, including SaaS products, marketplaces, dashboards, mobile apps, web apps, internal tools, landing pages, onboarding flows, and admin systems.

The design benchmark is a blend of:

- **Work & Co**: product strategy, structured flows, polished product execution, design and engineering working together.
- **MetaLab**: clean modern app UI, strong SaaS/startup sensibility, simple and confident interfaces.
- **IDEO**: human-centered thinking, user needs, usability, research-informed design choices.
- **frog**: scalable enterprise UX, systems thinking, consistency across complex products.

Do not copy any agency’s style, case studies, brand, or visual identity. Treat them only as quality references.

---

## When to use this skill

Use this skill when the task involves any of the following:

- Creating a new app interface
- Redesigning an existing app
- Improving frontend UI
- Creating or extending a design system
- Building dashboards, admin panels, SaaS screens, mobile screens, onboarding, navigation, forms, settings, profiles, search, filters, cards, lists, tables, modals, landing pages, or product flows
- Making an interface feel more premium, polished, modern, clean, usable, trustworthy, elegant, or “world-class”
- Reviewing UI/UX quality
- Turning rough product requirements into frontend screens
- Improving responsiveness, accessibility, hierarchy, spacing, typography, or component consistency

---

## Core design philosophy

Design like a product team, not like a decorator.

Prioritize:

1. **Product clarity**
   - What is this product?
   - Who is it for?
   - What job is the user trying to complete?
   - What is the primary action?
   - What should the user understand in the first five seconds?

2. **UX structure**
   - Define the user flow before styling screens.
   - Reduce unnecessary steps.
   - Make navigation predictable.
   - Make primary actions obvious.
   - Make forms easy to complete.
   - Make empty, loading, success, and error states useful.

3. **Visual hierarchy**
   - One clear primary focus per screen.
   - Strong title/subtitle/action structure.
   - Clear grouping of related elements.
   - Consistent spacing and alignment.
   - Avoid visual noise.

4. **Design system thinking**
   - Use consistent typography, spacing, radius, borders, shadows, colors, and states.
   - Prefer reusable components over one-off styling.
   - Create tokens where useful.
   - Respect existing project conventions.

5. **Premium restraint**
   - Avoid overdecorating.
   - Avoid generic template aesthetics.
   - Avoid random gradients, excessive shadows, inconsistent spacing, and weak contrast.
   - Use motion, color, and illustration only when they improve comprehension or brand feeling.

6. **Engineering realism**
   - Inspect the existing codebase before changing UI.
   - Reuse existing components where possible.
   - Keep implementation maintainable.
   - Avoid unnecessary dependencies.
   - Ensure responsive behavior.
   - Run available checks after changes.

---

## First-pass product understanding

Before making substantial UI changes, infer or ask for the following when needed:

- Product type: SaaS, marketplace, content app, mobile app, dashboard, internal tool, landing page, etc.
- Target users
- Main user jobs
- Business goal
- Platform: desktop web, responsive web, mobile, tablet, native app, admin, public site
- Brand personality
- Existing visual style
- Existing component system
- Tech stack
- Accessibility requirements
- Any hard constraints

When the user has not provided enough context, make reasonable assumptions and state them briefly.

---

## UI direction framework

For every UI task, establish a design direction using this structure:

### Product position

Describe the interface as one of these or a combination:

- Premium and editorial
- Clean and SaaS-like
- Friendly and consumer-focused
- Dense and power-user-oriented
- Calm and trustworthy
- Energetic and growth-oriented
- Enterprise-grade and scalable
- Minimal and utility-first

### Experience principles

Choose 3–5 principles such as:

- Clear first action
- Fewer decisions per screen
- Progressive disclosure
- Fast scanning
- Trust through transparency
- Calm visual system
- Powerful but not overwhelming
- Designed states, not only happy paths

### Visual principles

Define:

- Typography hierarchy
- Spacing rhythm
- Layout grid
- Color/token approach
- Component density
- Border/radius/shadow style
- Icon usage
- Motion usage
- Responsive behavior

---

## Implementation rules

When modifying code:

1. Inspect existing files first:
   - component library
   - global CSS
   - theme tokens
   - layout components
   - package manager
   - framework conventions
   - routing structure

2. Reuse before creating:
   - Use existing components and patterns when they are good enough.
   - Extend components instead of duplicating them.
   - Create new primitives only when needed.

3. Design all relevant states:
   - default
   - hover
   - focus
   - active
   - disabled
   - loading
   - empty
   - error
   - success
   - mobile/responsive

4. Keep the system consistent:
   - consistent spacing scale
   - consistent radius scale
   - consistent typography
   - consistent card/list/table patterns
   - consistent button hierarchy
   - consistent form behavior

5. Avoid:
   - one-off pixel values everywhere
   - inconsistent utility-class soup
   - decorative elements without purpose
   - low-contrast text
   - inaccessible focus states
   - layout shifts
   - hard-coded content that should be data-driven
   - introducing a new UI library without explicit need

---

## Quality bar

The final interface should feel:

- Clear
- Premium
- Trustworthy
- Fast to understand
- Easy to use
- Modern but not trendy for its own sake
- Consistent across screens
- Designed in every state
- Buildable and maintainable

It should not feel:

- Generic
- Template-like
- Cluttered
- Randomly decorated
- Inconsistent
- Overanimated
- Hard to scan
- Visually noisy
- Like separate screens made by different people

---

## Design review checklist

Before finishing, review the result against this checklist:

### UX

- Is the primary user goal obvious?
- Is the primary action clear?
- Are secondary actions visually secondary?
- Are the steps in the flow logical?
- Is there unnecessary friction?
- Are empty/loading/error/success states handled?
- Is the copy clear and useful?

### UI

- Is there a clear hierarchy?
- Is spacing consistent?
- Is alignment precise?
- Are typography levels consistent?
- Are cards, buttons, forms, lists, and tables visually coherent?
- Is the interface responsive?
- Does the mobile layout feel designed, not merely squeezed?

### Accessibility

- Is contrast sufficient?
- Are focus states visible?
- Are interactive elements large enough?
- Is semantic HTML used where possible?
- Are labels, alt text, and ARIA attributes used where needed?
- Can the UI be navigated with a keyboard?

### Engineering

- Are components reusable?
- Are styles maintainable?
- Are existing conventions respected?
- Are unnecessary dependencies avoided?
- Do lint, type, test, or build checks pass where available?

---

## Response format when using this skill

When starting a UI task, respond with:

1. **Design direction**
   - Briefly summarize the intended product feel and UX approach.

2. **Planned changes**
   - List the screens/components/files likely to change.

3. **Implementation**
   - Make the changes.

4. **Verification**
   - Run available checks where possible.

5. **Final summary**
   - Explain what changed.
   - Mention any assumptions.
   - Include a concise design QA checklist.