# Component Quality Bar

Use this when designing, implementing, or reviewing reusable UI components.

## General Rules

- Name components by product role, not visual appearance, when possible.
- Keep component APIs small and predictable.
- Support composition for content that varies.
- Use design tokens or existing theme values for spacing, color, radius, typography, and state styling.
- Avoid hidden layout side effects.
- Keep interactive states visible and accessible.
- Ensure components work with real content, long labels, empty data, and loading data.

## Buttons And Actions

- Provide clear hierarchy: primary, secondary, tertiary, destructive, icon-only where appropriate.
- Include hover, focus, active, disabled, and loading states.
- Keep labels action-oriented and specific.
- Use icons to clarify action, not as decoration.
- Ensure icon-only buttons have accessible names and tooltips when useful.
- Prevent text overflow and layout shift.

## Forms

- Use labels, helper text, validation, and error text consistently.
- Put errors close to the field and explain how to fix them.
- Mark required fields clearly without clutter.
- Preserve user input on validation failure.
- Use appropriate input types and autocomplete where relevant.
- Make submit, cancel, and destructive actions clear.
- Design disabled and loading submit states.

## Navigation

- Make current location visible.
- Keep navigation labels short and recognizable.
- Group global, local, and contextual navigation separately.
- Avoid hiding essential actions in menus on desktop.
- On mobile, preserve orientation and primary action access.

## Cards And Lists

- Use cards for repeated items or bounded objects, not as generic page wrappers.
- Make the item title, status, key metadata, and action hierarchy scannable.
- Keep repeated item heights stable where comparison matters.
- Avoid decorative shadows when borders, spacing, or background are enough.
- Provide empty and loading states for lists.

## Tables And Data Views

- Prioritize comparison, sorting, filtering, scanning, and bulk actions.
- Use alignment and tabular numbers for numeric data.
- Keep column labels concise.
- Make row actions discoverable but not noisy.
- Handle empty, loading, error, and no-results states.
- Define responsive behavior: horizontal scroll, priority columns, stacked cards, or alternate summary views.

## Modals, Drawers, And Panels

- Use modals for focused decisions, not large exploratory tasks.
- Use drawers or side panels when preserving page context matters.
- Put the title, explanatory copy, primary action, and cancel action in predictable locations.
- Ensure escape, backdrop, close button, focus trap, and return focus behavior where the stack supports it.
- Make destructive confirmations explicit.

## Feedback And Status

- Use status badges, alerts, toasts, and inline messages consistently.
- Do not rely on color alone.
- Make success messages confirm the action and next step.
- Make errors specific and recoverable.
- Keep toast messages short and avoid using them for important persistent state.

## Responsive Component Behavior

- Define min/max sizes and wrapping rules.
- Keep touch targets comfortable.
- Avoid labels or icons that resize parent containers unexpectedly.
- Test long text and translated text.
- Ensure components do not overlap at common mobile widths.
