import { expect, test } from "vitest"

import {
  aboveMenu,
  atMenu,
  boxesOverlap,
  desktop,
  phone,
  phoneLarge,
  tabletLandscape,
  tabletPortrait,
  tabletViewportLabel,
  tabletViewports,
} from "../e2e/helpers"

test("exports tablet portrait and landscape viewports for shared e2e use", () => {
  expect(tabletPortrait).toEqual({ width: 768, height: 1024 })
  expect(tabletLandscape).toEqual({ width: 1024, height: 768 })
  expect(tabletViewports).toEqual([tabletPortrait, tabletLandscape])
  expect(tabletViewportLabel(tabletPortrait)).toBe("768×1024")
  expect(tabletViewportLabel(tabletLandscape)).toBe("1024×768")
})

test("boxesOverlap is false for flush neighbors and true for intersecting boxes", () => {
  const address = { x: 0, y: 0, width: 100, height: 40 }
  const socialsBeside = { x: 100, y: 0, width: 80, height: 40 }
  const socialsOnAddress = { x: 50, y: 10, width: 80, height: 40 }
  expect(boxesOverlap(address, socialsBeside)).toBe(false)
  expect(boxesOverlap(address, socialsOnAddress)).toBe(true)
})

test("preserves existing named viewports", () => {
  expect(desktop).toEqual({ width: 1280, height: 900 })
  expect(phone).toEqual({ width: 320, height: 700 })
  expect(phoneLarge).toEqual({ width: 390, height: 844 })
  expect(atMenu).toEqual({ width: 800, height: 900 })
  expect(aboveMenu).toEqual({ width: 801, height: 900 })
})
