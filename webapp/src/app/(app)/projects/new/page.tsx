'use client'

import { useRouter } from 'next/navigation'
import { ProjectForm } from '@/components/projects'
import { useCreateProject } from '@/hooks/useProjects'
import { useProject } from '@/providers/ProjectProvider'
import type { Project } from '@prisma/client'
import styles from './page.module.css'

type ProjectFormData = Omit<Project, 'id' | 'userId' | 'createdAt' | 'updatedAt' | 'user'>

export default function NewProjectPage() {
  const router = useRouter()
  const { isLoading, setCurrentProject } = useProject()
  const createProjectMutation = useCreateProject()

  const handleSubmit = async (data: ProjectFormData) => {
    try {
      const project = await createProjectMutation.mutateAsync({
        ...data,
        name: data.name,
        targetDomain: data.targetDomain
      })

      setCurrentProject({
        id: project.id,
        name: project.name,
        targetDomain: project.targetDomain,
        description: project.description || undefined,
        createdAt: project.createdAt.toString(),
        updatedAt: project.updatedAt.toString()
      })

      router.push(`/graph?project=${project.id}`)
    } catch (error) {
      console.error('Failed to create project:', error)
    }
  }

  const handleCancel = () => {
    router.push('/projects')
  }

  if (isLoading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>
          <div className={styles.loadingOrbit}>
            <div className={styles.loadingStar} />
            <div className={styles.loadingRing} />
            <div className={styles.loadingRing} />
            <div className={styles.loadingRing} />
          </div>
          <span className={styles.loadingText}>Loading...</span>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.container}>
      <ProjectForm
        mode="create"
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        isSubmitting={createProjectMutation.isPending}
      />
    </div>
  )
}
