'use client'

import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  FolderOpen,
  Crosshair,
  ShieldCheck,
  Target,
  ClipboardList,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'
import { UserButton, useUser } from '@clerk/nextjs'
import styles from './Sidebar.module.css'

interface NavItem {
  label: string
  href: string
  icon: React.ReactNode
  enabled: boolean
}

const navItems: NavItem[] = [
  {
    label: 'Projects',
    href: '/projects',
    icon: <FolderOpen size={18} />,
    enabled: true,
  },
  {
    label: 'Red Zone',
    href: '/graph',
    icon: <Crosshair size={18} />,
    enabled: true,
  },
  {
    label: 'Vulnerabilities',
    href: '/vulnerabilities',
    icon: <ShieldCheck size={18} />,
    enabled: false,
  },
  {
    label: 'MITRE ATT&CK',
    href: '/mitre',
    icon: <Target size={18} />,
    enabled: false,
  },
  {
    label: 'Actions Log',
    href: '/actions',
    icon: <ClipboardList size={18} />,
    enabled: false,
  },
]

interface SidebarProps {
  isCollapsed: boolean
  onToggle: () => void
}

export function Sidebar({ isCollapsed, onToggle }: SidebarProps) {
  const pathname = usePathname()
  const { user } = useUser()
  const currentYear = new Date().getFullYear()

  const displayName = user?.firstName || user?.username || user?.primaryEmailAddress?.emailAddress?.split('@')[0] || 'User'

  return (
    <aside className={`${styles.sidebar} ${isCollapsed ? styles.sidebarCollapsed : ''}`}>
      {/* Floating edge pill toggle */}
      <button
        className={styles.edgePill}
        onClick={onToggle}
        title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      >
        {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
      </button>

      {/* Inner wrapper — clips text during collapse animation */}
      <div className={styles.inner}>
        {/* Branded logo header */}
        <Link href="/projects" className={styles.logoHeader}>
          <div className={styles.logoGlow} />
          <Image src="/logo.png" alt="Parallax" width={44} height={44} className={styles.logoImg} />
          <div className={styles.logoTextGroup}>
            <span className={styles.logoText}>Parallax</span>
            <span className={styles.logoTagline}>Attack Surface Intel</span>
          </div>
        </Link>

        <div className={styles.divider} />

        {/* Navigation label */}
        <div className={styles.navSection}>
          <span className={styles.navSectionLabel}>Navigation</span>
        </div>

        {/* Navigation */}
        <nav className={styles.nav}>
          {navItems.map((item) => {
            const isActive = item.enabled && (pathname === item.href || pathname.startsWith(`${item.href}/`))

            if (!item.enabled) {
              return (
                <span
                  key={item.href}
                  className={`${styles.navItem} ${styles.navItemDisabled}`}
                  title={isCollapsed ? `${item.label} (Soon)` : undefined}
                >
                  <span className={styles.navIcon}>{item.icon}</span>
                  <span className={styles.navLabel}>{item.label}</span>
                  <span className={styles.badge}>Soon</span>
                </span>
              )
            }

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`${styles.navItem} ${isActive ? styles.navItemActive : ''}`}
                title={isCollapsed ? item.label : undefined}
              >
                <span className={styles.navIcon}>{item.icon}</span>
                <span className={styles.navLabel}>{item.label}</span>
              </Link>
            )
          })}
        </nav>

        {/* Spacer */}
        <div className={styles.spacer} />

        {/* Footer info */}
        <div className={styles.footerInfo}>
          <span className={styles.footerText}>&copy; {currentYear} Parallax &middot; v1.3.0</span>
        </div>
      </div>

      {/* User section — outside inner wrapper */}
      <div className={styles.userSection}>
        <UserButton
          afterSignOutUrl="/"
          appearance={{
            elements: {
              avatarBox: { width: 28, height: 28 },
            },
          }}
        />
        <div className={styles.userInfo}>
          <span className={styles.userName}>{displayName}</span>
          {user?.primaryEmailAddress && (
            <span className={styles.userEmail}>{user.primaryEmailAddress.emailAddress}</span>
          )}
        </div>
      </div>
    </aside>
  )
}
