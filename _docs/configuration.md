---
title: Configuration
nav_order: 2
lede: >
  Everything the engine reads: site keys, the docs collection and the small
  `stygian:` block. Page front matter controls the sidebar.
---
## Site level

Standard Jekyll keys drive the chrome:

| Key | What it does |
| --- | --- |
| `title` | Header title and `<title>` suffix |
| `description` | Meta description fallback for pages |
| `url` + `baseurl` | Canonical URLs and asset paths |
| `collections.docs` | Defines the docs collection and its URL shape |

## The `stygian:` block

The theme is deliberately low-config. These keys are all optional:

```yaml
stygian:
  header:
    aux_links:              # small mono links in the top bar
      - { label: GitHub, href: https://github.com/yourname/yourrepo }
  theme:
    default: dark           # dark or light, used before the visitor choice
    transition: true        # false disables the ripple animation
  nav:
    title: Docs             # sidebar heading, defaults to "Docs"
  footer:
    note: Your project docs
    right: "© 2026 Your Name"
```

## Page front matter

Every markdown page in the docs collection reads:

| Key | Meaning |
| --- | --- |
| `title` | Rendered as the page heading and sidebar label |
| `lede` | One-line subtitle under the heading |
| `nav_order` | Sidebar position, lowest first (defaults to document order) |
| `parent` | Basename of the parent page to nest under |
| `nav_exclude` | `true` hides the page from navigation |
| `layout` | Usually omitted: the collection default is `docs` |

Example:

```yaml
---
title: Theming
parent: customization
nav_order: 1
---
```

## Overriding styles

Copy `assets/css/stygian.css` from the theme into your site and add overrides
below it via `_includes/head.html`, or set tokens in your own stylesheet:

```css
html[data-theme='dark'] {
  --color-bg: 8 8 10;
}
```

Every color in the engine reads through the token table, so a two-line
override re-skins the whole docs site including the ripple color.
