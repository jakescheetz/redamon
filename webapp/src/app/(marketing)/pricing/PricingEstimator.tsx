'use client'

import { useState } from 'react'
import styles from './page.module.css'

/* Formula for sustainable deployment costs:
   - Base: platform + support
   - Per assessment: orchestration, agent runs, reporting
   - Per host per assessment: scanning, storage, graph nodes
   Volume discounts applied at thresholds.
*/
const BASE_MONTHLY = 600
const PER_ASSESSMENT = 80
const PER_HOST_PER_ASSESSMENT = 0.28

const ASSESSMENTS_MIN = 1
const ASSESSMENTS_MAX = 50
const HOSTS_MIN = 10
const HOSTS_MAX = 2000

function formatPrice(n: number) {
  if (n >= 1000) return `$${(n / 1000).toFixed(1)}k`
  return `$${Math.round(n)}`
}

function computeMonthly(assessments: number, hostsPerAssessment: number): number {
  const hostScans = assessments * hostsPerAssessment
  let total = BASE_MONTHLY + assessments * PER_ASSESSMENT + hostScans * PER_HOST_PER_ASSESSMENT
  if (assessments >= 20) total *= 0.92
  else if (assessments >= 10) total *= 0.96
  return total
}

function getTier(assessments: number): { name: string; range: string; desc: string } {
  if (assessments <= 5) return { name: 'Starter', range: '1–5 assessments/mo', desc: 'Pilot and small teams.' }
  if (assessments <= 20) return { name: 'Team', range: '6–20 assessments/mo', desc: 'Growing security and red teams.' }
  return { name: 'Enterprise', range: '21+ assessments/mo', desc: 'Custom contracts and volume.' }
}

export function PricingEstimator() {
  const [assessments, setAssessments] = useState(10)
  const [hostsPer, setHostsPer] = useState(200)

  const monthly = computeMonthly(assessments, hostsPer)
  const base = BASE_MONTHLY
  const assessmentLine = assessments * PER_ASSESSMENT
  const hostLine = assessments * hostsPer * PER_HOST_PER_ASSESSMENT
  const discount = monthly < base + assessmentLine + hostLine

  return (
    <>
      <div className={styles.estimateBlock}>
        <h3 className={styles.estimateBlockTitle}>Estimate your monthly cost</h3>
        <p className={styles.estimateBlockLead}>
          Pricing reflects deployment costs: assessments run, hosts scanned, and graph storage. Volume discounts apply.
        </p>

        <div className={styles.sliderRow}>
          <label className={styles.estimateLabel} htmlFor="slider-assessments">
            Assessments per month
          </label>
          <div className={styles.sliderWrap}>
            <input
              id="slider-assessments"
              type="range"
              className={styles.slider}
              min={ASSESSMENTS_MIN}
              max={ASSESSMENTS_MAX}
              value={assessments}
              onChange={(e) => setAssessments(Number(e.target.value))}
              aria-label="Assessments per month"
            />
            <span className={styles.sliderValue}>{assessments}</span>
          </div>
        </div>

        <div className={styles.sliderRow}>
          <label className={styles.estimateLabel} htmlFor="slider-hosts">
            Avg. hosts per assessment
          </label>
          <div className={styles.sliderWrap}>
            <input
              id="slider-hosts"
              type="range"
              className={styles.slider}
              min={HOSTS_MIN}
              max={HOSTS_MAX}
              value={hostsPer}
              onChange={(e) => setHostsPer(Number(e.target.value))}
              aria-label="Hosts per assessment"
            />
            <span className={styles.sliderValue}>{hostsPer.toLocaleString()}</span>
          </div>
        </div>

        <div className={styles.formulaBreakdown}>
          <div className={styles.formulaRow}>
            <span>Base (platform)</span>
            <span>{formatPrice(base)}</span>
          </div>
          <div className={styles.formulaRow}>
            <span>{assessments} × ${PER_ASSESSMENT} (per assessment)</span>
            <span>{formatPrice(assessmentLine)}</span>
          </div>
          <div className={styles.formulaRow}>
            <span>{assessments} × {hostsPer.toLocaleString()} × ${PER_HOST_PER_ASSESSMENT} (host scan)</span>
            <span>{formatPrice(hostLine)}</span>
          </div>
          {discount && (
            <div className={styles.formulaRowDiscount}>
              <span>Volume discount (10+ assessments)</span>
              <span>Applied</span>
            </div>
          )}
          <div className={styles.formulaTotal}>
            <span>Est. monthly</span>
            <span>{formatPrice(monthly)}</span>
          </div>
        </div>

        <p className={styles.estimateNote}>
          All plans include a free trial. Contact us for enterprise pricing and custom SLAs.
        </p>
      </div>

      <h2 className={`${styles.title} ${styles.plansTitle}`}>Plans</h2>
      <div className={styles.tiers}>
        {[getTier(3), getTier(12), getTier(35)].map((t) => (
          <div key={t.name} className={styles.tierCard}>
            <div className={styles.tierName}>{t.name}</div>
            <div className={styles.tierRange}>{t.range}</div>
            <p className={styles.tierDesc}>{t.desc}</p>
          </div>
        ))}
      </div>
    </>
  )
}
