# frozen_string_literal: true

# Smoke tests: build the theme's own demo site with Jekyll and assert the
# generated output has the properties the theme promises. This catches
# broken Liquid, missing includes and regressions like duplicated H1s or
# an unparseable search index.

require_relative "spec_helper"

RSpec.describe "Stygian build" do
  before(:all) do
    @dest = build_site
  end

  after(:all) do
    FileUtils.remove_entry(@dest) if @dest && Dir.exist?(@dest)
  end

  it "renders every docs page with exactly one H1" do
    %w[getting-started configuration navigation].each do |slug|
      html = read(@dest, "docs/#{slug}/index.html")
      h1 = html.scan(%r{<h1[^>]*>(.*?)</h1>}m)
      expect(h1.length).to eq(1), "#{slug} should have a single H1, got #{h1.length}"
    end
  end

  it "emits a parseable client-side search index with every page" do
    data = JSON.parse(read(@dest, "assets/js/search-data.json"))
    expect(data.length).to be >= 5
    expect(data.first).to have_key("url")
    expect(data.first).to have_key("content")
  end

  it "splits the search index into sections by heading_level" do
    data = JSON.parse(read(@dest, "assets/js/search-data.json"))
    anchored = data.select { |e| e["url"].to_s.include?("#") }
    expect(anchored.length).to be >= 5
    expect(anchored.first).to have_key("title")
  end

  it "renders just_the_docs.collections with categories, fold and excludes" do
    src = Dir.mktmpdir("stygian-jtdcol")
    Dir.mkdir(File.join(src, "_docs"))
    Dir.mkdir(File.join(src, "_guides"))
    Dir.mkdir(File.join(src, "_internal"))
    File.write(File.join(src, "_config.yml"), <<~YAML)
      theme: stygian
      collections:
        docs: { output: true, permalink: "/:collection/:path/" }
        guides: { output: true, permalink: "/:collection/:path/" }
        internal: { output: true, permalink: "/:collection/:path/" }
      just_the_docs:
        collections:
          docs: { name: Docs }
          guides: { name: Guides, nav_fold: true }
          internal: { name: Internal, search_exclude: true }
      defaults:
        - scope: { path: "", type: docs }
          values: { layout: default }
        - scope: { path: "", type: guides }
          values: { layout: default }
        - scope: { path: "", type: internal }
          values: { layout: default }
    YAML
    File.write(File.join(src, "_docs", "a.md"), "---\ntitle: Alpha\n---\n## Section one\n\ncontent\n")
    File.write(File.join(src, "_guides", "b.md"), "---\ntitle: Beta\n---\n## Section two\n\ncontent\n")
    File.write(File.join(src, "_internal", "c.md"), "---\ntitle: Gamma\n---\n## Section three\n\ncontent\n")
    dest = Dir.mktmpdir("stygian-jtdcol-out")
    begin
      cfg = Jekyll.configuration(
        "source" => src, "destination" => dest,
        "theme" => "stygian", "quiet" => true, "disable_disk_cache" => true
      )
      Jekyll::Site.new(cfg).process
      html = read(dest, "docs/a/index.html")
      expect(html).to include("docs__nav-category")
      expect(html).to include("js-nav-fold-btn")
      expect(html).to include(">Gamma<") # internal is in the nav (nav_exclude unset)
      index = JSON.parse(read(dest, "assets/js/search-data.json"))
      expect(index.map { |e| e["title"] }).not_to include("Gamma") # search_exclude
      expect(index.map { |e| e["url"] }).to include("/guides/b/") # folded collection still indexed
    ensure
      FileUtils.remove_entry(src) if Dir.exist?(src)
      FileUtils.remove_entry(dest) if Dir.exist?(dest)
    end
  end

  it "emits WebSite and BreadcrumbList JSON-LD when SEO is enabled" do
    html = read(@dest, "docs/getting-started/index.html")
    scripts = html.scan(%r{<script type="application/ld\+json">(.*?)</script>}m)
    types = scripts.map { |s| JSON.parse(s.first)["@type"] }
    expect(types).to include("WebSite")
    expect(types).to include("BreadcrumbList")
  end

  it "serves the theme stylesheet and script" do
    css = read(@dest, "assets/css/stygian.css")
    expect(css).to include("--color-bg")
    js = read(@dest, "assets/js/stygian.js")
    expect(js).to include("initMermaid")
    expect(js).to include("initSearch")
  end

  it "declares a version that matches the gemspec" do
    gemspec = Gem::Specification.load(File.join(ROOT, "stygian.gemspec"))
    expect(gemspec.version.to_s).to eq(Stygian::VERSION)
    expect(gemspec.files).to include("_layouts/docs.html")
    expect(gemspec.files).to include("_includes/head_custom.html")
    expect(gemspec.files).to include("assets/js/search-data.json")
  end

  it "keeps the asset query version in sync with the gem version" do
    head = read(@dest, "index.html") # built with the demo config, contains ?v=
    css_ref = head[/stygian\.css\?v=([^"']+)/, 1]
    js_ref = head[/stygian\.js\?v=([^"']+)/, 1]
    expect(css_ref).to eq(Stygian::VERSION)
    expect(js_ref).to eq(Stygian::VERSION)
  end

  it "ships no _config.yml in the theme root (no demo default leak)" do
    expect(File.exist?(File.join(ROOT, "_config.yml"))).to be(false)
    expect(File.exist?(File.join(ROOT, "_config.demo.yml"))).to be(true)
  end

  it "renders the JTD-style navigation tree with parents by title" do
    # the demo docs nest pages under "User guide" / "Developer guide" by title
    html = read(@dest, "docs/user-guide/index.html")
    expect(html).to include("docs__children")
    expect(html.scan("docs__nav-list--child").length).to be >= 1
    # child TOC lists a grandchild section's pages in nav_order
    expect(html).to match(%r{href=".*search/".*>Search<})
  end

  it "honors layout: default docs-mode for collection pages with nav front matter" do
    # theme demo pages use the docs layout; the compat path is exercised by
    # the migration fixture site in CI (see .github/workflows) - here we at
    # least assert the docs layout renders sidebar chrome
    html = read(@dest, "docs/getting-started/index.html")
    expect(html).to include('id="sidebar"')
    expect(html).to include("docs__sidebar")
  end

  it "keeps the personal-data scrub: no author email in the gemspec" do
    gemspec = Gem::Specification.load(File.join(ROOT, "stygian.gemspec"))
    expect(gemspec.authors).to eq(["Stygian contributors"])
    expect(gemspec.email).to be_nil
  end

  it "does not crash when a site has no docs collection (GH Pages regression)" do
    # A consumer page using the docs layout with no `docs` collection used to
    # raise "Cannot sort a null object." on Jekyll 3.10 (github-pages v232).
    src = Dir.mktmpdir("stygian-nocoll")
    File.write(File.join(src, "_config.yml"), "theme: stygian\ntitle: No collection\n")
    File.write(File.join(src, "index.md"), "---\nlayout: docs\ntitle: Home\n---\n\n# Home\n")
    dest = Dir.mktmpdir("stygian-nocoll-out")
    begin
      cfg = Jekyll.configuration(
        "source" => src, "destination" => dest,
        "theme" => "stygian", "quiet" => true, "disable_disk_cache" => true
      )
      site = Jekyll::Site.new(cfg)
      site.process
      html = read(dest, "index.html")
      expect(html).to include("docs__sidebar")
      expect(html).to include("<h1>Home</h1>")
    ensure
      FileUtils.remove_entry(src) if Dir.exist?(src)
      FileUtils.remove_entry(dest) if Dir.exist?(dest)
    end
  end

  # --- blog support -------------------------------------------------------

  def init_blog_site
    src = Dir.mktmpdir("stygian-blog")
    Dir.mkdir(File.join(src, "_posts"))
    Dir.mkdir(File.join(src, "_docs"))
    # posts written in a deliberately non-chronological order on disk
    posts = [
      ["2024-01-15-oldest.md", "Oldest Post", "2024-01-15"],
      ["2026-03-09-newest.md", "Newest Post", "2026-03-09"],
      ["2025-07-01-middle.md", "Middle Post", "2025-07-01"],
    ]
    posts.each do |name, title, date|
      File.write(
        File.join(src, "_posts", name),
        "---\nlayout: blog\ntitle: \"#{title}\"\n" \
        "excerpt: \"Excerpt for #{title}.\"\ntags: [\"kubernetes\"]\n---\n\n## Body\n\nBody for #{title}.\n"
      )
    end
    File.write(
      File.join(src, "_docs", "intro.md"),
      "---\nlayout: docs\ntitle: Docs Intro\nnav_order: 1\n---\n\n## Docs\n\nDocs body.\n"
    )
    File.write(
      File.join(src, "_docs", "deep.md"),
      "---\nlayout: docs\ntitle: Docs Deep\nnav_order: 2\n---\n\n## Deep\n\nDeep body.\n"
    )
    File.write(File.join(src, "_config.yml"), <<~YAML)
      theme: stygian
      title: Blog Test
      url: "https://blog.example.com"
      baseurl: ""

      collections:
        docs: { output: true, permalink: "/:collection/:path/" }
        posts:
          output: true
          post_ext: md
          permalink: "/:collection/:year/:month/:day-:title/"

      just_the_docs:
        collections:
          posts: { name: Posts, sort_by: date }
          docs: { name: Docs }

      defaults:
        - scope: { path: \"\", type: docs }
          values: { layout: docs }

      stygian:
        nav:
          collection: posts
        theme: { default: dark }
    YAML
    dest = Dir.mktmpdir("stygian-blog-out")
    [src, dest]
  end

  # Every call builds a fresh source tree and destination and returns them.
  # Tests that add a file (an archive page, a post flagged `post: true`) pass
  # it as an extra, so the fixed sidebar expectations of the other tests hold.
  def rebuild_blog(extras: [])
    src = Dir.mktmpdir("stygian-blog-src")
    Dir.mkdir(File.join(src, "_posts"))
    Dir.mkdir(File.join(src, "_docs"))
    extras.each { |path, body| File.write(File.join(src, path), body) }
    [["2024-01-15-oldest.md", "Oldest Post"],
     ["2026-03-09-newest.md", "Newest Post"],
     ["2025-07-01-middle.md", "Middle Post"]].each do |name, title|
      File.write(
        File.join(src, "_posts", name),
        "---\nlayout: blog\ntitle: \"#{title}\"\n" \
        "excerpt: \"Excerpt for #{title}.\"\ntags: [\"kubernetes\"]\n---\n\n## Body\n\nBody for #{title}.\n"
      )
    end
    File.write(
      File.join(src, "_docs", "intro.md"),
      "---\nlayout: docs\ntitle: Docs Intro\nnav_order: 1\n---\n\n## Docs\n\nDocs body.\n"
    )
    File.write(
      File.join(src, "_docs", "deep.md"),
      "---\nlayout: docs\ntitle: Docs Deep\nnav_order: 2\n---\n\n## Deep\n\nDeep body.\n"
    )
    File.write(File.join(src, "_config.yml"), blog_config)
    dest = Dir.mktmpdir("stygian-blog-out")
    cfg = Jekyll.configuration(
      "source" => src, "destination" => dest,
      "theme" => "stygian", "quiet" => true, "disable_disk_cache" => true
    )
    Jekyll::Site.new(cfg).process
    [src, dest]
  end

  # The config every blog test builds from.
  def blog_config
    <<~YAML
      theme: stygian
      title: Blog Test
      url: "https://blog.example.com"
      baseurl: ""

      collections:
        docs: { output: true, permalink: "/:collection/:path/" }
        posts:
          output: true
          post_ext: md
          permalink: "/:collection/:year/:month/:day-:title/"

      just_the_docs:
        collections:
          posts: { name: Posts, sort_by: date }
          docs: { name: Docs }

      stygian:
        nav:
          collection: posts
        theme: { default: dark }
    YAML
  end

  def nav_order_of(html)
    nav = html[/<nav class="docs__nav".*?<\/nav>/m]
    return [] unless nav
    nav.scan(%r{<a[^>]*>([^<]+)</a>}m).flatten
  end

  def build_blog(extras: [])
    src, dest = rebuild_blog(extras: extras)
    yield src, dest
  ensure
    FileUtils.remove_entry(dest) if dest && Dir.exist?(dest)
    FileUtils.remove_entry(src) if src && Dir.exist?(src)
  end

  def ld_types(html)
    html.scan(%r{<script type="application/ld\+json">(.*?)</script>}m)
        .map { |s| JSON.parse(s.first) }
  end

  it "sorts an opted-in collection chronologically, newest first" do
    build_blog do |_src, dest|
      html = read(dest, "posts/2026/03/09-newest/index.html")
      expect(nav_order_of(html)).to eq([
        "Newest Post", "Middle Post", "Oldest Post", "Docs Intro", "Docs Deep",
      ])
    end
  end

  it "leaves non-opted-in collections on nav_order ordering" do
    build_blog do |_src, dest|
      html = read(dest, "docs/deep/index.html")
      order = nav_order_of(html)
      expect(order).to eq([
        "Newest Post", "Middle Post", "Oldest Post", "Docs Intro", "Docs Deep",
      ])
      # docs still follow nav_order: Intro (1) before Deep (2)
      expect(order.index("Docs Intro")).to be < order.index("Docs Deep")
    end
  end

  it "renders prev/next across the collection boundary in date order" do
    build_blog do |_src, dest|
      html = read(dest, "posts/2025/07/01-middle/index.html")
      expect(html).to include('class="prev-next__dir">Previous')
      expect(html).to include('class="prev-next__dir">Next')
      expect(html).to include(">Oldest Post<")
      expect(html).to include(">Newest Post<")
    end
  end

  it "renders post meta, tag chips and no breadcrumbs on a blog post" do
    build_blog do |_src, dest|
      html = read(dest, "posts/2026/03/09-newest/index.html")
      expect(html).to include("post-meta")
      expect(html).to match(%r{<time[^>]*datetime="2026-03-09">March 9, 2026</time>})
      expect(html).to include("Excerpt for Newest Post.")
      expect(html).to include('class="post-tag">kubernetes</span>')
      expect(html).not_to include('aria-label="Breadcrumb"')
      expect(html).not_to include("docs__children")
    end
  end

  it "emits BlogPosting JSON-LD instead of breadcrumbs on a blog post" do
    build_blog do |_src, dest|
      html = read(dest, "posts/2026/03/09-newest/index.html")
      types = ld_types(html).map { |j| j["@type"] }
      # head emits WebSite; the post shell emits BlogPosting, not BreadcrumbList
      expect(types).to include("WebSite")
      expect(types).to include("BlogPosting")
      expect(types).not_to include("BreadcrumbList")
      article = ld_types(html).find { |j| j["@type"] == "BlogPosting" }
      expect(article["headline"]).to eq("Newest Post")
      expect(article["datePublished"]).to include("2026-03-09")
      expect(article["keywords"]).to include("kubernetes")
    end
  end

  it "keeps BreadcrumbList on a docs page" do
    build_blog do |_src, dest|
      html = read(dest, "docs/deep/index.html")
      types = ld_types(html).map { |j| j["@type"] }
      expect(types).to include("BreadcrumbList")
      expect(types).not_to include("BlogPosting")
    end
  end

  it "honors post: true from another layout" do
    build_blog(extras: [
      ["release.md",
       "---\nlayout: docs\npost: true\ntitle: \"Release Notes\"\n" \
       "date: 2026-09-01\nexcerpt: \"Release notes excerpt.\"\n" \
       "tags: [\"releases\"]\n---\n\n## Notes\n\nNotes body.\n"],
    ]) do |_src, dest|
      html = read(dest, "release.html")
      expect(html).to include("post-meta")
      expect(html).to include('datetime="2026-09-01">')
      expect(html).to include('class="post-tag">releases</span>')
      expect(html).not_to include('aria-label="Breadcrumb"')
      types = ld_types(html).map { |j| j["@type"] }
      expect(types).to include("BlogPosting")
      expect(types).not_to include("BreadcrumbList")
    end
  end

  it "honors date_order: asc" do
    src, dest = rebuild_blog(extras: [])
    File.write(File.join(src, "_config.yml"), blog_config.sub(
      "collection: posts",
      "collection: posts\n    date_order: asc",
    ))
    cfg = Jekyll.configuration(
      "source" => src, "destination" => dest,
      "theme" => "stygian", "quiet" => true, "disable_disk_cache" => true
    )
    Jekyll::Site.new(cfg).process
    html = read(dest, "posts/2024/01/15-oldest/index.html")
    order = nav_order_of(html)
    # ascending: oldest first, docs still after the posts
    expect(order.index("Oldest Post")).to be < order.index("Middle Post")
    expect(order.index("Middle Post")).to be < order.index("Newest Post")
    expect(order.index("Docs Intro")).to be > order.index("Newest Post")
  ensure
    FileUtils.remove_entry(dest) if dest && Dir.exist?(dest)
    FileUtils.remove_entry(src) if src && Dir.exist?(src)
  end

  it "renders the post-list archive newest first" do
    build_blog(extras: [
      ["archive.md",
       "---\nlayout: docs\ntitle: Archive\nnav_order: 9\n---\n" \
       "{%- include post-list.html -%}\n"],
    ]) do |_src, dest|
      html = read(dest, "archive.html")
      expect(html.scan('class="post-list__item"').length).to eq(3)
      expect(html.index("Newest Post")).to be < html.index("Middle Post")
      expect(html.index("Middle Post")).to be < html.index("Oldest Post")
      expect(html).to include('class="post-tag">kubernetes</span>')
    end
  end

  it "renders an RSS 2.0 feed with newest first and feed_exclude honored" do
    src, dest = rebuild_blog(extras: [
      ["_posts/2027-01-01-draft.md",
       "---\nlayout: blog\ntitle: \"Draft Post\"\nfeed_exclude: true\n" \
       "excerpt: \"Excluded from the feed.\"\n---\n\n## Draft\n\nDraft body.\n"],
      ["feed.xml", File.read(File.join(ROOT, "feed.xml"))],
    ])
    cfg = Jekyll.configuration(
      "source" => src, "destination" => dest,
      "theme" => "stygian", "quiet" => true, "disable_disk_cache" => true
    )
    Jekyll::Site.new(cfg).process
    xml = read(dest, "feed.xml")
    expect(xml).to match(/<rss version="2\.0"/)
    expect(xml).to include('xmlns:atom="http://www.w3.org/2005/Atom"')
    expect(xml).not_to include("Draft Post")
    expect(xml.index("Newest Post")).to be < xml.index("Middle Post")
    expect(xml.index("Middle Post")).to be < xml.index("Oldest Post")
    expect(xml).to include("<category>kubernetes</category>")
    expect(xml).to include("Excerpt for Newest Post.")
    expect(xml).to match(%r{<link>https://blog\.example\.com/posts/2026/03/09-newest/</link>})
    expect(xml).to include("<lastBuildDate>")
  ensure
    FileUtils.remove_entry(dest) if dest && Dir.exist?(dest)
    FileUtils.remove_entry(src) if src && Dir.exist?(src)
  end

  it "ships the new blog files in the gemspec" do
    gemspec = Gem::Specification.load(File.join(ROOT, "stygian.gemspec"))
    %w[_layouts/blog.html _includes/collection-sort.html
       _includes/post-list.html feed.xml].each do |f|
      expect(gemspec.files).to include(f), "gemspec should ship #{f}"
    end
  end

  it "documents the blog feature" do
    expect(File.exist?(File.join(ROOT, "_docs", "blog.md"))).to be(true)
    doc = File.read(File.join(ROOT, "_docs", "blog.md"))
    %w[sort_by layout: blog feed.xml date_order post-list].each do |needle|
      expect(doc).to include(needle), "blog.md should mention #{needle}"
    end
  end
end
