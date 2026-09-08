---
title: UI components
parent: User guide
nav_order: 2
lede: >
  Buttons, labels, callouts, code blocks, tables and lists - the class
  reference, compatible with just-the-docs class names.
---

## Buttons

Links and buttons styled as buttons. The class names match
just-the-docs so migrated content keeps working.

[Default](https://github.com/ksauraj/stygian){: .btn }
[Purple](https://github.com/ksauraj/stygian){: .btn .btn-purple }
[Blue](https://github.com/ksauraj/stygian){: .btn .btn-blue }
[Green](https://github.com/ksauraj/stygian){: .btn .btn-green }
[Red](https://github.com/ksauraj/stygian){: .btn .btn-red }
[Yellow](https://github.com/ksauraj/stygian){: .btn .btn-yellow }
[Outline](https://github.com/ksauraj/stygian){: .btn .btn-outline }

```markdown
[Link](https://example.com){: .btn }
[Link](https://example.com){: .btn .btn-purple }
[Link](https://example.com){: .btn .btn-outline }
```

Sizes:

```markdown
[Small](https://example.com){: .btn .btn-sm }
[Extra small](https://example.com){: .btn .btn-xs }
```

The theme's own ghost variant remains available as `.btn .btn--ghost`.

## Labels

Inline chips for tagging content. The default label plus color
variants, again with just-the-docs names:

`default`{: .label } `blue`{: .label .label-blue }
`green`{: .label .label-green } `purple`{: .label .label-purple }
`yellow`{: .label .label-yellow } `red`{: .label .label-red }

```markdown
`New in v14`{: .label .label-green }
```

## Callouts

Four named callouts with just-the-docs class names. Apply the class to
a paragraph or a blockquote; the title variant renders an uppercase
header line.

{: .note }
A note: context that helps but is not required.

{: .tip }
A tip: a shortcut or a recommended approach.

{: .warning }
A warning: something that can break.

{: .important }
Important: required reading before you proceed.

```markdown
{: .note }
A note: context that helps but is not required.

{: .warning }
A warning: something that can break.
```

Title variants:

```markdown
{: .note-title }
Note
{: .note }
Body of the callout.
```

The original `.callout` class continues to work. Custom callout colors
via the `callouts:` config key are planned; the four built-in classes
cover the common cases today.

## Code

Fenced code blocks get syntax highlighting when the site opts in
(see Configuration, Syntax highlighting), a copy button, and horizontal
scrolling. Inline code renders as atomic chips that never split across
lines.

```bash
kubectl get pods -n kube-system
```

Line numbers are supported via kramdown:

```yaml
kramdown:
  syntax_highlighter_opts:
    block:
      line_numbers: true
```

or per block with the `linenos` flag. Numbered lines are muted and
unselectable.

## Tables

Tables are wrapped in a scroll container automatically, so wide tables
stay usable on phones. No class needed.

| Key | Default | Meaning |
| --- | --- | --- |
| `search_enabled` | true | Toggle the search UI |
| `color_scheme` | - | dark or light |

## Lists

Task lists render with native checkboxes:

- [x] shipped
- [ ] planned

Definition lists render with the term in fg and the definition in
fg-dim.
