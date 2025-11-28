'use server'

import { revalidatePath } from 'next/cache'
import { apiGet, apiPost, apiPut, apiDelete, buildQueryString } from '@/lib/api'
import type { Company, PaginatedResponse, ListFilters } from '@/types'

// Listar empresas com paginação
export async function getCompanies(filters: ListFilters = {}): Promise<PaginatedResponse<Company>> {
  const params: Record<string, unknown> = {
    skip: filters.skip ?? 0,
    take: filters.take ?? 20,
    sortReference: filters.sortReference ?? 'name',
    sortDirection: filters.sortDirection ?? 'ASC',
  }

  // Só adiciona filters se tiver searchQuery
  if (filters.filters?.searchQuery) {
    params.filters = filters.filters
  }

  const query = buildQueryString(params)

  return apiGet<PaginatedResponse<Company>>(`/companies${query}`, {
    tags: ['companies'],
  })
}

// Buscar empresa por ID
export async function getCompanyById(id: number): Promise<Company> {
  return apiGet<Company>(`/companies/${id}`, {
    tags: ['companies', `company-${id}`],
  })
}

// Criar empresa
export async function createCompany(data: Partial<Company>): Promise<{ success: boolean; error?: string; company?: Company }> {
  try {
    const company = await apiPost<Company>('/companies', data)
    revalidatePath('/empresas')
    return { success: true, company }
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Erro ao criar empresa' }
  }
}

// Atualizar empresa
export async function updateCompany(id: number, data: Partial<Company>): Promise<{ success: boolean; error?: string }> {
  try {
    await apiPut(`/companies/${id}`, data)
    revalidatePath('/empresas')
    revalidatePath(`/empresas/${id}`)
    return { success: true }
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Erro ao atualizar empresa' }
  }
}

// Deletar empresa
export async function deleteCompany(id: number): Promise<{ success: boolean; error?: string }> {
  try {
    await apiDelete(`/companies/${id}`)
    revalidatePath('/empresas')
    return { success: true }
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Erro ao deletar empresa' }
  }
}

// Bloquear empresa
export async function blockCompany(id: number, blockMessage?: string): Promise<{ success: boolean; error?: string }> {
  try {
    await apiPut(`/companies/${id}`, {
      status: 0,
      blockMessage: blockMessage || 'Empresa bloqueada pelo administrador'
    })
    revalidatePath('/empresas')
    revalidatePath(`/empresas/${id}`)
    return { success: true }
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Erro ao bloquear empresa' }
  }
}

// Desbloquear empresa
export async function unblockCompany(id: number): Promise<{ success: boolean; error?: string }> {
  try {
    await apiPut(`/companies/${id}`, {
      status: 1,
      blockMessage: null
    })
    revalidatePath('/empresas')
    revalidatePath(`/empresas/${id}`)
    return { success: true }
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Erro ao desbloquear empresa' }
  }
}
