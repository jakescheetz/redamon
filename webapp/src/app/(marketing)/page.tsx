import { Network, Bot, Shield, Crosshair, Workflow, Database } from 'lucide-react'
import { Button } from '@/components/ui'
import { OrbitAnimation } from '@/components/marketing/OrbitAnimation'
import styles from './page.module.css'

const heroSteps = [
  { icon: Crosshair, label: 'Define scope' },
  { icon: Workflow, label: 'Agent runs the chain' },
  { icon: Database, label: 'Graph + report' },
]

const featureTeasers = [
  {
    title: 'Agentic AI that reasons',
    body: 'A LangGraph-based agent decides what to run next from your attack surface — subdomain discovery, scanning, exploitation — and requests approval before critical actions. You steer; it executes.',
    icon: Bot,
  },
  {
    title: 'Attack surface as a graph',
    body: 'Every host, endpoint, CVE, and finding lives in a Neo4j knowledge graph. Query relationships and see coverage at a glance instead of stitching spreadsheets.',
    icon: Network,
  },
  {
    title: 'Built for red teams',
    body: 'Nuclei (9K+ templates), optional GVM, custom tooling. Export and report in the formats your process already uses.',
    icon: Shield,
  },
]

const whyItems = [
  {
    title: 'Autonomous reasoning',
    body: 'The agent chooses tools and next steps from context, not fixed playbooks. That means better coverage and fewer blind spots than scripted pipelines.',
  },
  {
    title: 'You stay in control',
    body: 'Approval gates before exploitation and post-exploitation. Review every finding; the agent suggests, you decide.',
  },
  {
    title: 'One platform, one graph',
    body: 'Recon through exploitation in a single workflow. One graph, one report — no tool sprawl.',
  },
]

export default function LandingPage() {
  return (
    <>
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <h1 className={styles.headline}>
            See your target from angles that would otherwise be impossible
          </h1>
          <p className={styles.subheadline}>
            Agentic AI that reasons about your attack surface — chooses tools, runs the kill chain,
            and asks for your approval at critical steps. LangGraph-powered orchestration, one graph,
            full control.
          </p>
          <div className={styles.ctas}>
            <Button href="/sign-up" variant="primary" size="lg">
              Get started
            </Button>
            <Button href="/pricing" variant="secondary" size="lg">
              View pricing
            </Button>
          </div>
        </div>
        <div className={styles.heroVisual}>
          <div className={styles.heroVisualCard}>
            <p className={styles.heroVisualTitle}>How it works</p>
            <ol className={styles.heroVisualSteps}>
              {heroSteps.map(({ icon: Icon, label }, i) => (
                <li key={label} className={styles.heroVisualStep}>
                  <div className={styles.heroVisualStepLeft}>
                    <span className={styles.heroVisualStepNumber}>{i + 1}</span>
                    {i < heroSteps.length - 1 && <span className={styles.heroVisualStepLine} aria-hidden />}
                  </div>
                  <div className={styles.heroVisualStepBody}>
                    <span className={styles.heroVisualStepIcon} aria-hidden><Icon size={20} strokeWidth={1.8} /></span>
                    <span className={styles.heroVisualStepLabel}>{label}</span>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      <section className={styles.section} aria-labelledby="features-heading">
        <div className={styles.sectionHeading}>
          <h2 id="features-heading" className={styles.sectionTitle}>
            Agentic AI meets the full kill chain
          </h2>
          <p className={styles.sectionLead}>
            An AI agent that reasons about your scope, selects tools, and runs from recon through exploitation — with approval gates and a single graph.
          </p>
        </div>
        <div className={styles.featuresGrid}>
          {featureTeasers.map(({ title, body, icon: Icon }) => (
            <div key={title} className={styles.featureCard}>
              <div className={styles.featureIcon} aria-hidden>
                <Icon size={20} strokeWidth={2} />
              </div>
              <h3 className={styles.featureCardTitle}>{title}</h3>
              <p className={styles.featureCardBody}>{body}</p>
            </div>
          ))}
        </div>
        <p className={styles.sectionCtaWrap}>
          <Button href="/features" variant="secondary" size="md">
            See all features
          </Button>
        </p>
      </section>

      <OrbitAnimation />

      <section className={styles.whySection} aria-labelledby="why-heading">
        <div className={styles.whyWrap}>
          <h2 id="why-heading" className={styles.whyTitle}>
            Why agentic AI changes the game
          </h2>
          <div className={styles.whyGrid}>
            {whyItems.map(({ title, body }) => (
              <div key={title} className={styles.whyItem}>
                <h3 className={styles.whyItemTitle}>{title}</h3>
                <p className={styles.whyItemBody}>{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.ctaSection}>
        <div className={styles.ctaStrip}>
          <h2 className={styles.ctaStripTitle}>Ready to see your surface from every angle?</h2>
          <p className={styles.ctaStripText}>
            Start with a free trial. No credit card required.
          </p>
          <div className={styles.ctaStripButtons}>
            <Button href="/sign-up" variant="primary" size="lg">
              Get started
            </Button>
            <Button href="/pricing" variant="secondary" size="lg">
              Pricing
            </Button>
          </div>
        </div>
      </section>
    </>
  )
}
