# Design Review Checklist

Use this before claiming a UI task is complete or when reviewing an interface.

## Product And Flow

- Is the product type and target user clear from the interface?
- Is the primary user job obvious?
- Is the primary action visible, specific, and placed where the user expects it?
- Are secondary and destructive actions visually distinct from primary actions?
- Are steps ordered in the way users think about the task?
- Is there avoidable friction, duplicate choice, or unclear copy?
- Does the flow include confirmation, cancellation, undo, or recovery where needed?

## Information Architecture

- Does navigation match user mental models?
- Can users tell where they are, what changed, and what to do next?
- Are related items grouped?
- Are advanced controls hidden until useful?
- Are filters, sorting, search, tabs, and pagination predictable?

## Visual Quality

- Is there a clear hierarchy on every screen?
- Is spacing consistent within groups and between groups?
- Is alignment precise?
- Are typography roles consistent?
- Are color roles consistent and accessible?
- Are radius, border, shadow, and elevation values coherent?
- Does the UI avoid generic template patterns and random decoration?

## Components And States

- Do buttons, links, inputs, tabs, menus, tables, cards, modals, and notifications follow a shared system?
- Are hover, focus, active, disabled, loading, empty, error, selected, and success states covered where relevant?
- Are empty states useful and tied to the next best action?
- Are errors specific, actionable, and close to the problem?
- Are loading states stable and layout-safe?

## Responsive And Accessibility

- Does the mobile layout feel designed rather than squeezed?
- Does content wrap without overlap or clipping?
- Are touch targets large enough?
- Is keyboard navigation possible for interactive elements?
- Are focus states visible?
- Is contrast sufficient for text, icons, borders, and disabled states?
- Are labels, semantic elements, alt text, and ARIA used where needed?
- Is the UI usable with longer text, localization, or dynamic data?

## Engineering Fit

- Does the implementation reuse existing components and tokens?
- Are new components composable and named by product role?
- Are styles maintainable rather than one-off?
- Are dependencies justified?
- Do lint, type, test, build, or visual checks pass where available?
- Is any remaining risk or assumption clearly reported?

## Final QA Summary

End with a short checklist:

- Hierarchy: pass, issue, or not checked.
- Responsive behavior: pass, issue, or not checked.
- Accessibility: pass, issue, or not checked.
- States: pass, issue, or not checked.
- Consistency: pass, issue, or not checked.
