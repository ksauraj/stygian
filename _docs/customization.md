---
title: Customization
nav_order: 4
lede: >
  This section is a live demo of parent/child nesting. It exists purely to
  show how child pages appear in the sidebar and in prev/next order.
---
This page is a parent. The two pages nested under it are:

- [Theming](theming/) - tokens, palettes and how light mode is designed.
- [Effects](effects/) - the transition and flicker suite, and accessibility.

Nesting is declared with one line of front matter on the child pages:

```yaml
parent: customization
```

Nothing else is required. Children inherit the sidebar order rules, render
under this entry, and the prev/next navigation walks through them in order
right after this page.

You can keep child pages in any folder; only the basename of the parent
file matters for the link.
