import { readFileSync } from "node:fs"
import { join } from "node:path"

import { expect, test } from "vitest"

const source = readFileSync(join(import.meta.dirname, "globals.css"), "utf8")

const primitives = [
  ["--night", "#000000"],
  ["--surface", "#0c0c0e"],
  ["--surface-alternate", "#131316"],
  ["--surface-sunken", "#1a1a1e"],
  ["--text-primary", "#f4f4f5"],
  ["--text-night", "#d4d4d8"],
  ["--text-body", "#b4b4bc"],
  ["--text-muted", "#8e8e97"],
  ["--text-faint", "#71717a"],
  ["--palette-border", "#27272a"],
  ["--accent-primary", "#0ea5e9"],
  ["--accent-deep", "#0284c7"],
  ["--accent-strong", "#38bdf8"],
  ["--accent-light", "#7dd3fc"],
  ["--white", "#ffffff"],
  ["--on-light-accent", "#06202e"],
  ["--semantic-red", "#e81820"],
  ["--semantic-red-text", "#ff6b70"],
  ["--blue-band-start", "#041a2a"],
  ["--blue-band-end", "#0b3350"],
  ["--blue-band-text", "#bad5e6"],
  ["--frost-start", "#000428"],
  ["--frost-end", "#004e92"],
] as const

const semanticTokens = [
  ["--background", "--surface"],
  ["--sidebar", "--surface"],
  ["--foreground", "--text-primary"],
  ["--card-foreground", "--text-primary"],
  ["--popover-foreground", "--text-primary"],
  ["--sidebar-foreground", "--text-primary"],
  ["--card", "--surface-alternate"],
  ["--secondary", "--surface-alternate"],
  ["--sidebar-accent", "--surface-alternate"],
  ["--popover", "--surface-sunken"],
  ["--muted", "--surface-sunken"],
  ["--muted-foreground", "--text-muted"],
  ["--primary", "--accent-primary"],
  ["--sidebar-primary", "--accent-primary"],
  ["--primary-foreground", "--on-light-accent"],
  ["--sidebar-primary-foreground", "--on-light-accent"],
  ["--accent", "--accent-strong"],
  ["--accent-foreground", "--on-light-accent"],
  ["--destructive", "--semantic-red"],
  ["--border", "--palette-border"],
  ["--input", "--palette-border"],
  ["--sidebar-border", "--palette-border"],
  ["--ring", "--accent-strong"],
  ["--sidebar-ring", "--accent-strong"],
] as const

function rootBlock() {
  const blocks = source.match(/:root\s*\{[\s\S]*?\n\}/g)
  expect(blocks).toHaveLength(1)
  return blocks![0]
}

