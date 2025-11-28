'use client'

import { useSidebarStore } from '@/stores/sidebar'
import { cn } from '@/lib/utils'
import { Sidebar } from '@/components/layout/sidebar'
import { Header } from '@/components/layout/header'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { isOpen } = useSidebarStore()

  return (
    <div className="min-h-screen bg-slate-100">
      <Sidebar />
      <Header />
      <main
        className={cn(
          'pt-16 transition-all duration-300',
          isOpen ? 'ml-64' : 'ml-16'
        )}
      >
        <div className="p-6">{children}</div>
      </main>
    </div>
  )
}
