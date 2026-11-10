import AxeBuilder from "@axe-core/playwright"
import { expect, test, type Page } from "@playwright/test"

import { giveCta } from "../src/content/give"
import { visit } from "../src/content/contact"
import { routes, sections, sundayServices } from "./copy"
import {
  atMenu,
  bethel,
  desktop,
  expectMinHeight,
  headerNav,
  phone,
  tabletPortrait,
} from "./helpers"

function firstSermonVideo(page: Page) {
  return page
    .getByRole("region", { name: "Sermons" })
    .locator('a[href^="https://www.youtube.com/watch?v="]')
    .first()
}

async function expectNoSeriousViolations(page: Page) {
  const results = await new AxeBuilder({ page }).analyze()
  const blocking = results.violations.filter(
    (violation) => violation.impact === "critical" || violation.impact === "serious",
  )
  expect(blocking).toEqual([])
}

const surfaceWidths = [phone, tabletPortrait, desktop] as const

const surfaceRoutes = [
  { path: "/", footer: true, selectors: [".hero", ".home-page", ".home-section"] },
  {
    path: "/about",
    footer: true,
    selectors: [".about-scenes", ".about-page .scene", ".about-page .copy"],
  },
  { path: "/events", footer: true, selectors: [".timeline", ".sunday"] },
  {
    path: "/watch",
    footer: true,
    selectors: [".watch-page", ".watch-testimonies", ".watch-sermon-rows"],
  },
  {
    path: "/contact",
    footer: false,
    selectors: [".contact-page", ".contact-visit", ".contact-arrival", ".contact-strip"],
  },
  { path: "/give", footer: true, selectors: [".give-page", ".give-main", ".give-why"] },
] as const

async function expectSurface(page: Page, selector: string) {
  const locators = page.locator(selector)
  const count = await locators.count()
  expect(count, selector).toBeGreaterThan(0)
  for (let index = 0; index < count; index += 1) {
    await expect(locators.nth(index)).toHaveCSS("background-color", bethel.surface)
  }
}

test("home and shells have no serious axe violations", async ({ page }) => {
  // /watch reads eight Atom feeds; axe across all routes needs headroom.
  test.setTimeout(60_000)
  await page.setViewportSize(desktop)
  for (const route of routes) {
    await page.goto(route.path)
    await expectNoSeriousViolations(page)
  }
  await page.setViewportSize(atMenu)
  await page.goto("/")
  await expectNoSeriousViolations(page)
})

test("paints the shell and major sections with Surface at phone, tablet, and desktop", async ({
  page,
}) => {
  test.setTimeout(180_000)
  for (const viewport of surfaceWidths) {
    await page.setViewportSize(viewport)
    for (const route of surfaceRoutes) {
      await page.goto(route.path)
      await expect(page.locator("body")).toHaveCSS("background-color", bethel.surface)
      await expect(page.getByRole("banner")).toHaveCSS("background-color", bethel.surface)
      if (route.footer) {
        await expect(page.getByRole("contentinfo")).toHaveCSS("background-color", bethel.surface)
      } else {
        await expect(page.locator("footer.site-footer")).toHaveCount(0)
      }
      for (const selector of route.selectors) {
        await expectSurface(page, selector)
      }
    }
  }
})

test("gives Menu, navigation, and section links a 44px target", async ({ page }) => {
  await page.setViewportSize(atMenu)
  await page.goto("/")
  await expectMinHeight(page.getByRole("button", { name: "Menu" }))

  await page.setViewportSize(desktop)
  for (const link of await headerNav(page).getByRole("link").all()) {
    await expectMinHeight(link)
  }
  const sectionLinks = [
    page.getByRole("main").getByRole("link", { name: "About", exact: true }),
    page.getByRole("region", { name: sections[0] }).getByRole("link", { name: "Events" }),
    page.getByRole("region", { name: "Sermons" }).getByRole("link", { name: "Watch" }),
    page.getByRole("region", { name: "New to HSG?" }).getByRole("link", { name: "Know More" }),
  ]
  for (const link of sectionLinks) await expectMinHeight(link)
  await expectMinHeight(firstSermonVideo(page))
})

