---
title: Blog
nav_order: 8
lede: >
  Turn the docs engine into a blog: chronological posts, an RSS feed,
  reading-time-aware post pages and a dated archive. No extra plugins.
---

Stygian is a docs engine. Adding a blog means asking for one thing it does not
have by default: ordering by publish date instead of by hand. Everything else -
the sidebar, the theme, search, prev/next, SEO - is reused.

## The wiring

Add a `posts` collection, tell the sidebar about it, and opt it into date
ordering:

```yaml
title: My Blog
baseurl: ""

collections:
  posts:
    output: true
    permalink: /:collection/:year/:month/:day-:title/

just_the_docs:
  collections:
    posts:
      name: Posts
      sort_by: date       # chronological, newest first

stygian:
  nav:
    collection: posts     # posts lead the sidebar
```

Then write posts as dated markdown in `_posts/`:

```markdown
---
layout: blog
title: "My post"
date: 2026-03-09
excerpt: "One-line summary shown in the list, RSS and search."
tags: ["kubernetes", "devops"]
reading_time: "8 min"
---

# My post

Body goes here.
```

Post the date in the filename as well. The `posts` collection is Jekyll's
built-in one, which requires it.

## Why `sort_by: date` is explicit

Jekyll assigns a `date` to every page in every collection, defaulting to the
time the collection was scanned. A test like "sort pages that have a date"
therefore matches reference docs too, and silently reorders your installation
guide into newest-first.

For that reason a collection has to declare that it is date-driven. Setting
`sort_by: date` on one collection leaves every other collection on normal
`nav_order` and title ordering, which is the point: a site that is a blog and
its own documentation can have both without one clobbering the other.

To flip the order, add:

```yaml
stygian:
  nav:
    date_order: asc
```

Newest-first is the default because that is what readers of a blog expect;
`asc` exists for changelogs.

## Post pages

`layout: blog` renders a post with post metadata instead of breadcrumbs: the
publish date as a `<time>` element, the excerpt as the lede, and tag chips.
There is no child table of contents, because posts have no children.
Prev/next pages the posts in date order and reaches across collections, so a
post can follow a docs page when the docs collection sorts later.

Optional front matter:

| Field          | Used for                                              |
| -------------- | ----------------------------------------------------- |
| `date`         | Ordering, post meta, RSS                              |
| `excerpt`      | Lede on the post, archive list, RSS description       |
| `tags`         | Chips on the post and in the archive list             |
| `reading_time` | Rendered beside the date. Compute it yourself, or omit. |
| `feed_exclude` | Skip the post in the RSS feed                         |
| `post`         | Set to `true` to opt into post rendering from any layout. |

`post: true` is the explicit form: it turns on the post header, the tag chips,
`BlogPosting` JSON-LD and prev/next, and it opts the page into the sidebar
through the default layout. Use it when you want a post that is not in
`_posts` - say, a dated entry in a `notes` collection - or when you already
have a layout chain you do not want to extend.

## Archive page

`_includes/post-list.html` renders a dated index of every post. It is plain
Liquid over `site.posts`, so put it in any page whose body renders - a
`layout: docs` page in your collection, or a `layout: page` at the site root:

```markdown
---
layout: docs
title: Archive
nav_order: 9
---
{%- include post-list.html -%}
```

The list sorts newest first and reads the same collection as the sidebar, so
it always agrees with prev/next. The include takes two optional parameters:
`limit` caps the item count and `collection` selects a different collection
(default `posts`).

## RSS feed

`feed.xml` at the theme root is a ready-made RSS 2.0 template. It is not
auto-rendered - copy it into your site's root, the same way you would copy
`404.md`:

```shell
cp <theme>/feed.xml ./feed.xml
```

It pulls from `site.posts` when a posts collection exists, otherwise from the
sidebar collection filtered to pages carrying a date. It honors
`feed_exclude: true`, and `stygian.feed.limit` caps the item count
(default 50).

The template ships in the gem and in the repository, so it is available to
copy from either. This is the same convention as `404.md`.

## What this does not do

Tag browsing is not included. Liquid cannot group a set of posts by an array
field - a per-tag index needs a Ruby data structure, and a theme cannot
register Jekyll hooks, because hooks load from the consumer's site root, not
the theme's. If you want tag pages, add one yourself: it is a single Ruby file
plus a page, and the `.post-tag` styling is already there.

`reading_time` is not computed either, for the same reason.
