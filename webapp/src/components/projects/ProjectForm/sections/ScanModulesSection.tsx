'use client'

import { useState } from 'react'
import { ChevronDown, Layers } from 'lucide-react'
import { Toggle } from '@/components/ui'
import type { Project } from '@prisma/client'
import styles from '../ProjectForm.module.css'
import { TimeEstimate } from '../TimeEstimate'

type FormData = Omit<Project, 'id' | 'userId' | 'createdAt' | 'updatedAt' | 'user'>

interface ScanModulesSectionProps {
  data: FormData
  updateField: <K extends keyof FormData>(field: K, value: FormData[K]) => void
}

interface ModuleNode {
  id: string
  label: string
  description: string
  depth: number
}

const SCAN_MODULE_OPTIONS: ModuleNode[] = [
  { id: 'domain_discovery', label: 'Domain Discovery', description: 'Subdomain enumeration', depth: 0 },
  { id: 'port_scan', label: 'Port Scanning', description: 'Naabu port scanner', depth: 1 },
  { id: 'http_probe', label: 'HTTP Probing', description: 'httpx HTTP analysis', depth: 2 },
  { id: 'resource_enum', label: 'Resource Enumeration', description: 'Katana, GAU, Kiterunner', depth: 3 },
  { id: 'vuln_scan', label: 'Vulnerability Scanning', description: 'Nuclei vulnerability scanner', depth: 3 },
]

// Module dependency tree: child → parent
const MODULE_DEPENDENCIES: Record<string, string | null> = {
  domain_discovery: null,
  port_scan: 'domain_discovery',
  http_probe: 'port_scan',
  resource_enum: 'http_probe',
  vuln_scan: 'http_probe',
}

// Get all modules that depend on a given module (direct + transitive)
function getDependentModules(moduleId: string): string[] {
  const dependents: string[] = []
  for (const [id, parent] of Object.entries(MODULE_DEPENDENCIES)) {
    if (parent === moduleId) {
      dependents.push(id, ...getDependentModules(id))
    }
  }
  return dependents
}

// Check if a module's parent chain is all enabled
function isParentEnabled(moduleId: string, enabledModules: string[]): boolean {
  const parent = MODULE_DEPENDENCIES[moduleId]
  if (parent === null) return true
  if (!enabledModules.includes(parent)) return false
  return isParentEnabled(parent, enabledModules)
}

// Get children of a given module
function getChildren(parentId: string | null): string[] {
  return Object.entries(MODULE_DEPENDENCIES)
    .filter(([, p]) => p === parentId)
    .map(([id]) => id)
}

// Walk up ancestor chain to find ancestor at a specific depth
function getAncestorAtDepth(moduleId: string, targetDepth: number): string | null {
  const module = SCAN_MODULE_OPTIONS.find(m => m.id === moduleId)
  if (!module) return null
  if (module.depth === targetDepth) return moduleId
  const parent = MODULE_DEPENDENCIES[moduleId]
  if (parent === null) return null
  return getAncestorAtDepth(parent, targetDepth)
}

type GuideType = 'empty' | 'line' | 'branch' | 'branch-last'

function getTreeGuides(moduleId: string): GuideType[] {
  const module = SCAN_MODULE_OPTIONS.find(m => m.id === moduleId)
  if (!module || module.depth === 0) return []

  const guides: GuideType[] = []
  const parent = MODULE_DEPENDENCIES[moduleId]
  const siblings = getChildren(parent)
  const isLastChild = siblings[siblings.length - 1] === moduleId

  for (let col = 0; col < module.depth; col++) {
    if (col === module.depth - 1) {
      // Branch connector at the innermost column
      guides.push(isLastChild ? 'branch-last' : 'branch')
    } else {
      // For outer columns, check if the ancestor at col+1 has more siblings below
      const ancestor = getAncestorAtDepth(moduleId, col + 1)
      if (ancestor) {
        const ancestorParent = MODULE_DEPENDENCIES[ancestor]
        const ancestorSiblings = getChildren(ancestorParent)
        const ancestorIsLast = ancestorSiblings[ancestorSiblings.length - 1] === ancestor
        guides.push(ancestorIsLast ? 'empty' : 'line')
      } else {
        guides.push('empty')
      }
    }
  }

  return guides
}

