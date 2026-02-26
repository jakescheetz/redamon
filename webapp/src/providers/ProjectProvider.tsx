'use client'

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react'
import { useSearchParams, useRouter, usePathname } from 'next/navigation'
import { useAuth } from '@clerk/nextjs'

export interface ProjectSummary {
  id: string
  name: string
  targetDomain: string
  subdomainList?: string[]
  description?: string
  agentOpenaiModel?: string
  agentToolPhaseMap?: Record<string, string[]>
  stealthMode?: boolean
  createdAt: string
  updatedAt: string
}

interface ProjectContextValue {
  currentProject: ProjectSummary | null
  setCurrentProject: (project: ProjectSummary | null) => void
  projectId: string | null
  userId: string | null
  isLoading: boolean
}

const ProjectContext = createContext<ProjectContextValue | null>(null)

const STORAGE_KEY_PROJECT = 'parallax-current-project'

export function ProjectProvider({ children }: { children: ReactNode }) {
  const [currentProject, setCurrentProjectState] = useState<ProjectSummary | null>(null)
  const [userId, setUserId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const { isSignedIn, isLoaded, getToken } = useAuth()
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()

  // Resolve Clerk user → Prisma DB user on mount
  useEffect(() => {
    if (!isLoaded) return
    if (!isSignedIn) {
      setUserId(null)
      setIsLoading(false)
      return
    }

    let cancelled = false

    async function syncUser() {
      // Wait for Clerk session to be ready (token available)
      // This prevents 401s right after sign-up when the cookie hasn't propagated
      let token: string | null = null
      try {
        token = await getToken()
      } catch {
        // Token not ready yet — will retry below
      }

      const MAX_RETRIES = 3
      const RETRY_DELAY = 1000

      for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
        if (cancelled) return

        try {
          // Pass the token as Bearer header so the server can authenticate
          // even if the HTTP-only session cookie hasn't been set yet
          const headers: HeadersInit = {}
          if (token) {
            headers['Authorization'] = `Bearer ${token}`
          }
          const res = await fetch('/api/me', { headers })
          if (res.ok) {
            const data = await res.json()
            if (data?.id && !cancelled) {
              setUserId(data.id)
              return
            }
          }

          // 401 on first attempts = session not yet propagated, retry
          if (res.status === 401 && attempt < MAX_RETRIES - 1) {
            await new Promise(r => setTimeout(r, RETRY_DELAY))
            // Re-fetch token in case it became available during the delay
            try { token = await getToken() } catch { /* ignore */ }
            continue
          }

          throw new Error(`/api/me failed: ${res.status}`)
        } catch (err) {
          if (attempt === MAX_RETRIES - 1) {
            console.error('Auth sync failed after retries:', err)
            if (!cancelled) router.push('/sign-in')
          }
        }
      }
    }

    syncUser().finally(() => {
      if (!cancelled) setIsLoading(false)
    })

    return () => { cancelled = true }
  }, [isSignedIn, isLoaded, getToken, router])

  // Initialize project from URL or localStorage
  useEffect(() => {
    if (!userId) return

    const urlProjectId = searchParams.get('project')
    const savedProjectId = localStorage.getItem(STORAGE_KEY_PROJECT)
    const projectIdToLoad = urlProjectId || savedProjectId

    if (projectIdToLoad) {
      fetch(`/api/projects/${projectIdToLoad}`)
        .then(res => res.ok ? res.json() : null)
        .then(project => {
          if (project) {
            setCurrentProjectState({
              id: project.id,
              name: project.name,
              targetDomain: project.targetDomain,
              subdomainList: project.subdomainList,
              description: project.description,
              agentOpenaiModel: project.agentOpenaiModel,
              agentToolPhaseMap: typeof project.agentToolPhaseMap === 'string'
                ? JSON.parse(project.agentToolPhaseMap)
                : project.agentToolPhaseMap,
              stealthMode: project.stealthMode,
              createdAt: project.createdAt,
              updatedAt: project.updatedAt
            })
            localStorage.setItem(STORAGE_KEY_PROJECT, project.id)
          } else {
            localStorage.removeItem(STORAGE_KEY_PROJECT)
          }
        })
        .catch(console.error)
    }
  }, [userId, searchParams])

  const setCurrentProject = useCallback((project: ProjectSummary | null) => {
    setCurrentProjectState(project)
    if (project) {
      localStorage.setItem(STORAGE_KEY_PROJECT, project.id)
      if (pathname.startsWith('/graph') || pathname.startsWith('/projects')) {
        const params = new URLSearchParams(searchParams.toString())
        params.set('project', project.id)
        router.replace(`${pathname}?${params.toString()}`, { scroll: false })
      }
    } else {
      localStorage.removeItem(STORAGE_KEY_PROJECT)
      const params = new URLSearchParams(searchParams.toString())
      params.delete('project')
      const newUrl = params.toString() ? `${pathname}?${params.toString()}` : pathname
      router.replace(newUrl, { scroll: false })
    }
  }, [searchParams, router, pathname])

  return (
    <ProjectContext.Provider value={{
      currentProject,
      setCurrentProject,
      projectId: currentProject?.id || null,
      userId,
      isLoading,
    }}>
      {children}
    </ProjectContext.Provider>
  )
}

export function useProject() {
  const context = useContext(ProjectContext)
  if (!context) {
    throw new Error('useProject must be used within ProjectProvider')
  }
  return context
}
