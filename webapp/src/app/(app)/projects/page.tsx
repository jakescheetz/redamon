'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, FolderOpen, RefreshCw, Upload } from 'lucide-react'
import Link from 'next/link'
import { useProjects, useDeleteProject } from '@/hooks/useProjects'
import { useProject } from '@/providers/ProjectProvider'
import { ProjectCard } from '@/components/projects/ProjectCard'
import { ImportModal } from './ImportModal'
import styles from './page.module.css'

export default function ProjectsPage() {
  const router = useRouter()
  const { setCurrentProject } = useProject()
  const [showImportModal, setShowImportModal] = useState(false)

  const { data: projects, isLoading: projectsLoading, refetch } = useProjects()
  const deleteProjectMutation = useDeleteProject()

  const handleSelectProject = (project: { id: string; name: string; targetDomain: string }) => {
    setCurrentProject({
      id: project.id,
      name: project.name,
      targetDomain: project.targetDomain,
      createdAt: '',
      updatedAt: ''
    })
    router.push(`/graph?project=${project.id}`)
  }

  const handleDeleteProject = async (projectId: string) => {
    if (confirm('Are you sure you want to delete this project? This action cannot be undone.')) {
      await deleteProjectMutation.mutateAsync(projectId)
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <FolderOpen size={20} />
          <h1 className={styles.title}>Projects</h1>
        </div>
        <div className={styles.headerActions}>
          <button
            className="iconButton"
            onClick={() => refetch()}
            title="Refresh"
          >
            <RefreshCw size={14} />
          </button>
          <button
            className="secondaryButton"
            onClick={() => setShowImportModal(true)}
            title="Import project from backup"
          >
            <Upload size={14} />
            Import Project
          </button>
          <Link href="/projects/new" className="primaryButton">
            <Plus size={14} />
            New Project
          </Link>
        </div>
      </div>

      {projectsLoading ? (
        <div className={styles.loading}>Loading...</div>
      ) : projects && projects.length > 0 ? (
        <div className={styles.grid}>
          {projects.map((project) => (
            <ProjectCard
              key={project.id}
              id={project.id}
              name={project.name}
              targetDomain={project.targetDomain}
              description={project.description}
              createdAt={project.createdAt}
              onSelect={() => handleSelectProject(project)}
              onDelete={() => handleDeleteProject(project.id)}
            />
          ))}
        </div>
      ) : (
        <div className={styles.empty}>
          <FolderOpen size={48} />
          <h2>No Projects Yet</h2>
          <p>Create your first project to get started with reconnaissance.</p>
          <Link href="/projects/new" className="primaryButton">
            <Plus size={14} />
            Create Project
          </Link>
        </div>
      )}

      <ImportModal
        isOpen={showImportModal}
        onClose={() => setShowImportModal(false)}
        onSuccess={() => refetch()}
      />
    </div>
  )
}
