// ==========================================
// TIPOS DO BACKOFFICE - MillionTech
// ==========================================

// ---------- EMPRESA (Company) ----------
export interface Company {
  id: number
  mainCompanyId?: number | null // null = empresa matriz, preenchido = filial
  name: string
  corporateName: string
  typePeople: 'legal' | 'physical'
  cpf?: string
  cnpj?: string
  stateRegistration?: string
  municipalRegistration?: string
  taxRegime: 'NATIONAL' | 'NATIONAL_EXCESS' | 'NORMAL'
  cnae?: string
  responsible: string
  email: string
  cell: string
  phone?: string

  // Endereço
  zipCode: string
  address: string
  number: string
  district: string
  complement?: string
  city: string
  state: string

  // Status: -1=MASTER, 0=BLOCKED, 1=ACTIVE
  status: -1 | 0 | 1
  blockMessage?: string
  isSuper: 'y' | 'n'

  // Certificado Digital
  digitalCertificate?: string
  digitalCertificatePassword?: string

  // Horário funcionamento
  onBusinessDay: 'y' | 'n'
  businessDayOpenHour?: string
  businessDayCloseHour?: string

  logo?: string
  profileId?: number
  createdDate: string
}

export type CompanyStatus = -1 | 0 | 1

export const COMPANY_STATUS_LABELS: Record<CompanyStatus, string> = {
  [-1]: 'Master',
  [0]: 'Bloqueada',
  [1]: 'Ativa',
}

// ---------- PLANO DE ASSINATURA (Subscription Plan) ----------
export type PaymentFrequency =
  | 'NONE'
  | 'DAYS'
  | 'MONTHLY'
  | 'BIMONTHLY'
  | 'TRIMONTHLY'
  | 'QUARTERLY'
  | 'SEMIANNUAL'
  | 'ANNUAL'

export type DurationType =
  | 'NO_DURATION'
  | 'DAYS'
  | 'MONTHS'
  | 'SEMESTERS'
  | 'YEARS'

export interface SubscriptionPlan {
  id: number
  name: string
  description?: string
  img?: string
  value: number // Preço

  paymentFrequency: PaymentFrequency
  paymentFrequencyDaysAmount?: number

  durationType: DurationType
  duration?: number

  // Limites do plano
  max_customers: number
  max_products: number
  max_suppliers: number
  max_users: number
  max_branches: number
  max_logged_users: number
  max_storage: number // GB

  // Limites de notas fiscais
  max_nfe: number
  max_nfce: number
  max_nfse: number
  max_cte: number
  max_mdfe: number
  max_billets: number

  visible: 'y' | 'n'
  planIsRecurring: 'y' | 'n'
  profileId?: number

  // Integração pagamento
  paymentApiPlanId?: string
}

export const PAYMENT_FREQUENCY_LABELS: Record<PaymentFrequency, string> = {
  NONE: 'Nenhuma',
  DAYS: 'Dias',
  MONTHLY: 'Mensal',
  BIMONTHLY: 'Bimestral',
  TRIMONTHLY: 'Trimestral',
  QUARTERLY: 'Quadrimestral',
  SEMIANNUAL: 'Semestral',
  ANNUAL: 'Anual',
}

export const DURATION_TYPE_LABELS: Record<DurationType, string> = {
  NO_DURATION: 'Sem duração',
  DAYS: 'Dias',
  MONTHS: 'Meses',
  SEMESTERS: 'Semestres',
  YEARS: 'Anos',
}

// ---------- ASSINATURA DA EMPRESA (Company Subscription Plan) ----------
export interface CompanySubscriptionPlan {
  id: number
  companyId: number
  planId: number
  expirationDate: string
  value: number
  active: 'y' | 'n'
  paymentDate?: string
  alertMsg?: string

  // Upgrade/Downgrade
  cancelRequested: 'y' | 'n'
  cancelRequestedAt?: string
  planIdToUpgradeTo?: number
  upgradeRequestedAt?: string
  planIdToDowngradeTo?: number
  downgradeRequestedAt?: string

  // Integração
  paymentApiSubscriptionId?: string
  requireToSubscribe: 'y' | 'n'

  // Relacionamentos (quando populado)
  plan?: SubscriptionPlan
  company?: Company
}

