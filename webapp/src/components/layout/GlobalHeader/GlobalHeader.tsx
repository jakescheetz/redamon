'use client'

import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Crosshair, FolderOpen } from 'lucide-react'
import { UserButton } from '@clerk/nextjs'
import { ThemeToggle } from '@/components/ThemeToggle'
import { ProjectSelector } from './ProjectSelector'
import styles from './GlobalHeader.module.css'

const navItems = [
  { label: 'Projects', href: '/projects', icon: <FolderOpen size={14} /> },
  { label: 'Red Zone', href: '/graph', icon: <Crosshair size={14} /> },
]

export function GlobalHeader() {
  const pathname = usePathname()

  return (
    <header className={styles.header}>
      <div className={styles.logo}>
        <Image src="/logo.png" alt="Parallax" width={28} height={28} className={styles.logoImg} />
        <span className={styles.logoText}>Parallax</span>
      </div>

      <div className={styles.spacer} />

      <div className={styles.actions}>
        <nav className={styles.nav}>
          {navItems.map(item => {
            const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`)
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`${styles.navItem} ${isActive ? styles.navItemActive : ''}`}
              >
                {item.icon}
                <span>{item.label}</span>
              </Link>
            )
          })}
        </nav>

        <div className={styles.divider} />

        <ProjectSelector />

        <div className={styles.divider} />

        <ThemeToggle />

        <div className={styles.divider} />

        <UserButton
          afterSignOutUrl="/"
          appearance={{
            elements: {
              avatarBox: { width: 24, height: 24 },
            },
          }}
        />
      </div>
    </header>
  )
}
