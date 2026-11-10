import { readFileSync } from "node:fs"
import { join } from "node:path"

import { createElement, type ComponentType } from "react"
import { renderToStaticMarkup } from "react-dom/server"
import { expect, test, vi } from "vitest"

import NotFound from "./not-found"

vi.mock("next/link", () => ({
  default: function Link({
    href,
    children,
    className,
  }: {
    href: string
    children: React.ReactNode
    className?: string
  }) {
    return (
      <a href={href} className={className}>
        {children}
      </a>
    )
  },
}))

const source = readFileSync(join(import.meta.dirname, "error.tsx"), "utf8")
const { default: ErrorPage } = await import("./error")

type ErrorBoundaryProps = {
  error: Error & { digest?: string }
  reset: () => void
}

const ErrorBoundary = ErrorPage as ComponentType<ErrorBoundaryProps>

function renderError(error: Error & { digest?: string }) {
  return renderToStaticMarkup(
    createElement(ErrorBoundary, { error, reset: () => {} }),
  )
}

test("is a client component that reloads via window.location.reload", () => {
  expect(source).toMatch(/^["']use client["']/)
  expect(source).toMatch(/window\.location\.reload\s*\(\s*\)/)
  expect(source).not.toMatch(/\breset\s*\(/)
  expect(source).not.toMatch(/\bretry\s*\(/)
})

test("renders unexpected-error copy, actions, title, and main landmark", () => {
  const html = renderError(new Error("secret-marker"))

  expect(html).toContain("<title>Something went wrong</title>")
  expect(html).toContain("<h1")
  expect(html).toContain("Something went wrong")
  expect(html).toContain(
    "This page couldn&#x27;t load. Reload it, or return to Home.",
  )
  expect(html).toContain("Reload page")
  expect(html).toContain("<button")
  expect(html).toContain('href="/"')
  expect(html).toContain("Return to Home")
  expect(html).toMatch(
    /<main[^>]*id="main-content"[^>]*class="[^"]*\bpage-width\b[^"]*"[^>]*tabindex="-1"/i,
  )
})

test("marks the error shell and keeps the not-found shell neutral", () => {
  const html = renderError(new Error("secret-marker"))
  const notFoundHtml = renderToStaticMarkup(createElement(NotFound))

  expect(html).toMatch(/\berror-state\b/)
  expect(html).toMatch(/<button[^>]*class="text-link"/)
  expect(html).toMatch(/<a[^>]*href="\/"[^>]*class="text-link"/)
  expect(notFoundHtml).not.toMatch(/\berror-state\b/)
  expect(notFoundHtml).toMatch(/<a[^>]*href="\/"[^>]*class="text-link"/)
  expect(notFoundHtml).toContain("Page not found")
})

test("never renders error message, name, or digest", () => {
  const error = Object.assign(new Error("secret-marker"), {
    name: "LeakedErrorName",
    digest: "digest-leak-token",
  })
  const html = renderError(error)

  expect(html).not.toContain("secret-marker")
  expect(html).not.toContain("LeakedErrorName")
  expect(html).not.toContain("digest-leak-token")
})
