import { createClient } from './supabase-client'
import { SignUpData, SignInData } from '@/types/auth'

const supabase = createClient()

export const auth = {
  /**
   * Sign up a new user with email and password
   */
  signUp: async ({ email, password }: SignUpData) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    })
    
    return { data, error }
  },

  /**
   * Sign in a user with email and password
   */
  signIn: async ({ email, password }: SignInData) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    
    return { data, error }
  },

  /**
   * Sign out the current user
   */
  signOut: async () => {
    const { error } = await supabase.auth.signOut()
    return { error }
  },

  /**
   * Get the current user
   */
  getUser: async () => {
    const { data: { user }, error } = await supabase.auth.getUser()
    return { user, error }
  },

  /**
   * Get the current session
   */
  getSession: async () => {
    const { data: { session }, error } = await supabase.auth.getSession()
    return { session, error }
  }
} 