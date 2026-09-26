import { readFileSync } from "node:fs"
import { join } from "node:path"

import { expect, test } from "vitest"

const source = readFileSync(join(import.meta.dirname, "page.tsx"), "utf8")
const globalsSource = readFileSync(
  join(import.meta.dirname, "../globals.css"),
  "utf8",
)

test("document title is Give; page has no shell sentence", () => {
  expect(source).toMatch(/title:\s*["']Give["']/)
  expect(source).not.toMatch(/This page will be published here/)
})

test("imports give content and anchors #main-content", () => {
  expect(source).toMatch(/from\s+["']@\/content\/give["']/)
  expect(source).toMatch(/id=["']main-content["']/)
  expect(source).toMatch(/\bscripture\b/)
  expect(source).toMatch(/\bwhyWeGive\b/)
  expect(source).toMatch(/\bgiveCta\b/)
  expect(source).toMatch(/\bhelpBar\b/)
})

test("h1 is Why we give; GIVE uses G7 new-tab attrs", () => {
  expect(source).toMatch(/<h1[\s\S]*?whyWeGive\.heading/)
  expect(source).toMatch(
    /href=\{giveCta\.href\}[^>]*target=["']_blank["'][^>]*rel=["']noopener noreferrer["']|href=\{giveCta\.href\}[^>]*rel=["']noopener noreferrer["'][^>]*target=["']_blank["']/,
  )
  expect(source).toMatch(/\{giveCta\.label\}/)
})

test("help bar is a sibling after #main-content; tel and mailto omit target blank", () => {
  const mainClose = source.search(/<\/main>/)
  const helpPhone = source.search(/helpBar\.phone/)
  const helpEmail = source.search(/helpBar\.email/)
  expect(mainClose).toBeGreaterThan(-1)
  expect(helpPhone).toBeGreaterThan(mainClose)
  expect(helpEmail).toBeGreaterThan(mainClose)

  const afterMain = source.slice(mainClose)
  expect(afterMain).toMatch(/href=\{helpBar\.phone\.href\}/)
  expect(afterMain).toMatch(/href=\{helpBar\.email\.href\}/)
  expect(afterMain).not.toMatch(
    /href=\{helpBar\.phone\.href\}[^>]*target=["']_blank["']/,
  )
  expect(afterMain).not.toMatch(
    /href=\{helpBar\.email\.href\}[^>]*target=["']_blank["']/,
  )
  expect(afterMain).not.toMatch(/target=["']_blank["']/)
})

test("give CSS is scoped under .give-page", () => {
  expect(globalsSource).toMatch(/\.give-page\b/)
  expect(globalsSource).toMatch(/\.give-page[\s\S]*give-leaflet|\.give-page\s+\.give-leaflet/)
  expect(globalsSource).toMatch(/\.give-page[\s\S]*give-help|\.give-page\s+\.give-help/)
})

function giveTabletStackBlock(css: string): string {
  const marker = "@media (max-width: 64rem)"
  let from = 0
  while (from < css.length) {
    const start = css.indexOf(marker, from)
    if (start < 0) {
      throw new Error("no @media (max-width: 64rem) block found")
    }
    const open = css.indexOf("{", start)
    let depth = 0
    for (let i = open; i < css.length; i++) {
      const ch = css[i]
      if (ch === "{") depth += 1
      else if (ch === "}") {
        depth -= 1
        if (depth === 0) {
          const block = css.slice(open + 1, i)
          if (block.includes(".give-page .give-leaflet")) return block
          from = i + 1
          break
        }
      }
    }
  }
  throw new Error("no give-page tablet stack media block found")
}

test("Give panels stay clipped to the page base at tablet-owned widths", () => {
  expect(globalsSource).toMatch(
    /\.give-page\s*\{[^}]*overflow:\s*clip[^}]*background:\s*var\(--ink\)/,
  )
  expect(globalsSource).toMatch(
    /\.give-page\s+\.give-scripture\s*\{[^}]*overflow:\s*hidden/,
  )
  expect(globalsSource).toMatch(
    /\.give-page\s+\.give-why\s*\{[^}]*overflow:\s*hidden/,
  )

  const tabletBlock = giveTabletStackBlock(globalsSource)
  expect(tabletBlock).toMatch(
    /\.give-page\s+\.give-leaflet\s*\{[^}]*grid-template-columns:\s*1fr/,
  )
  expect(tabletBlock).toMatch(/\.give-page\s+\.give-help\s*\{/)
})

test("Give citation stays above the help bar in document order", () => {
  const citation = source.search(/give-scripture-citation|scripture\.citation/)
  const help = source.search(/className=["']give-help["']/)
  expect(citation).toBeGreaterThan(-1)
  expect(help).toBeGreaterThan(citation)
  expect(globalsSource).toMatch(
    /\.give-page\s*\{[^}]*flex-direction:\s*column/,
  )
  expect(globalsSource).not.toMatch(
    /\.give-page\s+\.give-help\s*\{[^}]*order:\s*-?\d/,
  )
})
