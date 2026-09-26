import { expect, type Locator, type Page } from "@playwright/test"

export const desktop = { width: 1280, height: 900 }
export const atMenu = { width: 800, height: 900 }
export const aboveMenu = { width: 801, height: 900 }
export const phone = { width: 320, height: 700 }
export const phoneLarge = { width: 390, height: 844 }
export const tabletPortrait = { width: 768, height: 1024 }
export const tabletLandscape = { width: 1024, height: 768 }
export const tabletViewports = [tabletPortrait, tabletLandscape] as const

export function tabletViewportLabel(viewport: { width: number; height: number }) {
  return `${viewport.width}×${viewport.height}`
}

export type Box = { x: number; y: number; width: number; height: number }

export function boxesOverlap(a: Box, b: Box) {
  return a.x < b.x + b.width && a.x + a.width > b.x && a.y < b.y + b.height && a.y + a.height > b.y
}

export function expectBoxWithin(inner: Box, outer: Box, tolerance = 1) {
  expect(inner.x).toBeGreaterThanOrEqual(outer.x - tolerance)
  expect(inner.y).toBeGreaterThanOrEqual(outer.y - tolerance)
  expect(inner.x + inner.width).toBeLessThanOrEqual(outer.x + outer.width + tolerance)
  expect(inner.y + inner.height).toBeLessThanOrEqual(outer.y + outer.height + tolerance)
}

export async function expectHorizontallyInViewport(locator: Locator, page: Page, tolerance = 1) {
  const value = await box(locator)
  const width = page.viewportSize()!.width
  expect(value.x).toBeGreaterThanOrEqual(-tolerance)
  expect(value.x + value.width).toBeLessThanOrEqual(width + tolerance)
}

export function headerNav(page: Page) {
  return page.getByRole("navigation", { name: "Main navigation" })
}

export async function box(locator: Locator) {
  await expect(locator).toBeVisible()
  const value = await locator.boundingBox()
  expect(value).not.toBeNull()
  return value!
}

export async function expectNoHorizontalScroll(page: Page) {
  const overflows = await page.evaluate(() => {
    const root = document.documentElement
    return root.scrollWidth > root.clientWidth + 1
  })
  expect(overflows).toBe(false)
}

export async function expectMinHeight(locator: Locator) {
  expect((await box(locator)).height).toBeGreaterThanOrEqual(44)
}

export async function paintedBackground(locator: Locator) {
  return locator.evaluate((el) => {
    let node: HTMLElement | null = el as HTMLElement
    while (node) {
      const background = getComputedStyle(node).backgroundColor
      if (background !== "rgba(0, 0, 0, 0)" && background !== "transparent") return background
      node = node.parentElement
    }
    return ""
  })
}

/** Wait until consecutive scroll-position samples agree within tolerance (no fixed sleeps). */
export async function waitForScrollStable(
  page: Page,
  options: { samples?: number; tolerancePx?: number; timeout?: number } = {},
) {
  const samples = options.samples ?? 3
  const tolerancePx = options.tolerancePx ?? 1
  const timeout = options.timeout ?? 10_000

  await expect(async () => {
    const readings: number[] = []
    for (let i = 0; i < samples; i++) {
      readings.push(
        await page.evaluate(
          () =>
            new Promise<number>((resolve) => {
              requestAnimationFrame(() => {
                resolve(document.scrollingElement?.scrollTop ?? window.scrollY)
              })
            }),
        ),
      )
    }
    expect(Math.max(...readings) - Math.min(...readings)).toBeLessThanOrEqual(tolerancePx)
  }).toPass({ timeout })
}

export async function sceneBoxMetrics(page: Page, sceneId: string) {
  return page.evaluate((id) => {
    const el = document.getElementById(id)
    if (!el) throw new Error(`missing #${id}`)
    const rect = el.getBoundingClientRect()
    return {
      top: rect.top,
      bottom: rect.bottom,
      height: rect.height,
      viewportHeight: window.innerHeight,
    }
  }, sceneId)
}

export async function plateStyleMetrics(locator: Locator) {
  return locator.evaluate((el) => {
    const style = getComputedStyle(el)
    return {
      backgroundSize: style.backgroundSize,
      backgroundPosition: style.backgroundPosition,
      backgroundColor: style.backgroundColor,
    }
  })
}
