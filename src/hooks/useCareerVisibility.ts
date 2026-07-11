import { useEffect, useState } from 'react'
import { fetchCareerSettings } from '../lib/siteSettings'

export function useCareerVisibility() {
  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let alive = true

    fetchCareerSettings()
      .then((settings) => {
        if (alive) setIsOpen(settings.isOpen)
      })
      .catch(() => {
        if (alive) setIsOpen(false)
      })
      .finally(() => {
        if (alive) setLoading(false)
      })

    return () => {
      alive = false
    }
  }, [])

  return { isOpen, loading }
}
