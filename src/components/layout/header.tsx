'use client'

import { useEffect, useState } from 'react'
import { logout } from '@/actions/auth'
import { useSidebarStore } from '@/stores/sidebar'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { LogOut, User } from 'lucide-react'
import type { AuthUser } from '@/types'

export function Header() {
  const { isOpen } = useSidebarStore()
  const [user, setUser] = useState<AuthUser | null>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    // Buscar dados do usuário do cookie
    const userCookie = document.cookie
      .split('; ')
      .find((row) => row.startsWith('user='))
      ?.split('=')[1]

    if (userCookie) {
      try {
        setUser(JSON.parse(decodeURIComponent(userCookie)))
      } catch {
        // Cookie inválido
      }
    }
  }, [])

  const initials = user
    ? `${user.firstname[0]}${user.lastname[0]}`.toUpperCase()
    : 'U'

  // Evita hydration mismatch - só renderiza o dropdown depois de montar no client
  if (!mounted) {
    return (
      <header
        className={cn(
          'fixed top-0 right-0 z-30 flex h-16 items-center justify-between border-b bg-white px-6 transition-all duration-300',
          isOpen ? 'left-64' : 'left-16'
        )}
      >
        <div>
          <h2 className="text-lg font-semibold text-slate-900">Backoffice</h2>
        </div>
        <div className="h-8 w-8 rounded-full bg-slate-200 animate-pulse" />
      </header>
    )
  }

  return (
    <header
      className={cn(
        'fixed top-0 right-0 z-30 flex h-16 items-center justify-between border-b bg-white px-6 transition-all duration-300',
        isOpen ? 'left-64' : 'left-16'
      )}
    >
      <div>
        <h2 className="text-lg font-semibold text-slate-900">Backoffice</h2>
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="flex items-center gap-2">
            <Avatar className="h-8 w-8">
              <AvatarFallback className="bg-slate-900 text-white text-sm">
                {initials}
              </AvatarFallback>
            </Avatar>
            {user && (
              <span className="hidden md:inline text-sm">
                {user.firstname} {user.lastname}
              </span>
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel>
            <div className="flex flex-col">
              <span>{user?.firstname} {user?.lastname}</span>
              <span className="text-xs text-muted-foreground font-normal">
                {user?.email}
              </span>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="cursor-pointer">
            <User className="mr-2 h-4 w-4" />
            Meu Perfil
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="cursor-pointer text-red-600 focus:text-red-600"
            onClick={() => logout()}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Sair
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  )
}
