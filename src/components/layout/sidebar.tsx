'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { useSidebarStore } from '@/stores/sidebar'
import {
  LayoutDashboard,
  Building2,
  CreditCard,
  FileText,
  Users,
  Shield,
  Settings,
  ChevronLeft,
} from 'lucide-react'
import { Button } from '@/components/ui/button'

const menuItems = [
  {
    title: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    title: 'Empresas',
    href: '/empresas',
    icon: Building2,
  },
  {
    title: 'Planos',
    href: '/planos',
    icon: CreditCard,
  },
  {
    title: 'Faturas',
    href: '/faturas',
    icon: FileText,
  },
  {
    title: 'Usuários',
    href: '/usuarios',
    icon: Users,
  },
  {
    title: 'Perfis de Acesso',
    href: '/perfis',
    icon: Shield,
  },
  {
    title: 'Configurações',
    href: '/configuracoes',
    icon: Settings,
  },
]

export function Sidebar() {
  const pathname = usePathname()
  const { isOpen, toggle } = useSidebarStore()

  return (
    <aside
      className={cn(
        'fixed left-0 top-0 z-40 h-screen bg-slate-900 text-white transition-all duration-300',
        isOpen ? 'w-64' : 'w-16'
      )}
    >
      {/* Logo */}
      <div className="flex h-16 items-center justify-between border-b border-slate-700 px-4">
        {isOpen && (
          <span className="text-lg font-bold">MillionTech</span>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={toggle}
          className="text-white hover:bg-slate-800"
        >
          <ChevronLeft
            className={cn(
              'h-5 w-5 transition-transform',
              !isOpen && 'rotate-180'
            )}
          />
        </Button>
      </div>

      {/* Menu */}
      <nav className="flex flex-col gap-1 p-2">
        {menuItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`)
          const Icon = item.icon

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2 transition-colors',
                isActive
                  ? 'bg-slate-700 text-white'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white',
                !isOpen && 'justify-center'
              )}
              title={!isOpen ? item.title : undefined}
            >
              <Icon className="h-5 w-5 shrink-0" />
              {isOpen && <span>{item.title}</span>}
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}
