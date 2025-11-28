'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Search, X } from 'lucide-react'

export function CompanyFilters() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [search, setSearch] = useState(searchParams.get('search') || '')

  function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    const params = new URLSearchParams()
    if (search) {
      params.set('search', search)
    }
    router.push(`/empresas?${params.toString()}`)
  }

  function handleClear() {
    setSearch('')
    router.push('/empresas')
  }

  return (
    <form onSubmit={handleSearch} className="flex items-center gap-2">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Buscar empresa..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9 w-64"
        />
      </div>
      {search && (
        <Button type="button" variant="ghost" size="icon-sm" onClick={handleClear}>
          <X className="h-4 w-4" />
        </Button>
      )}
      <Button type="submit" size="sm">Buscar</Button>
    </form>
  )
}
