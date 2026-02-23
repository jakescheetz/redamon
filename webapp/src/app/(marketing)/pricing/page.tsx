import { PricingEstimator } from './PricingEstimator'
import styles from './page.module.css'

export const metadata = {
  title: 'Pricing - Parallax',
  description: 'Plans and pricing for Parallax security reconnaissance platform',
}

export default function PricingPage() {
  return (
    <div className={styles.page}>
      <div className={styles.content}>
        <header className={styles.header}>
          <h1 className={styles.title}>Pricing</h1>
          <p className={styles.lead}>
            Transparent, usage-based pricing. Adjust the sliders to estimate cost from assessments and hosts scanned.
          </p>
        </header>
        <PricingEstimator />
        <div className={styles.contactBlock}>
          <p>Need custom volume or enterprise terms?</p>
          <a href="mailto:sales@parallax.security">Contact sales</a>
        </div>
      </div>
    </div>
  )
}
