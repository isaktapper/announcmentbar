import { createClient } from '@/lib/supabase-client'

export interface UserProfile {
  plan: 'free' | 'unlimited'
}

/**
 * Get the user's plan from the profiles table
 */
export async function getUserPlan(userId: string): Promise<'free' | 'unlimited'> {
  try {
    const supabase = createClient()
    
    const { data, error } = await supabase
      .from('profiles')
      .select('plan')
      .eq('id', userId)
      .single()
    
    if (error || !data) {
      console.warn('Could not fetch user plan, defaulting to free:', error)
      return 'free'
    }
    
    return data.plan as 'free' | 'unlimited'
  } catch (error) {
    console.warn('Error fetching user plan, defaulting to free:', error)
    return 'free'
  }
}

/**
 * Check if user has unlimited plan
 */
export async function isUnlimitedUser(userId: string): Promise<boolean> {
  const plan = await getUserPlan(userId)
  return plan === 'unlimited'
} 