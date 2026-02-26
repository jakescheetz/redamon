'use client'

import { useEffect, useRef, useState } from 'react'
import styles from './OrbitAnimation.module.css'

export function OrbitAnimation() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)
  const [scrollProgress, setScrollProgress] = useState(0)

  useEffect(() => {
    const el = containerRef.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.2 }
    )

    observer.observe(el)

    const handleScroll = () => {
      const rect = el.getBoundingClientRect()
      const windowHeight = window.innerHeight
      // Progress from 0 (element just entering viewport) to 1 (element centered or past)
      const rawProgress = 1 - (rect.top / windowHeight)
      setScrollProgress(Math.max(0, Math.min(1, rawProgress)))
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()

    return () => {
      observer.disconnect()
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  // Scale rings outward as user scrolls
  const ringScale = 0.4 + scrollProgress * 0.6
  const glowOpacity = Math.min(1, scrollProgress * 1.5)

  return (
    <div ref={containerRef} className={styles.container}>
      <div
        className={`${styles.orbitSystem} ${isVisible ? styles.orbitSystemVisible : ''}`}
        style={{
          '--ring-scale': ringScale,
          '--glow-opacity': glowOpacity,
        } as React.CSSProperties}
      >
        {/* Ambient glow behind everything */}
        <div className={styles.ambientGlow} />

        {/* Central star */}
        <div className={styles.star} />

        {/* Inner ring — cyan */}
        <div className={`${styles.ring} ${styles.ring1}`}>
          <div className={styles.ringDot} />
        </div>

        {/* Middle ring — indigo */}
        <div className={`${styles.ring} ${styles.ring2}`}>
          <div className={styles.ringDot} />
        </div>

        {/* Outer ring — violet */}
        <div className={`${styles.ring} ${styles.ring3}`}>
          <div className={styles.ringDot} />
        </div>

        {/* Outermost ring — faint */}
        <div className={`${styles.ring} ${styles.ring4}`}>
          <div className={styles.ringDot} />
        </div>
      </div>

      {/* Labels that fade in */}
      <div className={`${styles.label} ${styles.labelLeft} ${isVisible ? styles.labelVisible : ''}`}>
        Scan
      </div>
      <div className={`${styles.label} ${styles.labelRight} ${isVisible ? styles.labelVisible : ''}`}>
        Reason
      </div>
      <div className={`${styles.label} ${styles.labelTop} ${isVisible ? styles.labelVisible : ''}`}>
        Discover
      </div>
      <div className={`${styles.label} ${styles.labelBottom} ${isVisible ? styles.labelVisible : ''}`}>
        Report
      </div>
    </div>
  )
}
