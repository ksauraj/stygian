---
title: SEO
nav_order: 6
lede: >
  Automatic search-engine plumbing: structured data, Open Graph and
  metadata - on by default, one switch to turn it off.
---

## What the theme does automatically

When `stygian.seo.enabled` is true (the default) every page gets:

- **WebSite JSON-LD** in the `<head>` - site name, optional
  `alternateName` from `site.tagline`, and the site URL
- **BreadcrumbList JSON-LD** on every docs page - matches the visible
  breadcrumbs (Home, parent page when nested, current page)
- **Open Graph tags** - `og:title`, `og:description`, `og:url`,
  `og:type`, `og:site_name`
- **Twitter card** - `summary_large_image` when an image is configured,
  `summary` otherwise
- **Meta description** - `page.description`, else `page.lede`, else
  `site.description`, truncated to 160 characters
- **Canonical URL** - `site.url + site.baseurl + page.url`, always

No plugin is required: it is all Liquid in the layouts.

## Adding an Open Graph image

```yaml
stygian:
  seo:
    enabled: true
    image: /assets/img/og.png
```

Relative paths are resolved against `site.url` and `site.baseurl`; an
absolute URL is used as-is. GitHub Pages commonly hosts the image in the
site itself, e.g. `https://user.github.io/project/assets/img/og.png`.

## Turning it off

```yaml
stygian:
  seo:
    enabled: false
```

This removes JSON-LD, Open Graph and the Twitter card. The title tag,
meta description and canonical link stay - they are core meta.

## Good hygiene around SEO

- Set `url` and `baseurl` in `_config.yml`. JSON-LD and canonical URLs
  are absolute only when `site.url` is set.
- Keep one H1 per page. Stygian renders the page `title` as the H1 and
  strips a redundant leading `# Heading` from the markdown content, so
  write content headings from `##` upwards.
- Use `lede` or `description` front matter on pages whose first
  paragraph is not a good meta description.
- Add `jekyll-sitemap` to your `plugins:` list for a sitemap.xml; add
  `jekyll-seo-tag` only if you want its extra niceties - the theme does
  not need it.
- Check the result: page source shows the JSON-LD blocks, and Google's
  Rich Results test understands BreadcrumbList.
