import { Zap, Network, Bot, GitBranch, Shield, Cpu, FileCode, MessageSquare } from 'lucide-react'
import styles from './page.module.css'

export const metadata = {
  title: 'Features - Parallax',
  description: 'What Parallax does: agentic AI, reconnaissance, attack surface graph, and more',
}

const agentFeatures = [
  {
    title: 'LangGraph-based agent',
    description: 'An AI agent that reasons about your scope and decides what to run next — tool selection, phase progression, and when to ask for approval. Steer it via chat; it executes recon through exploitation.',
    icon: Bot,
  },
  {
    title: 'Approval gates',
    description: 'Before exploitation and post-exploitation, the agent requests your approval. Review findings, then approve or reject. You stay in control; the agent does the legwork.',
    icon: MessageSquare,
  },
  {
    title: 'Full kill chain automation',
    description: 'From subdomain discovery and port scanning through vulnerability scanning and exploitation — orchestrated by the agent, not fixed playbooks. It adapts to what it finds.',
    icon: Zap,
  },
]

const reconFeatures = [
  {
    title: 'Attack surface graph',
    description: 'Every finding lives in a Neo4j knowledge graph: domains, IPs, endpoints, technologies, CVEs, and exploits. Visualize and query relationships; see coverage at a glance instead of spreadsheets.',
    icon: Network,
  },
  {
    title: 'Six-phase recon pipeline',
    description: 'Domain discovery, port scanning, HTTP probing, resource enumeration, vulnerability scanning (Nuclei, 9K+ templates), and MITRE enrichment. The agent triggers and consumes each phase.',
    icon: GitBranch,
  },
  {
    title: 'Optional network scanning',
    description: 'GVM/OpenVAS integration for 170K+ NVTs. GitHub secret hunting. Export and report in the formats your process already uses.',
    icon: Shield,
  },
]

const platformFeatures = [
  {
    title: 'Single graph, single report',
    description: 'One Neo4j graph and one report surface for the entire engagement. No tool sprawl; one place to query and export.',
    icon: Cpu,
  },
  {
    title: 'Export and integrate',
    description: 'Export findings, graphs, and reports. Integrate with your ticketing and workflow tools so Parallax fits your process.',
    icon: FileCode,
  },
]

function FeatureCard({
  title,
  description,
  icon: Icon,
}: {
  title: string
  description: string
  icon: React.ComponentType<{ size?: number; strokeWidth?: number }>
}) {
  return (
    <li className={styles.card}>
      <div className={styles.cardIcon} aria-hidden>
        <Icon size={22} strokeWidth={2} />
      </div>
      <h2 className={styles.cardTitle}>{title}</h2>
      <p className={styles.cardBody}>{description}</p>
    </li>
  )
}

export default function FeaturesPage() {
  return (
    <div className={styles.page}>
      <div className={styles.content}>
        <header className={styles.header}>
          <h1 className={styles.title}>Features</h1>
          <p className={styles.lead}>
            Agentic AI that reasons about your attack surface, a unified graph for every
            finding, and the full kill chain in one platform — with approval gates and
            full control.
          </p>
        </header>

        <section className={styles.featureGroup} aria-labelledby="agent-heading">
          <h2 id="agent-heading" className={styles.groupTitle}>Agent & orchestration</h2>
          <p className={styles.groupLead}>
            The AI agent decides what to run next and when to ask for your approval.
          </p>
          <ul className={styles.list}>
            {agentFeatures.map((f) => (
              <FeatureCard key={f.title} {...f} />
            ))}
          </ul>
        </section>

        <section className={styles.featureGroup} aria-labelledby="recon-heading">
          <h2 id="recon-heading" className={styles.groupTitle}>Recon & scanning</h2>
          <p className={styles.groupLead}>
            From discovery to vuln scanning, with everything stored in one graph.
          </p>
          <ul className={styles.list}>
            {reconFeatures.map((f) => (
              <FeatureCard key={f.title} {...f} />
            ))}
          </ul>
        </section>

        <section className={styles.featureGroup} aria-labelledby="platform-heading">
          <h2 id="platform-heading" className={styles.groupTitle}>Platform & export</h2>
          <p className={styles.groupLead}>
            One graph, one report, and the integrations you need.
          </p>
          <ul className={styles.list}>
            {platformFeatures.map((f) => (
              <FeatureCard key={f.title} {...f} />
            ))}
          </ul>
        </section>
      </div>
    </div>
  )
}
