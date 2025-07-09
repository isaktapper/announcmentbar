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

/**
 * Get the user's display name from the profiles table
 * @param userId The user's ID
 * @param firstNameOnly Whether to return only the first name
 * @returns The user's display name, or their email if not found
 */
export async function getUserDisplayName(userId: string, firstNameOnly: boolean = false): Promise<string> {
  try {
    const supabase = createClient()
    
    const { data, error } = await supabase
      .from('profiles')
      .select('display_name')
      .eq('id', userId)
      .single()
    
    if (error || !data?.display_name) {
      // Fallback to email from auth.user
      const { data: { user } } = await supabase.auth.getUser()
      return user?.email?.split('@')[0] || 'User'
    }
    
    return firstNameOnly ? data.display_name.split(' ')[0] : data.display_name
  } catch (error) {
    console.warn('Error fetching user display name:', error)
    return 'User'
  }
} 