import { Target, Zap, Cpu, Users } from 'lucide-react'
import styles from './page.module.css'

export const metadata = {
  title: 'About - Parallax',
  description: 'About Parallax and our mission to bring agentic AI to security testing',
}

const sections = [
  {
    id: 'mission',
    title: 'Mission',
    icon: Target,
    accent: 'cyan' as const,
    body: 'Security teams are drowning in point tools and manual workflows. We believe the answer is agentic AI: systems that reason about your scope, choose the right steps, and run the full kill chain — while you keep approval authority and visibility. Parallax is built to make that real for red teams and offensive security.',
  },
  {
    id: 'what',
    title: 'What we do',
    icon: Zap,
    accent: 'violet' as const,
    body: 'Parallax is an AI-powered agentic red team platform. It automates offensive security from reconnaissance through exploitation and post-exploitation. The agent decides what to run next based on your attack surface; you get approval gates before critical actions and every finding in a unified Neo4j graph and report. One platform, one workflow, full oversight.',
  },
  {
    id: 'technology',
    title: 'Technology',
    icon: Cpu,
    accent: 'cyan' as const,
    body: 'The brain of Parallax is a LangGraph-based agent: it reasons over your scope, selects tools (Nuclei, custom scripts, optional GVM), and can progress from recon to exploitation with your approval. Findings are stored in a Neo4j knowledge graph so you can query relationships between domains, IPs, CVEs, and exploits. We invest heavily in making the agent reliable, explainable, and safe for production use.',
  },
  {
    id: 'who',
    title: "Who it's for",
    icon: Users,
    accent: 'green' as const,
    body: 'Internal red teams, penetration testers, and teams running continuous attack-surface monitoring. If you need to understand your exposure from every angle and want an AI agent that can run the chain instead of stitching scripts — while you stay in control — Parallax is built for you.',
  },
]

export default function AboutPage() {
  return (
    <div className={styles.page}>
      <div className={styles.content}>
        <header className={styles.header}>
          <h1 className={styles.title}>About Parallax</h1>
          <p className={styles.lead}>
            We build agentic AI for offensive security — so teams can see their attack surface
            from every angle, with full control and one unified graph.
          </p>
        </header>

        <div className={styles.sections}>
          <nav className={styles.sectionNav} aria-label="On this page">
            <h2 className={styles.sectionNavTitle}>On this page</h2>
            <ul className={styles.sectionNavList}>
              {sections.map(({ id, title }) => (
                <li key={id}>
                  <a href={`#${id}`}>{title}</a>
                </li>
              ))}
            </ul>
          </nav>

          <div className={styles.sectionBlocks}>
            {sections.map(({ id, title, icon: Icon, accent, body }) => (
              <section
                key={id}
                id={id}
                className={`${styles.section} ${styles[`sectionAccent_${accent}`]}`}
              >
                <div className={styles.sectionHeader}>
                  <span className={styles.sectionIcon} aria-hidden>
                    <Icon size={22} strokeWidth={2} />
                  </span>
                  <h2 className={styles.sectionTitle}>{title}</h2>
                </div>
                <p className={styles.body}>{body}</p>
              </section>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