// ---------- FATURAS/PAGAMENTOS ----------
export type PaymentStatus =
  | 'PENDING'
  | 'PAID'
  | 'CANCELED'
  | 'SCHEDULED'
  | 'FAILED'

export type PaymentMethod = 'CREDIT_CARD' | 'BOLETO' | 'CASH' | 'PIX'

export interface CompanySubscriptionPlanPayment {
  id: number
  companyId: number
  companySubscriptionPlanId: number
  amount: number
  totalDiscount: number
  totalIncrement: number
  installments: number

  status: PaymentStatus
  paymentMethod: PaymentMethod

  dueDate: string
  paymentDate?: string

  // Boleto
  billetUrl?: string
  billetBarcode?: string
  billetQrCode?: string

  paymentApiInvoiceId?: string

  // Relacionamentos (quando populado)
  company?: Company
  subscription?: CompanySubscriptionPlan
}

export const PAYMENT_STATUS_LABELS: Record<PaymentStatus, string> = {
  PENDING: 'Pendente',
  PAID: 'Pago',
  CANCELED: 'Cancelado',
  SCHEDULED: 'Agendado',
  FAILED: 'Falhou',
}

export const PAYMENT_METHOD_LABELS: Record<PaymentMethod, string> = {
  CREDIT_CARD: 'Cartão de Crédito',
  BOLETO: 'Boleto',
  CASH: 'Dinheiro',
  PIX: 'PIX',
}

// ---------- USUÁRIO ----------
export interface User {
  id: number
  firstname: string
  lastname: string
  email: string
  cell: string
  password?: string

  companyId: number
  canAccessMainCompany: 'y' | 'n'
  branchesIds: string // JSON array: "[1,2,3]"

  isAccountant: 'y' | 'n'
  isAdmin: 'y' | 'n'
  isSuper: 'y' | 'n'

  active: 'y' | 'n'
  permissions: string // JSON array de menu IDs
  fastAccess: string // JSON array

  photo?: string
  profileId?: number

  // Relacionamentos (quando populado)
  company?: Company
  profile?: Profile
}

// ---------- PERFIL DE ACESSO ----------
export interface Profile {
  id: number
  name: string
  permissions: string // JSON: "[1,2,3,14,15]"
  extraMenuPermissions?: string // JSON com permissões extras
  visible: 'y' | 'n'
}

// ---------- CONFIGURAÇÃO DO SISTEMA (Super Config) ----------
export type PaymentEnvironment = 'TEST' | 'PRODUCTION'

export interface SuperConfig {
  id: number
  defaultMsgSubscriptionPlanExpiring: string
  defaultMsgSubscriptionPlanPaymentPending: string
  defaultMsgSubscriptionPlanPaymentRequired: string
  daysWithoutPlanPaymentAllowed: number
  subscriptionBilletExpireDays: number
  subscriptionPlanPaymentEnvironment: PaymentEnvironment
  requireUserCellValidation: 'y' | 'n'
}

// ---------- CONTADOR (Company Accountant) ----------
export interface CompanyAccountant {
  id: string
  companyId: string
  userId: string
  name: string
  cpf?: string
  cnpj?: string
  crc: string // Registro CRC
  email: string
  cell: string

  // Endereço
  zipCode?: string
  address?: string
  number?: string
  district?: string
  complement?: string
  city?: string
  state?: string
}

// ---------- RESPOSTAS DA API ----------
export interface PaginatedResponse<T> {
  rows: T[]
  count: number
}

export interface ApiError {
  message: string
  statusCode: number
}

// ---------- AUTH ----------
export interface LoginRequest {
  email: string
  password: string
}

export interface LoginResponse {
  authToken: string
}

export interface AuthUser {
  id: number
  firstname: string
  lastname: string
  email: string
  isSuper: 'y' | 'n'
  isAdmin: 'y' | 'n'
  photo?: string
  companyId: number
}

// ---------- FILTROS DE LISTAGEM ----------
export interface ListFilters {
  skip?: number
  take?: number
  sortReference?: string
  sortDirection?: 'ASC' | 'DESC'
  filters?: {
    searchQuery?: string
    [key: string]: unknown
  }
}
