'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { z } from 'zod'
import type { AuthUser, LoginResponse } from '@/types'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3333'

const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(1, 'Senha é obrigatória'),
})

export type LoginState = {
  error?: string
  success?: boolean
}

export async function login(
  _prevState: LoginState,
  formData: FormData
): Promise<LoginState> {
  const rawData = {
    email: (formData.get('email') as string)?.trim(),
    password: (formData.get('password') as string)?.trim(),
  }

  // Validação
  const validated = loginSchema.safeParse(rawData)
  if (!validated.success) {
    const issues = validated.error.issues
    return { error: issues[0]?.message || 'Dados inválidos' }
  }

  try {
    // 1. Fazer login
    const loginResponse = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(validated.data),
    })

    if (!loginResponse.ok) {
      const error = await loginResponse.json().catch(() => ({}))
      return { error: error.message || 'Email ou senha inválidos' }
    }

    const { authToken } = (await loginResponse.json()) as LoginResponse

    // 2. Buscar dados do usuário
    const userResponse = await fetch(`${API_URL}/auth/me`, {
      headers: { Authorization: `Bearer ${authToken}` },
    })

    if (!userResponse.ok) {
      return { error: 'Erro ao buscar dados do usuário' }
    }

    const user = (await userResponse.json()) as AuthUser

    // 3. Verificar se é Super Admin
    if (user.isSuper !== 'y') {
      return { error: 'Acesso não autorizado. Apenas Super Admins podem acessar o backoffice.' }
    }

    // 4. Salvar token no cookie
    const cookieStore = await cookies()
    cookieStore.set('authToken', authToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 dias
      path: '/',
    })

    // 5. Salvar dados do usuário em cookie separado (para acesso client-side)
    cookieStore.set('user', JSON.stringify(user), {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
    })

  } catch (error) {
    console.error('Login error:', error)
    return { error: 'Erro ao conectar com o servidor' }
  }

  // Redirect deve ficar fora do try/catch
  redirect('/dashboard')
}

export async function logout() {
  const cookieStore = await cookies()
  cookieStore.delete('authToken')
  cookieStore.delete('user')
  redirect('/login')
}

export async function getAuthUser(): Promise<AuthUser | null> {
  const cookieStore = await cookies()
  const userCookie = cookieStore.get('user')

  if (!userCookie?.value) {
    return null
  }

  try {
    return JSON.parse(userCookie.value) as AuthUser
  } catch {
    return null
  }
}

export async function getAuthToken(): Promise<string | null> {
  const cookieStore = await cookies()
  return cookieStore.get('authToken')?.value || null
}

export async function isAuthenticated(): Promise<boolean> {
  const token = await getAuthToken()
  return !!token
}
