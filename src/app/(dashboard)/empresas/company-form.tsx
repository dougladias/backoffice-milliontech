'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Loader2 } from 'lucide-react'
import { createCompany, updateCompany } from '@/actions/companies'
import type { Company } from '@/types'

interface CompanyFormProps {
  company?: Company
}

export function CompanyForm({ company }: CompanyFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const isEditing = !!company

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsLoading(true)

    const formData = new FormData(e.currentTarget)
    const data: Partial<Company> = {
      name: (formData.get('name') as string)?.trim(),
      corporateName: (formData.get('corporateName') as string)?.trim(),
      typePeople: formData.get('typePeople') as 'legal' | 'physical',
      cnpj: (formData.get('cnpj') as string)?.trim() || undefined,
      cpf: (formData.get('cpf') as string)?.trim() || undefined,
      stateRegistration: (formData.get('stateRegistration') as string)?.trim() || undefined,
      municipalRegistration: (formData.get('municipalRegistration') as string)?.trim() || undefined,
      taxRegime: formData.get('taxRegime') as Company['taxRegime'],
      cnae: (formData.get('cnae') as string)?.trim() || undefined,
      responsible: (formData.get('responsible') as string)?.trim(),
      email: (formData.get('email') as string)?.trim(),
      cell: (formData.get('cell') as string)?.trim(),
      phone: (formData.get('phone') as string)?.trim() || undefined,
      zipCode: (formData.get('zipCode') as string)?.trim(),
      address: (formData.get('address') as string)?.trim(),
      number: (formData.get('number') as string)?.trim(),
      district: (formData.get('district') as string)?.trim(),
      complement: (formData.get('complement') as string)?.trim() || undefined,
      city: (formData.get('city') as string)?.trim(),
      state: (formData.get('state') as string)?.trim(),
    }

    let result
    if (isEditing) {
      result = await updateCompany(company.id, data)
    } else {
      result = await createCompany(data)
    }

    setIsLoading(false)

    if (result.success) {
      toast.success(isEditing ? 'Empresa atualizada com sucesso' : 'Empresa criada com sucesso')
      router.push('/empresas')
    } else {
      toast.error(result.error || 'Erro ao salvar empresa')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Dados Gerais */}
      <Card>
        <CardHeader>
          <CardTitle>Dados Gerais</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="name">Nome Fantasia *</Label>
            <Input
              id="name"
              name="name"
              defaultValue={company?.name}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="corporateName">Razão Social *</Label>
            <Input
              id="corporateName"
              name="corporateName"
              defaultValue={company?.corporateName}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="typePeople">Tipo de Pessoa *</Label>
            <Select name="typePeople" defaultValue={company?.typePeople || 'legal'}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="legal">Pessoa Jurídica</SelectItem>
                <SelectItem value="physical">Pessoa Física</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="cnpj">CNPJ</Label>
            <Input
              id="cnpj"
              name="cnpj"
              defaultValue={company?.cnpj}
              placeholder="00.000.000/0000-00"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="cpf">CPF</Label>
            <Input
              id="cpf"
              name="cpf"
              defaultValue={company?.cpf}
              placeholder="000.000.000-00"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="stateRegistration">Inscrição Estadual</Label>
            <Input
              id="stateRegistration"
              name="stateRegistration"
              defaultValue={company?.stateRegistration}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="municipalRegistration">Inscrição Municipal</Label>
            <Input
              id="municipalRegistration"
              name="municipalRegistration"
              defaultValue={company?.municipalRegistration}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="taxRegime">Regime Tributário *</Label>
            <Select name="taxRegime" defaultValue={company?.taxRegime || 'NATIONAL'}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="NATIONAL">Simples Nacional</SelectItem>
                <SelectItem value="NATIONAL_EXCESS">Simples Nacional Excesso</SelectItem>
                <SelectItem value="NORMAL">Regime Normal</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="cnae">CNAE</Label>
            <Input
              id="cnae"
              name="cnae"
              defaultValue={company?.cnae}
            />
          </div>
        </CardContent>
      </Card>

      {/* Contato */}
      <Card>
        <CardHeader>
          <CardTitle>Contato</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="responsible">Responsável *</Label>
            <Input
              id="responsible"
              name="responsible"
              defaultValue={company?.responsible}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email *</Label>
            <Input
              id="email"
              name="email"
              type="email"
              defaultValue={company?.email}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="cell">Celular *</Label>
            <Input
              id="cell"
              name="cell"
              defaultValue={company?.cell}
              placeholder="(00) 00000-0000"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Telefone</Label>
            <Input
              id="phone"
              name="phone"
              defaultValue={company?.phone}
              placeholder="(00) 0000-0000"
            />
          </div>
        </CardContent>
      </Card>

      {/* Endereço */}
      <Card>
        <CardHeader>
          <CardTitle>Endereço</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="zipCode">CEP *</Label>
            <Input
              id="zipCode"
              name="zipCode"
              defaultValue={company?.zipCode}
              placeholder="00000-000"
              required
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="address">Logradouro *</Label>
            <Input
              id="address"
              name="address"
              defaultValue={company?.address}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="number">Número *</Label>
            <Input
              id="number"
              name="number"
              defaultValue={company?.number}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="complement">Complemento</Label>
            <Input
              id="complement"
              name="complement"
              defaultValue={company?.complement}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="district">Bairro *</Label>
            <Input
              id="district"
              name="district"
              defaultValue={company?.district}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="city">Cidade *</Label>
            <Input
              id="city"
              name="city"
              defaultValue={company?.city}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="state">Estado *</Label>
            <Input
              id="state"
              name="state"
              defaultValue={company?.state}
              placeholder="UF"
              maxLength={2}
              required
            />
          </div>
        </CardContent>
      </Card>

      {/* Botões */}
      <div className="flex justify-end gap-4">
        <Button type="button" variant="outline" onClick={() => router.back()}>
          Cancelar
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
          {isEditing ? 'Salvar Alterações' : 'Criar Empresa'}
        </Button>
      </div>
    </form>
  )
}
