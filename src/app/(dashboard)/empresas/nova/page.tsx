import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import { CompanyForm } from '../company-form'

export default function NovaEmpresaPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/empresas">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Nova Empresa</h1>
          <p className="text-muted-foreground">
            Preencha os dados para criar uma nova empresa
          </p>
        </div>
      </div>

      <CompanyForm />
    </div>
  )
}
