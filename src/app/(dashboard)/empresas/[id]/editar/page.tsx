import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getCompanyById } from '@/actions/companies'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import { CompanyForm } from '../../company-form'

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function EditarEmpresaPage({ params }: PageProps) {
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
      <div className="flex items-center gap-4">
        <Link href={`/empresas/${company.id}`}>
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Editar Empresa</h1>
          <p className="text-muted-foreground">
            {company.name}
          </p>
        </div>
      </div>

      <CompanyForm company={company} />
    </div>
  )
}
