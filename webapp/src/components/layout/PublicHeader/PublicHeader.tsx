'use client'

import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ThemeToggle } from '@/components/ThemeToggle'
import { Button } from '@/components/ui'
import styles from './PublicHeader.module.css'

const publicNav = [
  { label: 'Features', href: '/features' },
  { label: 'Pricing', href: '/pricing' },
  { label: 'About', href: '/about' },
]

export function PublicHeader() {
  const pathname = usePathname()

  return (
    <header className={styles.header}>
      <div className={styles.headerBar}>
      <Link href="/" className={styles.logo}>
        <Image src="/logo.png" alt="Parallax" width={28} height={28} className={styles.logoImg} />
        <span className={styles.logoText}>Parallax</span>
      </Link>

      <nav className={styles.nav}>
        {publicNav.map(({ label, href }) => (
          <Link
            key={href}
            href={href}
            className={`${styles.navLink} ${pathname === href ? styles.navLinkActive : ''}`}
          >
            {label}
          </Link>
        ))}
      </nav>

      <div className={styles.actions}>
        <ThemeToggle />
        <Button href="/sign-in" variant="ghost" size="sm">
          Log in
        </Button>
        <Button href="/sign-up" variant="primary" size="sm">
          Sign up
        </Button>
      </div>
      </div>
    </header>
  )
}
