---
name: premium-product-ui
description: Design, redesign, improve, polish, implement, or review premium digital application UI/UX. Use when Codex needs to create or refine frontend screens, components, design systems, dashboards, SaaS interfaces, marketplaces, consumer apps, internal tools, onboarding, navigation, forms, product flows, landing pages, responsive layouts, mobile layouts, or app experiences that should feel modern, trustworthy, clean, polished, usable, scalable, or world-class. Use for both design direction and implementation guidance.
---

# Premium Product UI

Use this skill to produce product-first digital interfaces with the quality bar of a mature product studio. Combine strategy, UX, visual design, and implementation judgment. Do not copy any agency, brand, visual identity, case study, or signature style. Treat these benchmarks only as principles:

- Work & Co: clear product structure, strong flows, polished execution, strategy plus design plus development.
- MetaLab: clean modern product UI, SaaS and startup friendliness, simple interfaces, strong hierarchy.
- IDEO: human-centered thinking, user needs, usability, research-informed decisions.
- frog: scalable UX, systems thinking, enterprise-grade consistency.

## Core Standard

Design like a product team, not a decorator.

- Prioritize flows before screens.
- Prioritize usability before visual flair.
- Make the primary user job and primary action obvious.
- Remove friction, ambiguity, and unnecessary steps.
- Make empty, loading, error, disabled, and success states feel intentionally designed.
- Use responsive behavior as part of the design, not as an afterthought.
- Ensure accessible contrast, semantics, focus states, and keyboard behavior.
- Avoid generic template-looking UI.
- Never sacrifice clarity for decoration.

## First Understand Context

Before large UI changes, infer from the repo and user request. Ask only when an unknown would materially change the product direction.

Capture:

- Product type: SaaS, marketplace, dashboard, mobile app, internal tool, consumer app, landing page, admin, content product, or hybrid.
- Target users and their level of expertise.
- Primary user jobs and top flows.
- Brand personality and trust posture.
- Business goal: activation, conversion, retention, operational speed, self-serve success, data clarity, or another measurable outcome.
- Platform: desktop web, responsive web, mobile, tablet, native app, admin, embedded, or multi-platform.
- Existing tech stack, components, design tokens, CSS conventions, routing, and accessibility patterns.
- Constraints: timeline, brand guidelines, content, data density, localization, regulated domain, performance, or legacy code.

## Derive Direction

Before making substantial changes, summarize a concise design direction:

- Product positioning: what the product should feel like in one sentence.
- Tone: premium, clear, calm, energetic, editorial, technical, playful, utility-first, enterprise-grade, or another context-fit blend.
- UX principles: 3 to 5 rules for flows and interaction.
- UI principles: 3 to 5 rules for hierarchy, spacing, density, components, and visual restraint.
- Typography approach: scale, weight, readability, labels, numeric/data treatment.
- Spacing rhythm: compact, balanced, spacious, dense, or mixed by surface.
- Color and token approach: semantic roles first, restrained accents, accessible contrast.
- Component system direction: primitives, reusable patterns, state coverage, and responsive rules.

Keep the direction practical enough to implement.

## Implementation Workflow

When changing frontend code:

1. Inspect the existing UI system first.
   - Find components, layouts, global styles, tokens, theme config, utility patterns, icons, form components, table/list patterns, and current responsive behavior.
   - Prefer existing conventions unless they are clearly causing the problem.

2. Shape the flow before styling.
   - Identify the user goal, entry point, decision points, primary action, secondary actions, confirmation path, and recovery path.
   - Remove duplicate choices and unclear labels.

3. Build a coherent screen system.
   - Use a clear page structure: orientation, content hierarchy, action hierarchy, feedback, and navigation.
   - Make scanning easy with alignment, grouping, whitespace, typography, and predictable component placement.
   - For data-heavy screens, prioritize density, comparison, filtering, sorting, and state clarity over decorative layouts.

4. Implement maintainably.
   - Reuse existing components and tokens where possible.
   - Introduce tokens only when they reduce inconsistency or support a real system.
   - Create composable components for repeated patterns.
   - Avoid one-off styling chaos, arbitrary pixel drift, unnecessary dependencies, and hard-coded behavior that should be data-driven.

5. Design relevant states.
   - Include hover, focus, active, disabled, loading, empty, error, success, selected, expanded/collapsed, and responsive states where relevant.
   - Make errors actionable, empty states useful, and loading states stable.

6. Verify the work.
   - Run available lint, type, test, build, or format checks when the repo supports them.
   - For rendered UI, inspect desktop and mobile layouts. Use browser verification when available.
   - Check that text fits, actions are reachable, contrast is acceptable, and layout does not shift unexpectedly.

## Quality Bar

The result should feel like a polished digital product from a top product studio:

- Simple, confident, precise, and usable.
- Clear hierarchy, rhythm, alignment, and intent on every screen.
- Consistent typography, spacing, radius, borders, shadows, icon style, and action hierarchy.
- Responsive layouts that feel designed at each breakpoint.
- Components that are reusable and state-complete.
- Copy that helps the user decide and act.

Avoid:

- Clutter, random gradients, ornamental effects, excessive shadows, low-contrast text, inconsistent radius values, inconsistent spacing, and visual noise.
- UI that looks like a generic template.
- New visual systems that ignore existing project conventions.
- Decorative elements that do not improve comprehension, confidence, or brand feeling.

## Reference Loading

Load references only when they help the current task:

- Read `references/ui-principles.md` for design direction, hierarchy, typography, color, spacing, layout, and product-surface guidance.
- Read `references/component-quality-bar.md` when creating or reviewing reusable components, forms, tables, cards, navigation, modals, or stateful UI.
- Read `references/design-review-checklist.md` before final review, or when the user asks for a UI/UX critique.

## Output Behavior

For large UI changes, first summarize the proposed design direction and the files or surfaces likely to change.

When code changes are made:

- Explain which files changed and why.
- Mention meaningful assumptions.
- Report checks run and any checks that could not be run.
- End with a concise design QA checklist covering hierarchy, responsiveness, accessibility, state coverage, and consistency.

For small changes, keep the response short while still applying the quality bar.
