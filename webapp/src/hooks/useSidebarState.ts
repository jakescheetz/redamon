'use client'

import { useState, useEffect, useCallback } from 'react'

const STORAGE_KEY = 'parallax-sidebar-collapsed'

export function useSidebarState() {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored === 'true') {
      setIsCollapsed(true)
    }
    setMounted(true)
  }, [])

  const toggle = useCallback(() => {
    setIsCollapsed((prev) => {
      const next = !prev
      localStorage.setItem(STORAGE_KEY, String(next))
      return next
    })
  }, [])

  return { isCollapsed, toggle, mounted }
}
