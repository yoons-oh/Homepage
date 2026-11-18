import { useEffect, useState } from 'react'
import { IS_MOCK } from './mock'

/**
 * Current route path. On the real site this is location.pathname.
 * In the mock preview build pages live in the hash (#about, #ai-video, …)
 * because the preview host only passes a plain #name.
 */
const ROUTES = new Set(['home', 'about', 'career', 'projects', 'apps', 'youtube', 'instagram', 'writing', 'ai-video', 'testers', 'restaurants', 'admin-login', 'admin'])

function readPath() {
  if (!IS_MOCK) return window.location.pathname
  const hash = window.location.hash.slice(1)
  if (!ROUTES.has(hash) || hash === 'home') return '/'
  return hash === 'admin-login' ? '/admin/login' : `/${hash}`
}

function toHash(href: string) {
  const [pathPart, anchor] = href.split('#')
  const path = pathPart.replace(/^\/+|\/+$/g, '')
  if (!path) return { hash: 'home', anchor }
  return { hash: path.replace('/', '-'), anchor }
}

let routerInstalled = false

function installMockRouter() {
  if (routerInstalled) return
  routerInstalled = true
  document.addEventListener('click', (event) => {
    const link = (event.target as Element | null)?.closest?.('a')
    const href = link?.getAttribute('href')
    if (!link || !href || !href.startsWith('/') || href.startsWith('//') || link.target === '_blank') return
    const { hash, anchor } = toHash(href)
    if (!ROUTES.has(hash)) return
    event.preventDefault()
    if (window.location.hash.slice(1) !== hash) window.location.hash = hash
    if (anchor) setTimeout(() => document.getElementById(anchor)?.scrollIntoView({ behavior: 'smooth' }), 120)
  })
}

export function usePath() {
  const [path, setPath] = useState(readPath)
  useEffect(() => {
    if (!IS_MOCK) return
    installMockRouter()
    const onChange = () => {
      // in-page anchors such as #work keep the current page
      if (!ROUTES.has(window.location.hash.slice(1))) return
      setPath(readPath())
      ;(document.activeElement as HTMLElement | null)?.blur?.()
      window.scrollTo(0, 0)
    }
    window.addEventListener('hashchange', onChange)
    return () => window.removeEventListener('hashchange', onChange)
  }, [])
  return path
}
