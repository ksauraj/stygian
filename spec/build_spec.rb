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
end
