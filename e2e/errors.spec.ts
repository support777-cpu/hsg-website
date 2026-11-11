import { expect, test, type Page } from "@playwright/test"

import { desktop, expectNoHorizontalScroll, headerNav, phone } from "./helpers"

async function expectMainNavigation(page: Page) {
  const menu = page.getByRole("button", { name: "Menu" })
  if (await menu.isVisible()) {
    await expect(menu).toBeVisible()
    return
  }
  await expect(headerNav(page)).toBeVisible()
}

async function expectNotFoundShell(page: Page, path: string) {
  const response = await page.goto(path, { waitUntil: "domcontentloaded" })
  expect(response, `${path} navigation response`).not.toBeNull()
  expect(response!.status(), `${path} HTTP status`).toBe(404)

  await expect(
    page.getByRole("heading", { level: 1, name: "Page not found" }),
  ).toBeVisible()
  await expectMainNavigation(page)
  await expect(page.getByRole("contentinfo")).toBeVisible()
  const home = page.getByRole("link", { name: "Return to Home" })
  await expect(home).toBeVisible()
  await expect(home).toHaveAttribute("href", "/")
}

test("unknown route and unknown calendar feed return the not-found shell", async ({
  page,
}) => {
  await page.setViewportSize(desktop)
  await expectNotFoundShell(page, "/no-such-page")
  await expectNotFoundShell(page, "/events/feeds/unknown.ics")
})

test("home still responds 200 after visiting not-found", async ({ page }) => {
  await page.setViewportSize(desktop)
  await expectNotFoundShell(page, "/no-such-page")

  const response = await page.goto("/", { waitUntil: "domcontentloaded" })
  expect(response, "Home navigation response").not.toBeNull()
  expect(response!.status(), "Home HTTP status").toBe(200)
})

test("not-found page does not scroll sideways at 320px", async ({ page }) => {
  await page.setViewportSize(phone)
  await expectNotFoundShell(page, "/no-such-page")
  await expectNoHorizontalScroll(page)
})

const surface = "rgb(12, 12, 14)"
const night = "rgb(0, 0, 0)"
const textPrimary = "rgb(244, 244, 245)"
const semanticRedText = "rgb(255, 107, 112)"
const accentLight = "rgb(125, 211, 252)"
const accentDeep = "rgb(2, 132, 199)"
const accentStrong = "rgb(56, 189, 248)"
const accentPrimary = "rgb(14, 165, 233)"
const onLightAccent = "rgb(6, 32, 46)"

test("not-found stays neutral on Surface while the error state uses semantic red and a sky-blue recovery", async ({
  page,
}) => {
  await page.setViewportSize(desktop)
  await expectNotFoundShell(page, "/no-such-page")

  const main = page.getByRole("main")
  await expect(main).not.toHaveClass(/error-state/)
  await expect(page.locator("body")).toHaveCSS("background-color", surface)
  await expect(page.getByRole("banner")).toHaveCSS("background-color", night)
  await expect(page.getByRole("contentinfo")).toHaveCSS("background-color", night)
  await expect(page.getByRole("heading", { level: 1 })).toHaveCSS("color", accentLight)
  await expect(page.getByRole("heading", { level: 1 })).not.toHaveCSS("color", semanticRedText)

  const home = page.getByRole("link", { name: "Return to Home" })
  await expect(home).toHaveCSS("color", accentPrimary)
  await home.hover()
  await expect(home).toHaveCSS("color", accentDeep)

  const skip = page.getByRole("link", { name: "Skip to main content" })
  await skip.focus()
  await expect(skip).toHaveCSS("background-color", accentPrimary)
  await expect(skip).toHaveCSS("color", onLightAccent)
  await skip.hover()
  await expect(skip).toHaveCSS("background-color", accentStrong)
  await expect(skip).toHaveCSS("color", onLightAccent)

  await page.evaluate(() => {
    const probe = document.createElement("section")
    probe.id = "error-state-probe"
    probe.className = "shell-page error-state"
    probe.innerHTML =
      '<h1>Something went wrong</h1><a class="text-link" href="/">Return to Home</a>'
    document.body.append(probe)
  })

  const probe = page.locator("#error-state-probe")
  await expect(probe).toHaveCSS("background-color", "rgba(0, 0, 0, 0)")
  await expect(probe).toHaveCSS("color", textPrimary)
  await expect(probe.getByRole("heading", { level: 1 })).toHaveCSS("color", semanticRedText)
  const recovery = probe.getByRole("link", { name: "Return to Home" })
  await expect(recovery).toHaveCSS("color", accentPrimary)
  await recovery.hover()
  await expect(recovery).toHaveCSS("color", accentDeep)
})
