---
title: Effects and transitions
parent: customization
nav_order: 2
lede: >
  The binary-ripple theme transition, the flicker and glare accents, and the
  accessibility rules every effect obeys.
---
## The theme transition

Click the sun/moon button in the header. The new theme does not just swap
in: a full-screen wave of `0` and `1` glyphs expands from the point you
clicked, collision-aware ripple rings expand in sync with the reveal, and
the color boundary moves with the wave.

Two systems cooperate:

1. CSS: a `::view-transition` circular clip-path reveal, with the origin
   and radius set as custom properties at click time.
2. Canvas: the binary glyph engine. Local ripple rings (18 on desktop,
   7 on mobile) expand as bands 12 to 20 glyph cells thick; rings that
   collide stop, glow and fade, while un-collided rings keep expanding.

```css
@keyframes theme-reveal-wave {
  0%   { clip-path: circle(0px at var(--theme-origin-x) var(--theme-origin-y)); }
  35%  { clip-path: circle(var(--theme-reveal-pause-start) at var(--theme-origin-x) var(--theme-origin-y)); }
  70%  { clip-path: circle(var(--theme-reveal-pause-end) at var(--theme-origin-x) var(--theme-origin-y)); }
  100% { clip-path: circle(var(--theme-reveal-radius) at var(--theme-origin-x) var(--theme-origin-y)); }
}
```

The pause band between 31.5% and 35.7% of the radius is exactly where the
ripple rings play. To disable the animation entirely:

```yaml
stygian:
  theme:
    transition: false
```

## Flicker and glare accents

The engine ships a restrained effect suite, driven by `--theme-glow` so it
works in both modes:

- the theme toggle carries a slow border flicker, like a power cell
- code copy fires a one-shot glare sweep across the block
- prev/next cards sweep a glare band on hover
- landing buttons run a slow skewed glare

All of it is pure CSS keyframes; none of it gates content.

## Accessibility rules

- `prefers-reduced-motion: reduce` disables every animation, and the theme
  then swaps instantly.
- Browsers without the View Transitions API get an instant swap, never a
  broken half-animation.
- No JavaScript? The boot script is a five-line inline snippet that applies
  the saved theme before first paint, so there is no flash of the wrong
  theme. Content is never hidden behind JS.
- The sidebar drawer on mobile closes with Escape and respects focus
  visibility.

> **Note:** the ripple and reveal use fixed timings tuned on the demo site.
> If a page has very heavy tables, reduce motion in your OS settings and
> the theme degrades gracefully.
{: .callout }
