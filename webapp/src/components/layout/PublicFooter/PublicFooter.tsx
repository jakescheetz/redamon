'use client'

import Link from 'next/link'
import styles from './PublicFooter.module.css'

const footerLinks = [
  { label: 'Features', href: '/features' },
  { label: 'Pricing', href: '/pricing' },
  { label: 'About', href: '/about' },
]

export function PublicFooter() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className={styles.footer}>
      <div className={styles.content}>
        <nav className={styles.nav}>
          {footerLinks.map(({ label, href }) => (
            <Link key={href} href={href} className={styles.link}>
              {label}
            </Link>
          ))}
        </nav>
        <span className={styles.copyright}>
          © {currentYear} Parallax. All rights reserved.
        </span>
      </div>
    </footer>
  )
}
