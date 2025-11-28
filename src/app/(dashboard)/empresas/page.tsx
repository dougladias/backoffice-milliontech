import { Suspense } from 'react'
import Link from 'next/link'
import { getCompanies } from '@/actions/companies'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Plus, Building2, Eye } from 'lucide-react'
import { COMPANY_STATUS_LABELS, type CompanyStatus } from '@/types'
import { CompanyActions } from './company-actions'
import { CompanyFilters } from './company-filters'

interface PageProps {
  searchParams: Promise<{
    page?: string
    search?: string
  }>
}

function getStatusBadge(status: CompanyStatus) {
  const variants: Record<CompanyStatus, 'default' | 'destructive' | 'secondary'> = {
    [-1]: 'default',
    [0]: 'destructive',
    [1]: 'secondary',
  }

  return (
    <Badge variant={variants[status]}>
      {COMPANY_STATUS_LABELS[status]}
    </Badge>
  )
}

async function CompaniesTable({ page, search }: { page: number; search?: string }) {
  const take = 20
  const skip = (page - 1) * take

  const { rows: companies, count } = await getCompanies({
    skip,
    take,
    sortReference: 'name',
    sortDirection: 'ASC',
    filters: search ? { searchQuery: search } : undefined,
  })

  const totalPages = Math.ceil(count / take)

  if (companies.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <Building2 className="h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-medium">Nenhuma empresa encontrada</h3>
        <p className="text-muted-foreground text-sm mt-1">
          {search ? 'Tente buscar com outros termos' : 'Comece criando uma nova empresa'}
        </p>
      </div>
    )
  }

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nome</TableHead>
            <TableHead>CNPJ/CPF</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Telefone</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {companies.map((company) => (
            <TableRow key={company.id}>
              <TableCell>
                <div>
                  <p className="font-medium">{company.name}</p>
                  <p className="text-sm text-muted-foreground">{company.corporateName}</p>
                </div>
              </TableCell>
              <TableCell>{company.cnpj || company.cpf || '-'}</TableCell>
              <TableCell>{company.email}</TableCell>
              <TableCell>{company.cell || company.phone || '-'}</TableCell>
              <TableCell>{getStatusBadge(company.status)}</TableCell>
              <TableCell className="text-right">
                <div className="flex items-center justify-end gap-2">
                  <Link href={`/empresas/${company.id}`}>
                    <Button variant="ghost" size="icon-sm">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </Link>
                  <CompanyActions company={company} />
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Paginação */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between px-4 py-4 border-t">
          <p className="text-sm text-muted-foreground">
            Mostrando {skip + 1} a {Math.min(skip + take, count)} de {count} empresas
          </p>
          <div className="flex gap-2">
            {page > 1 && (
              <Link href={`/empresas?page=${page - 1}${search ? `&search=${search}` : ''}`}>
                <Button variant="outline" size="sm">Anterior</Button>
              </Link>
            )}
            {page < totalPages && (
              <Link href={`/empresas?page=${page + 1}${search ? `&search=${search}` : ''}`}>
                <Button variant="outline" size="sm">Próxima</Button>
              </Link>
            )}
          </div>
        </div>
      )}
    </>
  )
}

function TableSkeleton() {
  return (
    <div className="space-y-4 p-4">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="flex items-center gap-4">
          <Skeleton className="h-10 flex-1" />
          <Skeleton className="h-10 w-32" />
          <Skeleton className="h-10 w-40" />
          <Skeleton className="h-10 w-32" />
          <Skeleton className="h-10 w-20" />
          <Skeleton className="h-10 w-20" />
        </div>
      ))}
    </div>
  )
}

export default async function EmpresasPage({ searchParams }: PageProps) {
  const params = await searchParams
  const page = Number(params.page) || 1
  const search = params.search || ''

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Empresas</h1>
          <p className="text-muted-foreground">
            Gerencie todas as empresas do sistema
          </p>
        </div>
        <Link href="/empresas/nova">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Nova Empresa
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Lista de Empresas</CardTitle>
            <CompanyFilters />
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Suspense fallback={<TableSkeleton />}>
            <CompaniesTable page={page} search={search} />
          </Suspense>
        </CardContent>
      </Card>
    </div>
  )
}
