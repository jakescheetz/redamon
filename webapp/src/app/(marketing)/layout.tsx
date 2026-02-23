import { Space_Grotesk } from 'next/font/google'
import { PublicHeader, PublicFooter } from '@/components/layout'
import { SpaceScene } from '@/components/marketing/SpaceScene'
import styles from './layout.module.css'

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
})

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className={`${spaceGrotesk.variable} ${styles.marketingLayout}`}>
      <div className={styles.starfield} aria-hidden />
      <div className={styles.starfieldDeep} aria-hidden />
      <div className={styles.starfieldTwinkle} aria-hidden />
      <div className={styles.starTwinkle} aria-hidden />
      <SpaceScene />
      <PublicHeader />
      <main className={styles.marketingMain}>{children}</main>
      <PublicFooter />
    </div>
  )
}
