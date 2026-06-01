# UI Principles

Use this reference when a task needs deeper design direction. Keep decisions tied to product context and user jobs.

## Product Direction

Start with the product's practical promise:

- What does the user come here to do?
- What must they trust before acting?
- What should be faster, clearer, safer, or more delightful than the current state?
- What business outcome should the UI support?

Translate that into a design posture:

- Operational products should be calm, dense, fast, and legible.
- SaaS products should make value, status, progress, and next steps obvious.
- Marketplaces should balance trust, comparison, discovery, and conversion.
- Consumer apps should feel approachable, responsive, and emotionally clear.
- Enterprise tools should emphasize scalability, permissions, auditability, consistency, and information architecture.
- Landing pages should make the offer instantly clear, show the product or outcome, and support conversion without looking generic.

## UX Principles

Choose a few principles and let them govern the work:

- One primary job per screen.
- Fewer choices until the user needs more control.
- Progressive disclosure for advanced settings and complex data.
- Clear hierarchy between primary, secondary, and destructive actions.
- Immediate feedback after user action.
- Useful recovery paths for errors.
- Preserve context when navigating between related views.
- Prefer recognition over recall: labels, previews, summaries, and examples should reduce memory load.

## Visual Hierarchy

Create hierarchy through order, scale, weight, spacing, color, and placement.

- Make the page title, current state, and primary action easy to find.
- Group related content with spacing before adding borders or heavy containers.
- Use accent color sparingly for selected, primary, or important states.
- Let secondary metadata stay quieter but readable.
- For dashboards, make the most decision-relevant numbers visually dominant and support them with trend, context, and action.

## Layout And Spacing

Use a consistent rhythm.

- Prefer a small spacing scale over many unrelated values.
- Use larger gaps between groups and smaller gaps within groups.
- Align forms, labels, actions, and data columns precisely.
- Avoid nesting cards inside cards.
- Avoid decorative section wrappers unless they clarify structure.
- Keep fixed-format UI stable with explicit dimensions, aspect ratios, min/max sizes, or grid tracks.

## Typography

Use type to clarify work, not to impress.

- Keep body text highly readable.
- Use compact labels for controls and data tables.
- Use tabular numbers when comparing numeric data if the stack supports it.
- Avoid viewport-scaled font sizes.
- Avoid negative letter spacing.
- Use fewer type styles with clear roles: display, heading, subheading, body, label, metadata, code, numeric.

## Color And Tokens

Use color semantically before decoratively.

- Define roles such as background, surface, text, muted text, border, primary, danger, warning, success, info, focus, and selected.
- Keep contrast accessible.
- Avoid interfaces dominated by a single hue family unless brand constraints require it.
- Use gradients rarely and only when they support brand or meaning.
- Do not rely on color alone to communicate status.

## Motion

Use motion to explain continuity, status, or feedback.

- Keep transitions short and subtle.
- Avoid motion that delays task completion.
- Respect reduced-motion preferences when the stack supports it.
- Do not use animation to compensate for unclear structure.

## Responsive Behavior

Design each breakpoint as a real surface.

- Preserve primary actions on mobile.
- Collapse complex navigation predictably.
- Convert dense tables into cards, horizontal scroll, or prioritized columns based on task needs.
- Keep touch targets comfortable.
- Ensure text wraps cleanly and never overlaps controls.
- Test empty, long-content, and error states at narrow widths.
