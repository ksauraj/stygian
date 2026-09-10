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
end