export function ScanModulesSection({ data, updateField }: ScanModulesSectionProps) {
  const [isOpen, setIsOpen] = useState(true)

  const toggleModule = (moduleId: string) => {
    const current = data.scanModules
    if (current.includes(moduleId)) {
      // Disabling: also disable all dependent modules
      const dependents = getDependentModules(moduleId)
      const toRemove = new Set([moduleId, ...dependents])
      updateField('scanModules', current.filter(m => !toRemove.has(m)))
    } else {
      // Enabling: also enable all parent modules in the chain
      const toAdd = [moduleId]
      let parent = MODULE_DEPENDENCIES[moduleId]
      while (parent !== null) {
        if (!current.includes(parent)) {
          toAdd.push(parent)
        }
        parent = MODULE_DEPENDENCIES[parent]
      }
      updateField('scanModules', [...current, ...toAdd])
    }
  }

  return (
    <div className={styles.section}>
      <div className={styles.sectionHeader} onClick={() => setIsOpen(!isOpen)}>
        <h2 className={styles.sectionTitle}>
          <Layers size={16} className={styles.sectionTitleIcon} />
          Scan Modules
        </h2>
        <ChevronDown
          size={16}
          className={`${styles.sectionIcon} ${isOpen ? styles.sectionIconOpen : ''}`}
        />
      </div>

      {isOpen && (
        <div className={styles.sectionContent}>
          <p className={styles.sectionDescription}>
            Control the reconnaissance pipeline by enabling or disabling specific modules. Each module builds upon the results of its parent, creating a comprehensive attack surface map from domain discovery through vulnerability detection.
          </p>
          <div className={styles.subSection}>
            <h3 className={styles.subSectionTitle}>Pipeline Modules</h3>
            <p className={styles.fieldHint} style={{ marginBottom: '0.5rem' }}>
              Modules have dependencies — disabling a parent disables all children
            </p>
            <div className={styles.treeContainer}>
              {SCAN_MODULE_OPTIONS.map(module => {
                const isEnabled = data.scanModules.includes(module.id)
                const parentEnabled = isParentEnabled(module.id, data.scanModules)
                const isDisabledByParent = !parentEnabled && !isEnabled
                const guides = getTreeGuides(module.id)

                return (
                  <div
                    key={module.id}
                    className={`${styles.treeItem} ${isDisabledByParent ? styles.treeItemDisabled : ''}`}
                  >
                    <div className={styles.treeItemContent}>
                      {guides.length > 0 && (
                        <div className={styles.treeIndent}>
                          {guides.map((guide, i) => (
                            <div key={i} className={styles.treeGuide}>
                              {guide === 'line' && <div className={styles.treeGuideLine} />}
                              {guide === 'branch' && <div className={styles.treeBranchContinue} />}
                              {guide === 'branch-last' && <div className={styles.treeBranchLast} />}
                            </div>
                          ))}
                        </div>
                      )}
                      <span className={`${styles.treeNode} ${isEnabled ? styles.treeNodeActive : ''}`} />
                      <div className={styles.treeLabel}>
                        <span className={styles.treeLabelName}>{module.label}</span>
                        <span className={styles.treeLabelDesc}>
                          {module.description}
                          {isDisabledByParent && ' (requires parent module)'}
                        </span>
                      </div>
                    </div>
                    <Toggle
                      checked={isEnabled}
                      onChange={() => toggleModule(module.id)}
                    />
                  </div>
                )
              })}
            </div>
          </div>

          <div className={styles.subSection}>
            <h3 className={styles.subSectionTitle}>General Options</h3>
            <div className={styles.toggleRow} style={{ opacity: 0.7 }}>
              <div>
                <span className={styles.toggleLabel}>Update Graph Database</span>
                <p className={styles.toggleDescription}>
                  Store scan results in Neo4j graph database (always enabled)
                </p>
              </div>
              <Toggle
                checked={true}
                onChange={() => {}}
                disabled
              />
            </div>
            <div className={styles.toggleRow}>
              <div>
                <span className={styles.toggleLabel}>Use Tor for Recon</span>
                <p className={styles.toggleDescription}>
                  Route reconnaissance traffic through Tor network
                </p>
              </div>
              <Toggle
                checked={data.useTorForRecon}
                onChange={(checked) => updateField('useTorForRecon', checked)}
              />
            </div>
            <div className={styles.toggleRow}>
              <div>
                <span className={styles.toggleLabel}>Use Bruteforce for Subdomains</span>
                <p className={styles.toggleDescription}>
                  Use wordlist-based subdomain bruteforcing
                </p>
                <TimeEstimate estimate="+5-30 min depending on wordlist size" />
              </div>
              <Toggle
                checked={data.useBruteforceForSubdomains}
                onChange={(checked) => updateField('useBruteforceForSubdomains', checked)}
              />
            </div>
          </div>

          <div className={styles.fieldRow}>
            <div className={styles.fieldGroup}>
              <label className={styles.fieldLabel}>WHOIS Max Retries</label>
              <input
                type="number"
                className="textInput"
                value={data.whoisMaxRetries}
                onChange={(e) => updateField('whoisMaxRetries', parseInt(e.target.value) || 6)}
                min={1}
                max={20}
              />
            </div>
            <div className={styles.fieldGroup}>
              <label className={styles.fieldLabel}>DNS Max Retries</label>
              <input
                type="number"
                className="textInput"
                value={data.dnsMaxRetries}
                onChange={(e) => updateField('dnsMaxRetries', parseInt(e.target.value) || 3)}
                min={1}
                max={10}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
