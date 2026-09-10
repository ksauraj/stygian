---
title: Utilities
parent: User guide
nav_order: 3
lede: >
  Typography scale, font weights, text alignment and the color utility
  classes - a just-the-docs compatible subset.
---

Utility classes give one-off styling without writing CSS. Apply them in
markdown with the attribute syntax: `{: .fs-4 .fw-300 }`.

## Font size

`.fs-1` through `.fs-10` set an explicit font size. Sizes are fluid:
the small value on phones, the larger value from 768px up.

| Class | Mobile | Desktop |
| --- | --- | --- |
| `.fs-1` | 9px | 10px |
| `.fs-2` | 11px | 12px |
| `.fs-3` | 12px | 14px |
| `.fs-4` | 14px | 16px |
| `.fs-5` | 16px | 18px |
| `.fs-6` | 18px | 24px |
| `.fs-7` | 24px | 32px |
| `.fs-8` | 32px | 38px |
| `.fs-9` | 38px | 42px |
| `.fs-10` | 42px | 48px |

```markdown
Big claim here{: .fs-8 .fw-700 }
```

## Font weight

`.fw-300`, `.fw-400`, `.fw-500`, `.fw-700`.

```markdown
A light lede{: .fw-300 }
```

## Text alignment

`.text-center`, `.text-left`, `.text-right`.

## Font family

`.text-mono` switches to Space Mono. `.text-delta` renders the
small-uppercase section-label style used across these docs:

`SECTION LABEL`{: .text-delta }

## Display

`.d-inline-block` for inline block layout.

## Color utilities

Text and background variants for the just-the-docs palette. Levels
`000` (lightest) through `300` (darkest); `grey-dk` also has `250`.

```markdown
This is purple text{: .text-purple-100 }
A tinted swatch: <span class="d-inline-block bg-purple-000" style="padding:0.55rem 1rem;border-radius:0.25rem"></span>
```

Available families: `grey-lt`, `grey-dk`, `purple`, `blue`, `green`,
`yellow`, `red`. Examples:

- `.text-blue-200`
- `.bg-green-000`
- `.text-grey-dk-300`
- `.bg-yellow-100`

```markdown
<span class="d-inline-block bg-blue-000">block</span> inline chip
```

## What is not ported yet

The layout spacing matrix (`.m-*`, `.p-*`, `.flex-*`, `.v-align-*`) is
not ported. Tracked in `GAP-ANALYSIS.md` under the v16 milestone.