test("uses Bethel AG accent, on-accent, bounded, media, and semantic colours", async ({
  page,
}) => {
  test.setTimeout(120_000)
  await page.setViewportSize(desktop)
  await page.goto("/")

  await expect(page.locator("body")).toHaveCSS("color", bethel.textPrimary)
  await expect(page.locator("body")).toHaveCSS("font-size", "16px")
  await expect(page.getByRole("heading", { level: 1 })).toHaveCSS("text-transform", "uppercase")
  await expect(page.getByRole("heading", { level: 1 })).toHaveCSS("font-weight", "500")
  await expect(page.getByRole("heading", { level: 1 })).toHaveCSS("color", bethel.textPrimary)

  const headingFont = await page.getByRole("heading", { level: 1 }).evaluate((el) => getComputedStyle(el).fontFamily)
  const bodyFont = await page.locator("body").evaluate((el) => getComputedStyle(el).fontFamily)
  expect(headingFont).toMatch(/oswald/i)
  expect(bodyFont).toMatch(/dm[_\s]?sans/i)

  await expect(page.getByRole("region", { name: sections[0] })).toHaveCSS("background-color", bethel.surface)
  await expect(page.getByRole("region", { name: sections[0] }).getByRole("link", { name: "Events" })).toHaveCSS(
    "color",
    bethel.accentLight,
  )
  await expect(page.locator(".highlights li.scripture-tile")).toHaveCSS(
    "background-color",
    bethel.surfaceSunken,
  )
  await expect(page.locator(".home-event-highlight-surface").first()).toHaveCSS(
    "background-color",
    bethel.night,
  )
  await expect(page.locator(".portrait-field")).toHaveCSS("background-color", bethel.night)
  await expect(firstSermonVideo(page)).toHaveCSS("color", bethel.accentLight)
  await expect(page.getByRole("region", { name: "Sermons" })).toHaveCSS("background-color", bethel.surface)
  await expect(page.locator(".playlists .channel")).toHaveCSS(
    "background-color",
    bethel.surfaceAlternate,
  )

  const visitRegion = page.getByRole("region", { name: "New to HSG?" })
  await expect(visitRegion).toHaveCSS("background-color", bethel.surface)
  await expect(visitRegion.locator(".service-records")).toHaveCSS(
    "background-color",
    bethel.surfaceAlternate,
  )
  await expect(visitRegion.getByRole("heading", { level: 2 })).toHaveCSS("color", bethel.textPrimary)
  await expect(visitRegion.getByText(sundayServices[0]!.time)).toHaveCSS("color", bethel.textPrimary)

  await page.keyboard.press("Tab")
  const skip = page.getByRole("link", { name: "Skip to main content" })
  await expect(skip).toBeFocused()
  await expect(skip).toHaveCSS("background-color", bethel.accentPrimary)
  await expect(skip).toHaveCSS("color", bethel.onLightAccent)
  await expect(skip).toHaveCSS("outline-color", bethel.accentStrong)

  await page.goto("/about")
  await expect(headerNav(page).getByRole("link", { name: "About" })).toHaveCSS("color", bethel.accentStrong)
  await expect(page.locator("#born-again [role='img']")).toHaveCSS("background-color", bethel.night)
  await expect(page.locator("#church [role='img']")).toHaveCSS("background-color", bethel.night)
  await expect(page.locator("#story-continues")).toHaveCSS("background-color", bethel.surface)
  await expect(page.locator("#story-continues .plate")).toHaveCSS(
    "background-color",
    bethel.surfaceAlternate,
  )

  await page.goto("/watch")
  await expect(headerNav(page).getByRole("link", { name: "Watch", exact: true })).toHaveCSS(
    "color",
    bethel.accentStrong,
  )
  await expect(page.locator(".watch-testimonies")).toHaveCSS("background-color", bethel.surface)
  await expect(page.locator(".watch-scripture")).toHaveCSS("background-color", bethel.surfaceSunken)
  await expect(page.locator(".watch-testimony-surface").first()).toHaveCSS(
    "background-color",
    bethel.night,
  )
  await expect(page.locator(".watch-sermon-rows")).toHaveCSS("background-color", bethel.surface)

  await page.goto("/give")
  const give = page.getByRole("link", { name: giveCta.label, exact: true })
  await expect(give).toHaveCSS("background-color", bethel.accentPrimary)
  await expect(give).toHaveCSS("color", bethel.onLightAccent)
  await give.hover()
  await expect(give).toHaveCSS("background-color", bethel.accentStrong)
  await expect(give).toHaveCSS("color", bethel.onLightAccent)
  await expect(page.locator(".give-scripture")).toHaveCSS("background-color", bethel.surfaceAlternate)
  await expect(page.locator(".give-why")).toHaveCSS("background-color", bethel.surface)
  await expect(page.locator(".give-help")).toHaveCSS("background-color", bethel.surfaceAlternate)

  await page.goto("/contact")
  const directions = page.getByRole("link", { name: visit.directions.label })
  await expect(directions).toHaveCSS("background-color", bethel.accentPrimary)
  await expect(directions).toHaveCSS("color", bethel.onLightAccent)
  await directions.hover()
  await expect(directions).toHaveCSS("background-color", bethel.accentStrong)
  await expect(directions).toHaveCSS("color", bethel.onLightAccent)
  await expect(page.locator(".contact-arrival")).toHaveCSS("background-color", bethel.surface)
  await expect(page.locator(".contact-arrival-list")).toHaveCSS(
    "background-color",
    bethel.surfaceAlternate,
  )
  await expect(page.locator(".contact-strip")).toHaveCSS("background-color", bethel.surface)

  await page.goto("/events")
  await expect(page.locator(".timeline")).toHaveCSS("background-color", bethel.surface)
  await expect(page.locator(".sunday")).toHaveCSS("background-color", bethel.surface)
  await page.getByLabel(`Add to calendar, ${sundayServices[0]!.title}, every Sunday`).click()
  const calendarMenu = page.locator(".sunday .add-menu").first()
  await expect(calendarMenu).toHaveCSS("background-color", bethel.surfaceSunken)
  await expect(calendarMenu).toHaveCSS("border-top-color", bethel.textFaint)
  await expect(calendarMenu).toHaveCSS("border-right-color", bethel.textFaint)
  await expect(calendarMenu).toHaveCSS("border-bottom-color", bethel.textFaint)
  await expect(calendarMenu).toHaveCSS("border-left-color", bethel.textFaint)
})
