import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getCompanyById } from '@/actions/companies'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, Pencil, Building2, Mail, MapPin } from 'lucide-react'
import { COMPANY_STATUS_LABELS, type CompanyStatus } from '@/types'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

interface PageProps {
  params: Promise<{ id: string }>
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

export default async function EmpresaDetalhesPage({ params }: PageProps) {
  const { id } = await params

  let company
  try {
    company = await getCompanyById(Number(id))
  } catch {
    notFound()
  }

  if (!company) {
    notFound()
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/empresas">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold text-slate-900">{company.name}</h1>
              {getStatusBadge(company.status)}
            </div>
            <p className="text-muted-foreground">{company.corporateName}</p>
          </div>
        </div>
        <Link href={`/empresas/${company.id}/editar`}>
          <Button>
            <Pencil className="h-4 w-4 mr-2" />
            Editar
          </Button>
        </Link>
      </div>

      {company.status === 0 && company.blockMessage && (
        <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
          <p className="text-sm font-medium text-destructive">Motivo do bloqueio:</p>
          <p className="text-sm text-destructive/80">{company.blockMessage}</p>
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-2">
        {/* Dados da Empresa */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              Dados da Empresa
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Tipo</p>
                <p className="font-medium">
                  {company.typePeople === 'legal' ? 'Pessoa Jurídica' : 'Pessoa Física'}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">CNPJ/CPF</p>
                <p className="font-medium">{company.cnpj || company.cpf || '-'}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Inscrição Estadual</p>
                <p className="font-medium">{company.stateRegistration || '-'}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Inscrição Municipal</p>
                <p className="font-medium">{company.municipalRegistration || '-'}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Regime Tributário</p>
                <p className="font-medium">
                  {company.taxRegime === 'NATIONAL' && 'Simples Nacional'}
                  {company.taxRegime === 'NATIONAL_EXCESS' && 'Simples Nacional Excesso'}
                  {company.taxRegime === 'NORMAL' && 'Regime Normal'}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">CNAE</p>
                <p className="font-medium">{company.cnae || '-'}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contato */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5" />
              Contato
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground">Responsável</p>
              <p className="font-medium">{company.responsible}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Email</p>
              <p className="font-medium">{company.email}</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Celular</p>
                <p className="font-medium">{company.cell}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Telefone</p>
                <p className="font-medium">{company.phone || '-'}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Endereço */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Endereço
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="font-medium">
              {company.address}, {company.number}
              {company.complement && ` - ${company.complement}`}
            </p>
            <p className="text-muted-foreground">
              {company.district} - {company.city}/{company.state}
            </p>
            <p className="text-muted-foreground">CEP: {company.zipCode}</p>
          </CardContent>
        </Card>

        {/* Informações do Sistema */}
        <Card>
          <CardHeader>
            <CardTitle>Informações do Sistema</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">ID</p>
                <p className="font-medium">{company.id}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Super Admin</p>
                <p className="font-medium">{company.isSuper === 'y' ? 'Sim' : 'Não'}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Empresa Matriz</p>
                <p className="font-medium">
                  {company.mainCompanyId ? `ID: ${company.mainCompanyId}` : 'É matriz'}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Data de Cadastro</p>
                <p className="font-medium">
                  {company.createdDate
                    ? format(new Date(company.createdDate), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })
                    : '-'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
