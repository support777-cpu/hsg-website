"use client"

import { useEffect, useState } from "react"

export type AboutSceneDot = {
  id: string
  label: string
}

function visibleSceneId(nodes: HTMLElement[]) {
  let bestId = ""
  let bestDist = Number.POSITIVE_INFINITY
  for (const node of nodes) {
    const dist = Math.abs(node.getBoundingClientRect().top)
    if (dist < bestDist) {
      bestDist = dist
      bestId = node.id
    }
  }
  return bestId
}

export function AboutSceneDots({ scenes }: { scenes: AboutSceneDot[] }) {
  const [currentId, setCurrentId] = useState(scenes[0]?.id ?? "")

  useEffect(() => {
    const nodes = scenes
      .map((scene) => document.getElementById(scene.id))
      .filter((node): node is HTMLElement => node !== null)

    if (nodes.length === 0) return

    const root = document.documentElement
    const scroller = document.scrollingElement
    const sceneIds = new Set(scenes.map((scene) => scene.id))

    const ratios = new Map<string, number>()
    let fragmentNav = false
    let fragmentTargetId = ""
    let settleTimer = 0
    let lastScrollTop = scroller?.scrollTop ?? 0
    let stableFrames = 0
    let startedAt = 0

    const setCurrentFromVisible = () => {
      const nextId = visibleSceneId(nodes)
      if (nextId) setCurrentId((current) => (current === nextId ? current : nextId))
    }

    const setCurrentFromHash = () => {
      const hashId = window.location.hash.replace(/^#/, "")
      if (hashId && sceneIds.has(hashId)) {
        setCurrentId((current) => (current === hashId ? current : hashId))
        return
      }
      setCurrentFromVisible()
    }

    const endFragmentNav = () => {
      if (!fragmentNav) return
      fragmentNav = false
      fragmentTargetId = ""
      root.classList.remove("about-fragment-nav")
      window.clearInterval(settleTimer)
      settleTimer = 0
      setCurrentFromVisible()
    }

    const targetFlush = () => {
      if (!fragmentTargetId) return true
      const target = document.getElementById(fragmentTargetId)
      if (!target) return true
      return Math.abs(target.getBoundingClientRect().top) <= 1
    }

    const watchFragmentSettle = () => {
      window.clearInterval(settleTimer)
      lastScrollTop = scroller?.scrollTop ?? 0
      stableFrames = 0
      startedAt = performance.now()
      settleTimer = window.setInterval(() => {
        const elapsed = performance.now() - startedAt
        const top = scroller?.scrollTop ?? 0
        const flush = targetFlush()
        const stable = Math.abs(top - lastScrollTop) <= 1

        if (!flush && elapsed < 2000) {
          stableFrames = 0
          lastScrollTop = top
          return
        }

        if (stable) {
          stableFrames += 1
          if (stableFrames >= 3 || elapsed >= 2000) endFragmentNav()
        } else {
          stableFrames = 0
          lastScrollTop = top
        }
      }, 32)
    }

    const beginFragmentNav = (id: string) => {
      fragmentNav = true
      fragmentTargetId = id
      root.classList.add("about-fragment-nav")
      void root.offsetHeight
      watchFragmentSettle()
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (fragmentNav) return
        for (const entry of entries) {
          ratios.set(entry.target.id, entry.isIntersecting ? entry.intersectionRatio : 0)
        }
        let bestId = ""
        let bestRatio = -1
        for (const [id, ratio] of ratios) {
          if (ratio > bestRatio) {
            bestRatio = ratio
            bestId = id
          }
        }
        if (bestId) setCurrentId((current) => (current === bestId ? current : bestId))
      },
      { threshold: [0, 0.25, 0.5, 0.75, 1] },
    )

    for (const node of nodes) observer.observe(node)

    const sceneIdFromEvent = (event: Event) => {
      const target = event.target
      if (!(target instanceof Element)) return ""
      const link = target.closest("a[href^='#']")
      if (!(link instanceof HTMLAnchorElement)) return ""
      const id = link.hash.replace(/^#/, "")
      return sceneIds.has(id) ? id : ""
    }

    const onPointerDown = (event: PointerEvent) => {
      const id = sceneIdFromEvent(event)
      if (!id) return
      beginFragmentNav(id)
    }

    const onClick = (event: MouseEvent) => {
      const id = sceneIdFromEvent(event)
      if (!id) return
      beginFragmentNav(id)
    }

    const onHashChange = () => {
      const hashId = window.location.hash.replace(/^#/, "")
      if (hashId && sceneIds.has(hashId)) beginFragmentNav(hashId)
      else endFragmentNav()
      setCurrentFromHash()
    }

    document.addEventListener("pointerdown", onPointerDown, true)
    document.addEventListener("click", onClick, true)
    window.addEventListener("hashchange", onHashChange)

    if (window.location.hash) {
      const hashId = window.location.hash.replace(/^#/, "")
      if (sceneIds.has(hashId)) beginFragmentNav(hashId)
      setCurrentFromHash()
    }

    return () => {
      observer.disconnect()
      document.removeEventListener("pointerdown", onPointerDown, true)
      document.removeEventListener("click", onClick, true)
      window.removeEventListener("hashchange", onHashChange)
      window.clearInterval(settleTimer)
      root.classList.remove("about-fragment-nav")
    }
  }, [scenes])

  return (
    <nav className="about-scene-dots" aria-label="Scenes">
      {scenes.map((scene) => (
        <a
          key={scene.id}
          href={`#${scene.id}`}
          aria-current={currentId === scene.id ? "true" : undefined}
        >
          <span className="sr-only">{scene.label}</span>
        </a>
      ))}
    </nav>
  )
}
