'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { MoreHorizontal, Pencil, Lock, Unlock, Trash2, Loader2 } from 'lucide-react'
import { blockCompany, unblockCompany, deleteCompany } from '@/actions/companies'
import type { Company } from '@/types'

interface CompanyActionsProps {
  company: Company
}

export function CompanyActions({ company }: CompanyActionsProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [blockDialogOpen, setBlockDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [blockMessage, setBlockMessage] = useState('')

  const isBlocked = company.status === 0

  async function handleBlock() {
    setIsLoading(true)
    const result = await blockCompany(company.id, blockMessage)
    setIsLoading(false)

    if (result.success) {
      toast.success('Empresa bloqueada com sucesso')
      setBlockDialogOpen(false)
      setBlockMessage('')
      router.refresh()
    } else {
      toast.error(result.error || 'Erro ao bloquear empresa')
    }
  }

  async function handleUnblock() {
    setIsLoading(true)
    const result = await unblockCompany(company.id)
    setIsLoading(false)

    if (result.success) {
      toast.success('Empresa desbloqueada com sucesso')
      router.refresh()
    } else {
      toast.error(result.error || 'Erro ao desbloquear empresa')
    }
  }

  async function handleDelete() {
    setIsLoading(true)
    const result = await deleteCompany(company.id)
    setIsLoading(false)

    if (result.success) {
      toast.success('Empresa excluída com sucesso')
      setDeleteDialogOpen(false)
      router.refresh()
    } else {
      toast.error(result.error || 'Erro ao excluir empresa')
    }
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon-sm">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => router.push(`/empresas/${company.id}/editar`)}>
            <Pencil className="h-4 w-4 mr-2" />
            Editar
          </DropdownMenuItem>

          {isBlocked ? (
            <DropdownMenuItem onClick={handleUnblock} disabled={isLoading}>
              <Unlock className="h-4 w-4 mr-2" />
              Desbloquear
            </DropdownMenuItem>
          ) : (
            <DropdownMenuItem onClick={() => setBlockDialogOpen(true)}>
              <Lock className="h-4 w-4 mr-2" />
              Bloquear
            </DropdownMenuItem>
          )}

          <DropdownMenuSeparator />

          <DropdownMenuItem
            onClick={() => setDeleteDialogOpen(true)}
            className="text-destructive focus:text-destructive"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Excluir
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Dialog de Bloqueio */}
      <Dialog open={blockDialogOpen} onOpenChange={setBlockDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Bloquear Empresa</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja bloquear a empresa <strong>{company.name}</strong>?
              Os usuários não poderão mais acessar o sistema.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-2">
            <Label htmlFor="blockMessage">Motivo do bloqueio (opcional)</Label>
            <Textarea
              id="blockMessage"
              placeholder="Informe o motivo do bloqueio..."
              value={blockMessage}
              onChange={(e) => setBlockMessage(e.target.value)}
            />
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setBlockDialogOpen(false)}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={handleBlock} disabled={isLoading}>
              {isLoading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Bloquear
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog de Exclusão */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Excluir Empresa</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja excluir a empresa <strong>{company.name}</strong>?
              Esta ação não pode ser desfeita.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={handleDelete} disabled={isLoading}>
              {isLoading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Excluir
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
