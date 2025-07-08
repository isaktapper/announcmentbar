import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()
    
    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      )
    }

    // Method 1: Try using service role key if available
    if (process.env.SUPABASE_SERVICE_ROLE_KEY && process.env.NEXT_PUBLIC_SUPABASE_URL) {
      try {
    const supabaseAdmin = createClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL,
          process.env.SUPABASE_SERVICE_ROLE_KEY,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    )

    const { data, error } = await supabaseAdmin.auth.admin.listUsers()
    
        if (!error && data?.users) {
          const emailExists = data.users.some(user => 
            user.email?.toLowerCase() === email.toLowerCase()
          )
          return NextResponse.json({ exists: emailExists })
        }
      } catch (adminError) {
        console.warn('Admin method failed, trying fallback:', adminError)
      }
    }

    // Method 2: Fallback - attempt signup with a dummy password to check if email exists
    // This method works because Supabase will return "User already registered" error
    // without actually creating an account when using an invalid/weak password
    const supabaseClient = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    // Use a very weak password that will fail validation if user doesn't exist
    // If user exists, we'll get "User already registered" error
    // If user doesn't exist, we'll get password validation error
    const { error: testError } = await supabaseClient.auth.signUp({
      email,
      password: '123' // Intentionally weak password to trigger validation
    })

    if (testError) {
      if (testError.message.includes('User already registered') || 
          testError.message.includes('already been registered')) {
        return NextResponse.json({ exists: true })
      }
      // Any other error (like password too weak) means user doesn't exist
      return NextResponse.json({ exists: false })
    }

    // If no error, something unexpected happened
    return NextResponse.json({ exists: false })
    
  } catch (error) {
    console.error('Email check error:', error)
    return NextResponse.json(
      { error: 'Failed to check email' },
      { status: 500 }
    )
  }
} 