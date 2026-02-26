'use client'

import { Sidebar } from '../Sidebar'
import { useSidebarState } from '@/hooks/useSidebarState'
import styles from './AppLayout.module.css'

interface AppLayoutProps {
  children: React.ReactNode
}

export function AppLayout({ children }: AppLayoutProps) {
  const { isCollapsed, toggle } = useSidebarState()

  return (
    <div className={styles.layout}>
      <Sidebar isCollapsed={isCollapsed} onToggle={toggle} />
      <main className={styles.main}>{children}</main>
    </div>
  )
}
