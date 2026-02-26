'use client'

import { UserButton } from '@clerk/nextjs'
import { ThemeToggle } from '@/components/ThemeToggle'
import styles from './TopBar.module.css'

export function TopBar() {
  return (
    <div className={styles.topBar}>
      <div className={styles.spacer} />
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
  )
}
