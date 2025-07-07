import { User } from '@supabase/supabase-js'

export type AuthUser = User

export interface AuthState {
  user: AuthUser | null
  loading: boolean
}

export interface SignUpData {
  email: string
  password: string
}

export interface SignInData {
  email: string
  password: string
}

export interface AuthError {
  message: string
} 