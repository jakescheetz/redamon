'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { createPortal } from 'react-dom'
import { useRouter, usePathname } from 'next/navigation'
import { ChevronRight, FolderOpen, Plus, Settings } from 'lucide-react'
import { useProject } from '@/providers/ProjectProvider'
import { useProjects, type ProjectListItem } from '@/hooks/useProjects'
import styles from './SidebarProjectSelector.module.css'

interface SidebarProjectSelectorProps {
  isCollapsed: boolean
}

export function SidebarProjectSelector({ isCollapsed }: SidebarProjectSelectorProps) {
  const router = useRouter()
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)
  const [dropdownPos, setDropdownPos] = useState({ top: 0, left: 0 })
  const triggerRef = useRef<HTMLButtonElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const { currentProject, setCurrentProject, isLoading } = useProject()
  const { data: projects } = useProjects()

  const updatePosition = useCallback(() => {
    if (!triggerRef.current) return
    const rect = triggerRef.current.getBoundingClientRect()
    const dropdownHeight = 320
    let top = rect.top
    // If dropdown would go off the bottom, anchor to bottom of viewport
    if (top + dropdownHeight > window.innerHeight) {
      top = window.innerHeight - dropdownHeight - 8
    }
    setDropdownPos({
      top: Math.max(8, top),
      left: rect.right + 8,
    })
  }, [])

  useEffect(() => {
    if (!isOpen) return
    updatePosition()

    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node
      if (
        triggerRef.current && !triggerRef.current.contains(target) &&
        dropdownRef.current && !dropdownRef.current.contains(target)
      ) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isOpen, updatePosition])

  const handleSelectProject = (project: ProjectListItem) => {
    setCurrentProject({
      id: project.id,
      name: project.name,
      targetDomain: project.targetDomain,
      subdomainList: project.subdomainList,
      description: project.description || undefined,
      createdAt: project.createdAt,
      updatedAt: project.updatedAt
    })
    setIsOpen(false)
    if (pathname.match(/\/projects\/[^/]+\/settings/)) {
      router.push(`/projects/${project.id}/settings`)
    }
  }

  const handleSettings = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (currentProject) {
      router.push(`/projects/${currentProject.id}/settings`)
      setIsOpen(false)
    }
  }

  const handleNewProject = () => {
    router.push('/projects/new')
    setIsOpen(false)
  }

  const handleViewAll = () => {
    router.push('/projects')
    setIsOpen(false)
  }

  const handleToggle = () => {
    if (!isOpen) {
      updatePosition()
    }
    setIsOpen(!isOpen)
  }

  return (
    <div className={styles.container}>
      <button
        ref={triggerRef}
        className={`${styles.trigger} ${isCollapsed ? styles.triggerCollapsed : ''}`}
        onClick={handleToggle}
        title={isCollapsed ? (currentProject?.name || 'Select Project') : undefined}
      >
        <FolderOpen size={16} className={styles.triggerIcon} />
        {!isCollapsed && (
          <>
            <span className={styles.projectName}>
              {currentProject?.name || 'No Project'}
            </span>
            <ChevronRight size={12} className={`${styles.chevron} ${isOpen ? styles.chevronOpen : ''}`} />
          </>
        )}
      </button>

      {isOpen && createPortal(
        <div
          ref={dropdownRef}
          className={styles.dropdown}
          style={{ top: dropdownPos.top, left: dropdownPos.left }}
        >
          <div className={styles.header}>
            <span className={styles.headerTitle}>Projects</span>
            {currentProject && (
              <button
                className={styles.settingsButton}
                onClick={handleSettings}
                title="Project Settings"
              >
                <Settings size={12} />
              </button>
            )}
          </div>

          <div className={styles.list}>
            {isLoading ? (
              <div className={styles.empty}>Loading...</div>
            ) : projects && projects.length > 0 ? (
              projects.map((project) => (
                <button
                  key={project.id}
                  className={`${styles.item} ${currentProject?.id === project.id ? styles.itemActive : ''}`}
                  onClick={() => handleSelectProject(project)}
                >
                  <div className={styles.itemContent}>
                    <span className={styles.itemName}>{project.name}</span>
                    <span className={styles.itemDomain}>{project.targetDomain}</span>
                  </div>
                </button>
              ))
            ) : (
              <div className={styles.empty}>No projects yet</div>
            )}
          </div>

          <div className={styles.footer}>
            <button className={styles.footerButton} onClick={handleNewProject}>
              <Plus size={12} />
              New Project
            </button>
            <button className={styles.footerButton} onClick={handleViewAll}>
              View All
            </button>
          </div>
        </div>,
        document.body
      )}
    </div>
  )
}
