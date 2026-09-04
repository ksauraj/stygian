---
title: Theming
parent: customization
nav_order: 1
lede: >
  Tokens, palettes and why light mode is designed rather than inverted.
---
## Tokens

Every color on a Stygian docs site is an RGB-triplet custom property swapped
on `html[data-theme]`. This page is rendering with the active palette, so
the table below shows both modes side by side:

| Token | Dark | Light |
| --- | --- | --- |
| `--color-bg` | `0 0 0` | `246 247 249` |
| `--color-surface` | `13 13 13` | `238 240 243` |
| `--color-card` | `8 8 8` | `255 255 255` |
| `--color-border` | `26 26 26` | `211 214 220` |
| `--color-fg` | `255 255 255` | `17 24 39` |
| `--color-muted` | `136 136 136` | `79 86 99` |
| `--theme-glow` | `255 255 255` | `17 24 39` |

Tokens are consumed everywhere through the same pattern:

```css
.nav-item a {
  color: rgb(var(--color-muted));
}
.nav-item a:hover {
  color: rgb(var(--color-fg));
}
```

Override any token in your own stylesheet to re-skin the whole engine.

## Light mode is a palette, not a filter

The naive approach, flipping dark values, breaks contrast hierarchies and
turns glow effects into bloom. Instead, each mode re-picks its own values:

- prose body text uses `--color-fg-dim` on both modes, re-tuned per mode
- code blocks are near-black in dark mode and GitHub-style light in light
  mode, with their own token surfaces
- borders use lower-contrast greys in light mode so cards stay crisp
- `--theme-glow` (the color of the flicker and glare effects) is near-white
  in dark mode and near-black in light mode, so the effect suite reads
  correctly in both

## Code blocks in both modes

Dark mode keeps a terminal soul:

```go
func main() {
	cfg := config.Load("stygian.yml")
	site := jekyll.New(cfg) // render markdown, keep the soul
	fmt.Println("docs up:", site.URL())
}
```

Light mode keeps the same structure on paper tones. Toggle the theme to
watch the code block re-tokenize without any JavaScript involved.
