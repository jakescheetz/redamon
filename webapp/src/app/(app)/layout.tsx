import { Suspense } from 'react'
import { QueryProvider } from '@/providers/QueryProvider'
import { ProjectProvider } from '@/providers/ProjectProvider'
import { ToastProvider } from '@/components/ui'
import { AppLayout } from '@/components/layout'

export default function AppRouteLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <QueryProvider>
      <Suspense fallback={null}>
        <ProjectProvider>
          <ToastProvider>
            <AppLayout>{children}</AppLayout>
          </ToastProvider>
        </ProjectProvider>
      </Suspense>
    </QueryProvider>
  )
}