test(":root defines each Bethel AG primitive once and maps semantic tokens in one dark scheme", () => {
  const root = rootBlock()

  for (const [name, value] of primitives) {
    expect(root).toMatch(new RegExp(`${name}:\\s*${value}(?![0-9a-fA-F])`, "i"))
    expect(root.match(new RegExp(`${name}\\s*:`, "g"))).toHaveLength(1)
    expect(source.match(new RegExp(`${name}\\s*:`, "g"))).toHaveLength(1)
  }

  for (const [token, primitive] of semanticTokens) {
    expect(root).toMatch(new RegExp(`${token}:\\s*var\\(${primitive}\\)`, "i"))
    expect(source.match(new RegExp(`${token}\\s*:`, "g"))).toHaveLength(1)
  }

  expect(root).toMatch(/color-scheme:\s*dark/)
  expect(source.match(/color-scheme\s*:/g)).toHaveLength(1)
  expect(source).not.toMatch(/color-scheme:\s*light/)
  expect(source).not.toMatch(/prefers-color-scheme/)
  expect(source).not.toMatch(/\.light\b/)
  expect(source).not.toMatch(/\.dark\s*\{/)
})

test("chart series use distinct Bethel AG primitives", () => {
  const root = rootBlock()
  const primitiveNames = primitives.map(([name]) => name).join("|")
  const charts = ["--chart-1", "--chart-2", "--chart-3", "--chart-4", "--chart-5"]
  const used = charts.map((token) => {
    const match = root.match(
      new RegExp(`${token}:\\s*var\\((${primitiveNames})\\)`, "i"),
    )
    expect(match, token).not.toBeNull()
    return match![1]
  })

  expect(new Set(used).size).toBe(charts.length)
})

test("legacy colour aliases and superseded opaque colours stay absent", () => {
  for (const name of [
    "--ink",
    "--paper",
    "--mist",
    "--acid",
    "--cobalt",
    "--band",
    "--band-ink",
    "--band-link",
  ]) {
    expect(source).not.toMatch(new RegExp(`${name}(?![\\w-])`))
  }

  expect(source).not.toMatch(/#d0af3b/i)
  expect(source).not.toMatch(/#020411/i)
  expect(source).not.toMatch(/mask-image:\s*radial-gradient/)
  expect(source).not.toMatch(/-webkit-mask-image:\s*radial-gradient/)
})

test("every opaque colour is one Bethel AG primitive declaration", () => {
  const allowed = new Set(primitives.map(([, value]) => value.toLowerCase()))
  const expected = primitives.map(([, value]) => value.toLowerCase()).sort()
  const opaque: string[] = []

  for (const raw of source.match(/#[0-9a-fA-F]{3,8}\b/g) ?? []) {
    const hex = raw.toLowerCase()
    if (hex.length === 9 || hex.length === 5) {
      const channels = hex.length === 9 ? hex.slice(1, 7) : [...hex.slice(1, 4)].map((channel) => channel + channel).join("")
      expect(allowed.has(`#${channels}`), raw).toBe(true)
      continue
    }

    const normalized =
      hex.length === 4
        ? `#${[...hex.slice(1)].map((channel) => channel + channel).join("")}`
        : hex
    expect(allowed.has(normalized), raw).toBe(true)
    opaque.push(normalized)
  }

  expect(opaque.sort()).toEqual(expected)
})

const namedColours = [
  "aliceblue", "antiquewhite", "aqua", "aquamarine", "azure", "beige", "bisque", "black",
  "blanchedalmond", "blue", "blueviolet", "brown", "burlywood", "cadetblue", "chartreuse",
  "chocolate", "coral", "cornflowerblue", "cornsilk", "crimson", "cyan", "darkblue",
  "darkcyan", "darkgoldenrod", "darkgray", "darkgreen", "darkgrey", "darkkhaki",
  "darkmagenta", "darkolivegreen", "darkorange", "darkorchid", "darkred", "darksalmon",
  "darkseagreen", "darkslateblue", "darkslategray", "darkslategrey", "darkturquoise",
  "darkviolet", "deeppink", "deepskyblue", "dimgray", "dimgrey", "dodgerblue", "firebrick",
  "floralwhite", "forestgreen", "fuchsia", "gainsboro", "ghostwhite", "gold", "goldenrod",
  "gray", "green", "greenyellow", "grey", "honeydew", "hotpink", "indianred", "indigo",
  "ivory", "khaki", "lavender", "lavenderblush", "lawngreen", "lemonchiffon", "lightblue",
  "lightcoral", "lightcyan", "lightgoldenrodyellow", "lightgray", "lightgreen", "lightgrey",
  "lightpink", "lightsalmon", "lightseagreen", "lightskyblue", "lightslategray",
  "lightslategrey", "lightsteelblue", "lightyellow", "lime", "limegreen", "linen", "magenta",
  "maroon", "mediumaquamarine", "mediumblue", "mediumorchid", "mediumpurple",
  "mediumseagreen", "mediumslateblue", "mediumspringgreen", "mediumturquoise",
  "mediumvioletred", "midnightblue", "mintcream", "mistyrose", "moccasin", "navajowhite",
  "navy", "oldlace", "olive", "olivedrab", "orange", "orangered", "orchid", "palegoldenrod",
  "palegreen", "paleturquoise", "palevioletred", "papayawhip", "peachpuff", "peru", "pink",
  "plum", "powderblue", "purple", "rebeccapurple", "red", "rosybrown", "royalblue",
  "saddlebrown", "salmon", "sandybrown", "seagreen", "seashell", "sienna", "silver",
  "skyblue", "slateblue", "slategray", "slategrey", "snow", "springgreen", "steelblue",
  "tan", "teal", "thistle", "tomato", "turquoise", "violet", "wheat", "white", "whitesmoke",
  "yellow", "yellowgreen", "accentcolor", "accentcolortext", "activetext", "buttonborder",
  "buttonface", "buttontext", "canvas", "canvastext", "fieldtext", "graytext", "highlighttext",
  "linktext", "marktext", "selecteditem", "selecteditemtext", "visitedtext",
].join("|")

test("named colours and colour functions stay absent", () => {
  const painted = source.replace(/\/\*[\s\S]*?\*\//g, "")
  expect(painted).not.toMatch(
    /(?<![\w-])(?:rgba?|hsla?|hwb|lab|lch|oklab|oklch|color-mix|light-dark)\(/i,
  )
  expect(painted).not.toMatch(/(?<![\w-])color\(/i)
  expect(painted).not.toMatch(new RegExp(`(?<![\\w-])(?:${namedColours})(?![\\w-])`, "i"))
})

test("shared shell uses role tokens and sky-blue interaction states", () => {
  expect(source).toMatch(/body\s*\{[^}]*bg-background/)
  expect(source).toMatch(/body\s*\{[^}]*text-foreground/)
  expect(source).toMatch(/\.site-header\s*\{[^}]*background:\s*var\(--night\)/)
  expect(source).toMatch(/\.site-header\s*\{[^}]*border-bottom:[^;]*var\(--border\)/)
  expect(source).toMatch(/\.site-footer\s*\{[^}]*background:\s*var\(--night\)/)
  expect(source).toMatch(/\.site-footer\s*\{[^}]*border-top:[^;]*var\(--border\)/)
  expect(source).toMatch(/\.public-navigation a\s*\{[^}]*color:\s*var\(--foreground\)/)
  expect(source).toMatch(
    /\.public-navigation a:hover,\s*\.public-navigation a\[aria-current="page"\]\s*\{[^}]*color:\s*var\(--accent-primary\)/,
  )
  expect(source).toMatch(/(?:^|\n)a\s*\{[^}]*color:\s*var\(--accent-primary\)/)
  expect(source).toMatch(/(?:^|\n)a:hover\s*\{[^}]*color:\s*var\(--accent-deep\)/)
  expect(source).toMatch(/\.text-link,\s*\.section-link\s*\{[^}]*color:\s*var\(--accent-primary\)/)
  expect(source).toMatch(/\.text-link:hover,\s*\.section-link:hover\s*\{[^}]*color:\s*var\(--accent-deep\)/)
  expect(source).toMatch(/::selection\s*\{[^}]*background:\s*var\(--primary\)[^}]*color:\s*var\(--primary-foreground\)/)
  expect(source).toMatch(/:focus-visible\s*\{[^}]*outline:\s*2px solid var\(--ring\)[^}]*outline-offset:\s*6px/)
  expect(source).toMatch(/scrollbar-color:\s*var\(--text-faint\)\s+var\(--surface\)/)
  expect(source).toMatch(/::-webkit-scrollbar-track\s*\{[^}]*background:\s*var\(--surface\)/)
  expect(source).toMatch(/::-webkit-scrollbar-thumb\s*\{[^}]*background:\s*var\(--text-faint\)/)
  expect(source).toMatch(/\.skip-link\s*\{[^}]*background:\s*var\(--primary\)[^}]*color:\s*var\(--on-light-accent\)/)
  expect(source).toMatch(
    /\.skip-link:hover,\s*\.skip-link:active\s*\{[^}]*background:\s*var\(--accent-strong\)[^}]*color:\s*var\(--on-light-accent\)/,
  )
  expect(source).toMatch(/\.menu-toggle\s*\{[^}]*color:\s*var\(--foreground\)/)
})

test("error state uses semantic red text while the shell heading stays blue", () => {
  expect(source).toMatch(/\.shell-page h1\s*\{[^}]*color:\s*var\(--accent-light\)/)
  expect(source).not.toMatch(/\.shell-page h1\s*\{[^}]*semantic-red/)
  expect(source).toMatch(
    /\.shell-page\.error-state\s*\{[^}]*background:\s*transparent[^}]*color:\s*var\(--text-primary\)/,
  )
  expect(source).toMatch(/\.shell-page\.error-state h1\s*\{[^}]*color:\s*var\(--semantic-red-text\)/)
  expect(source).toMatch(/\.shell-page\.error-state \.text-link\s*\{[^}]*color:\s*var\(--accent-primary\)/)
  expect(source).toMatch(
    /\.shell-page\.error-state \.text-link:hover\s*\{[^}]*color:\s*var\(--accent-deep\)/,
  )
})

test("focus stays visible and the menu breakpoint is 800px", () => {
  expect(source).toMatch(/\.menu-toggle:focus\s*\{\s*display:\s*flex\s*;?\s*\}/)
  expect(source).toMatch(/@media\s*\(\s*max-width:\s*800px\s*\)/)
  expect(source).not.toMatch(/max-width:\s*63\.999rem/)
  expect(source).not.toMatch(/min-width:\s*64rem/)
})

test("body is 16px / 1.6; display type is Oswald uppercase weight 500", () => {
  expect(source).toMatch(/body\s*\{[^}]*font-size:\s*16px/)
  expect(source).toMatch(/body\s*\{[^}]*line-height:\s*1\.6/)
  expect(source).toMatch(/h1\s*,\s*h2\s*,\s*\.monogram/)
  expect(source).toMatch(/\.time[^{]*\{[^}]*font-family:\s*var\(--font-display\)/)
  expect(source).toMatch(/font-family:\s*var\(--font-display\)/)
  expect(source).toMatch(/text-transform:\s*uppercase/)
  expect(source).toMatch(/font-weight:\s*500/)
  expect(source).toMatch(/--font-display/)
})

test("home testimony and stories regions stay out of the stylesheet", () => {
  expect(source).not.toMatch(/\.testimony-section\b/)
  expect(source).not.toMatch(/\.stories\b/)
})

test("wide region grids: hero two columns, event highlights two columns, sermons and visit beside", () => {
  expect(source).toMatch(/\.hero[^{]*\{[^}]*grid-template-columns:\s*1\.6fr\s+0?\.7fr/)
  expect(source).toMatch(
    /\.home-event-highlight-rows[^{]*\{[^}]*grid-template-columns:\s*16rem\s+16rem/,
  )
  expect(source).toMatch(/\.playlists[^{]*\{[^}]*grid-template-columns:\s*1fr\s+1fr/)
  expect(source).toMatch(/\.visit-grid[^{]*\{[^}]*grid-template-columns:/)
  expect(source).toMatch(/\.highlights[^{]*\{[^}]*display:\s*block/)
  expect(source).toMatch(/\.highlights\s+li[^{]*\{[^}]*display:\s*block/)
  expect(source).toMatch(/\.highlights\s+li[^{]*\{[^}]*border-top:/)
  expect(source).toMatch(/\.site-footer[^{]*\{[^}]*justify-content:\s*space-between/)
})

test("at 800px regions stack; portrait follows About; event highlights separated by a rule", () => {
  const narrow = source.match(/@media\s*\(\s*max-width:\s*800px\s*\)\s*\{([\s\S]*)/)
  expect(narrow).not.toBeNull()
  const block = narrow![1]
  expect(block).toMatch(/\.hero[^{]*\{[^}]*grid-template-columns:\s*1fr/)
  expect(block).toMatch(/\.home-event-highlight-rows[^{]*\{[^}]*grid-template-columns:\s*1fr/)
  expect(block).toMatch(/\.playlists[^{]*\{[^}]*grid-template-columns:\s*1fr/)
  expect(block).toMatch(/\.visit-grid[^{]*\{[^}]*grid-template-columns:\s*1fr/)
  expect(block).toMatch(/\.site-footer[^{]*\{[^}]*flex-direction:\s*column/)
  expect(block).toMatch(
    /\.home-event-highlight-row\s*\+\s*\.home-event-highlight-row[^{]*\{[^}]*border-top:|\.home-event-highlight-row[^{]*\{[^}]*border-top:/,
  )
  expect(block).not.toMatch(/\.stories\b/)
  expect(source).not.toMatch(/\.leader-copy\s*\{\s*display:\s*contents/)
})

test("headings keep measure under 65ch; no ellipsis or fixed text height clipping", () => {
  expect(source).toMatch(/max-width:\s*65ch/)
  expect(source).not.toMatch(/text-overflow:\s*ellipsis/)
  expect(source).not.toMatch(/-webkit-line-clamp/)
  expect(source).not.toMatch(/line-clamp:\s*[1-9]/)
  expect(source).not.toMatch(/(?:^|[^-\w])height:\s*[0-9.]+(?:px|rem|em|vh|%)/m)
})

test("reference design strings stay out of the stylesheet", () => {
  expect(source).not.toMatch(/Church news & gatherings/)
  expect(source).not.toMatch(/Messages & teaching/)
  expect(source).not.toMatch(/The Word,\s*wherever you are/i)
  expect(source).not.toMatch(/Leader portrait placeholder/)
  expect(source).not.toMatch(/Return Home/)
  expect(source).not.toMatch(/Design concept/)
})

test("Watch scripture block stays scoped under .watch-page", () => {
  expect(source).toMatch(
    /\.watch-page\s+\.watch-scripture[^{]*\{[^}]*width:\s*100%/,
  )
  expect(source).not.toMatch(/(?<!\.watch-page\s+)\.watch-scripture\s*\{/)
})

const paintedSource = source.replace(/\/\*[\s\S]*?\*\//g, "")

function normalizedSelector(selector: string) {
  return selector.replace(/\s+/g, " ").trim()
}

function ruleBodies(selector: string) {
  const want = normalizedSelector(selector)
  const bodies: string[] = []
  for (const match of paintedSource.matchAll(/([^{}]+)\{([^{}]*)\}/g)) {
    const selectors = match[1].split(",").map((part) => normalizedSelector(part))
    if (selectors.includes(want)) bodies.push(match[2])
  }
  return bodies
}

function backgroundValues(body: string) {
  return [...body.matchAll(/(?<![\w-])background(?:-color)?\s*:\s*([^;]+)/g)].map((match) =>
    match[1].trim(),
  )
}

const surfaceSections = [
  ".home-page.page-width",
  ".hero",
  ".home-section",
  ".visit",
  ".about-page",
  ".about-page .about-scenes",
  ".about-page .scene",
  ".about-page .copy",
  ".watch-page",
  ".watch-page .watch-live",
  ".watch-page .watch-testimonies",
  ".watch-page .watch-sermon-rows",
  ".contact-page",
  ".contact-page .contact-main",
  ".contact-page .contact-visit",
  ".contact-page .contact-strip",
  ".timeline",
  ".sunday",
] as const

const boundedSurfaces = [
  [".portrait-field", ["var(--night)"]],
  [".highlights li.scripture-tile", ["var(--blue-band-start)"]],
  [".home-event-highlight-surface", ["var(--night)"]],
  [".home-event-highlight-surface img", ["var(--night)"]],
  [".playlists .channel", ["var(--blue-band-start)"]],
  [".visit .service-records", ["transparent"]],
  [".about-page .plate", ["var(--night) center / cover no-repeat"]],
  [".about-page #born-again .plate", ["var(--night)"]],
  [".about-page #church .plate", ["var(--night)"]],
  [".about-page .plate.band", ["transparent"]],
  [".give-page", ["transparent"]],
  [".give-page .give-main", ["transparent"]],
  [".give-page .give-scripture", ["transparent"]],
  [".give-page .give-why", ["transparent"]],
  [".give-page .give-help", ["transparent"]],
  [".give-page .give-cta", ["var(--accent-primary)"]],
  [".give-page .give-cta:hover", ["var(--accent-strong)"]],
  [".give-page .give-cta:active", ["var(--accent-strong)"]],
  [".watch-page .watch-live img", ["var(--night)"]],
  [".watch-page .watch-scripture", ["var(--blue-band-start)"]],
  [".watch-page .watch-testimony-surface", ["var(--night)"]],
  [".watch-page .watch-testimony-surface img", ["var(--night)"]],
  [".watch-page .watch-sermon-scroller img", ["var(--night)"]],
  [".contact-page .contact-arrival", ["transparent"]],
  [".contact-page .contact-arrival-list", ["transparent"]],
  [".contact-page .contact-directions", ["var(--accent-primary)"]],
  [".contact-page .contact-directions:hover", ["var(--accent-strong)"]],
  [".contact-page .contact-directions:active", ["var(--accent-strong)"]],
  [".breakout", ["var(--blue-band-start)"]],
  [".breakout .photo", ["var(--night)"]],
  [".add-menu", ["var(--surface-sunken)"]],
  [".sunday .add-menu", ["var(--surface-sunken)"]],
] as const

test("public route sections stay on Surface and bounded treatments use role tokens", () => {
  for (const selector of surfaceSections) {
    const values = ruleBodies(selector).flatMap(backgroundValues)
    expect(values, selector).toEqual(["transparent"])
    for (const body of ruleBodies(selector)) {
      expect(body, selector).not.toMatch(/var\(--(?:surface-alternate|surface-sunken|night|blue-band-)/)
      expect(body, selector).not.toMatch(/linear-gradient/)
    }
  }

  for (const [selector, expected] of boundedSurfaces) {
    const values = ruleBodies(selector).flatMap(backgroundValues)
    expect(values, selector).toEqual([...expected])
  }

  for (const selector of [
    ".give-page .give-cta",
    ".give-page .give-cta:hover",
    ".give-page .give-cta:active",
    ".contact-page .contact-directions",
    ".contact-page .contact-directions:hover",
    ".contact-page .contact-directions:active",
  ]) {
    const bodies = ruleBodies(selector).join("\n")
    expect(bodies, selector).toMatch(/color:\s*var\(--on-light-accent\)/)
    expect(bodies, selector).not.toMatch(/color:\s*var\(--white\)/)
  }

  expect(ruleBodies(".watch-page .watch-sermon-row-title").join("\n")).toMatch(
    /color:\s*var\(--accent-light\)/,
  )
  expect(ruleBodies(".watch-page .watch-sermon-row-title a:hover").join("\n")).toMatch(
    /color:\s*var\(--accent-deep\)/,
  )
  expect(ruleBodies(".add-menu").join("\n")).toMatch(
    /border:\s*1px solid var\(--text-faint\)/,
  )
  expect(ruleBodies(".contact-page .contact-strip span").join("\n")).toMatch(
    /color:\s*var\(--text-primary\)/,
  )
  expect(ruleBodies(".contact-page .contact-strip a").join("\n")).toMatch(
    /color:\s*var\(--accent-primary\)/,
  )
  expect(ruleBodies(".contact-page .contact-strip a").join("\n")).not.toMatch(
    /color:\s*var\(--text-primary\)/,
  )

  const sectionSelector = new Set<string>(surfaceSections)
  for (const match of paintedSource.matchAll(/([^{}]+)\{([^{}]*)\}/g)) {
    const selectors = match[1].split(",").map((part) => normalizedSelector(part))
    const paintsBand = /var\(--blue-band-|linear-gradient/.test(match[2])
    if (!paintsBand) continue
    for (const selector of selectors) {
      expect(sectionSelector.has(selector), selector).toBe(false)
    }
  }
})

test("timeline spine, tick, breakout, and sunday keep their structure", () => {
  expect(source).toMatch(/\.spine\s*\{/)
  expect(source).toMatch(/\.tick\s*\{/)
  expect(source).toMatch(/\.tick::before/)
  expect(source).toMatch(/\.breakout\s*\{/)
  expect(source).toMatch(/\.sunday\s*\{/)
  expect(source).not.toMatch(/\.breakout[^}]*border-radius|\.breakout[^}]*box-shadow/)
  expect(source).toMatch(/\.add summary[^}]*min-height:\s*44px/)
  expect(source).toMatch(/\.add-menu a[^}]*min-height:\s*44px/)
  const narrow = source.match(/@media\s*\(\s*max-width:\s*800px\s*\)\s*\{([\s\S]*)/)
  expect(narrow).not.toBeNull()
  expect(narrow![1]).toMatch(
    /\.breakout,\s*\.sunday-grid,\s*\.tick|\.tick,\s*\.breakout,\s*\.sunday-grid|\.breakout[^{]*\{[^}]*grid-template-columns:\s*1fr/,
  )
})
