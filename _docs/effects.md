---
title: Effects and transitions
parent: customization
nav_order: 2
lede: >
  What moves and glows in Stygian, and how every effect behaves for
  reduced-motion visitors.
---

## Theme switch transition

Clicking the sun/moon toggle swaps `data-theme` on the root element and,
when the browser supports View Transitions, reveals the new theme with a
circular clip-path that grows from the click point. The reveal lasts
about 700 ms.

```yaml
stygian:
  theme:
    transition: false   # instant swap, no reveal
```

Mermaid diagrams re-render with the new theme's palette once the reveal
finishes, so charts never keep stale colors.

## Flicker and glare accents

The effects are deliberately restrained and mostly hover-triggered:

- **Theme button glow** - a short glow pulse on the toggle when the
  theme changes
- **Button glare** - a light sweep across `.btn` elements on hover
  (`btn-glare`)
- **Card hover glare** - same sweep on hover-cards
  (`card-hover-glare`)
- **Copy confirmation** - the copy button flashes "copied" and a small
  glare crosses the code block

## Reduced motion

Under `prefers-reduced-motion: reduce` the theme:

- switches themes instantly (no View Transition)
- disables the reveal animation, glares and glow pulses
- keeps smooth scrolling off and sets transition durations to
  effectively zero

```css
@media (prefers-reduced-motion: reduce) { /* handled by the theme */ }
```

Nothing animates more than ~700 ms in any configuration, and no effect
runs after a page transition.

## Removing effects entirely

Shadow `_includes/head_custom.html` in your site and override:

```css
.theme-toggle.animate-flicker-glow,
.btn-glare::after,
.card-hover-glare::after { animation: none !important; }
```
