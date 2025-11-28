import { cookies } from 'next/headers'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3333'

type RequestOptions = {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'
  body?: unknown
  headers?: Record<string, string>
  cache?: RequestCache
  tags?: string[]
}

export async function api<T>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<T> {
  const { method = 'GET', body, headers = {}, cache, tags } = options

  const cookieStore = await cookies()
  const token = cookieStore.get('authToken')?.value

  const requestHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
    ...headers,
  }

  if (token) {
    requestHeaders['Authorization'] = `Bearer ${token}`
  }

  const config: RequestInit & { next?: { tags: string[] } } = {
    method,
    headers: requestHeaders,
  }

  if (body) {
    config.body = JSON.stringify(body)
  }

  if (cache) {
    config.cache = cache
  }

  if (tags) {
    config.next = { tags }
  }

  const response = await fetch(`${API_URL}${endpoint}`, config)

  if (!response.ok) {
    const error = await response.json().catch(() => ({
      message: 'Erro desconhecido',
      statusCode: response.status,
    }))
    throw new Error(error.message || `HTTP Error: ${response.status}`)
  }

  // Se não tiver conteúdo, retorna objeto vazio
  const text = await response.text()
  if (!text) return {} as T

  return JSON.parse(text)
}

// Helpers para métodos comuns
export const apiGet = <T>(endpoint: string, options?: Omit<RequestOptions, 'method'>) =>
  api<T>(endpoint, { ...options, method: 'GET' })

export const apiPost = <T>(endpoint: string, body: unknown, options?: Omit<RequestOptions, 'method' | 'body'>) =>
  api<T>(endpoint, { ...options, method: 'POST', body })

export const apiPut = <T>(endpoint: string, body: unknown, options?: Omit<RequestOptions, 'method' | 'body'>) =>
  api<T>(endpoint, { ...options, method: 'PUT', body })

export const apiDelete = <T>(endpoint: string, options?: Omit<RequestOptions, 'method'>) =>
  api<T>(endpoint, { ...options, method: 'DELETE' })

// Função para construir query string de paginação
export function buildQueryString(params: Record<string, unknown>): string {
  const searchParams = new URLSearchParams()

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      if (typeof value === 'object') {
        searchParams.append(key, JSON.stringify(value))
      } else {
        searchParams.append(key, String(value))
      }
    }
  })

  const query = searchParams.toString()
  return query ? `?${query}` : ''
}
