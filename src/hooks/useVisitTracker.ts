import { useEffect } from 'react'
import { addDoc, collection, serverTimestamp } from 'firebase/firestore'
import { db } from '../lib/firebase'

const getDeviceType = () => {
  const width = window.innerWidth
  if (width < 720) return 'mobile'
  if (width < 1100) return 'tablet'
  return 'desktop'
}

const getVisitorId = () => {
  const key = 'yoon_lab_visitor_id'
  const existing = window.localStorage.getItem(key)
  if (existing) return existing
  const id = crypto.randomUUID()
  window.localStorage.setItem(key, id)
  return id
}

export function useVisitTracker(path: string) {
  useEffect(() => {
    if (path.startsWith('/admin')) return

    const today = new Date().toISOString().slice(0, 10)
    const sessionKey = `visit:${today}:${path}`
    if (window.sessionStorage.getItem(sessionKey)) return
    window.sessionStorage.setItem(sessionKey, '1')

    addDoc(collection(db, 'visit_events'), {
      path,
      visitedAt: serverTimestamp(),
      visitorId: getVisitorId(),
      deviceType: getDeviceType(),
      referrer: document.referrer || '',
    }).catch(() => {
      window.sessionStorage.removeItem(sessionKey)
    })
  }, [path])
}
