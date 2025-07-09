import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('Missing Supabase environment variables in middleware')
    return supabaseResponse
  }

  const supabase = createServerClient(
    supabaseUrl,
    supabaseAnonKey,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // IMPORTANT: Avoid writing any logic between createServerClient and
  // supabase.auth.getUser(). A simple mistake could make it very hard to debug
  // issues with users being randomly logged out.

  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Protected routes - redirect to login if not authenticated
  if ((request.nextUrl.pathname.startsWith('/dashboard') || 
       request.nextUrl.pathname.startsWith('/profile')) && !user) {
    const redirectUrl = request.nextUrl.clone()
    redirectUrl.pathname = '/auth/login'
    return NextResponse.redirect(redirectUrl)
  }

  // Check free user restrictions for /create route
  if (request.nextUrl.pathname === '/dashboard/create' && user) {
    // Get user's plan
    const { data: profileData } = await supabase
      .from('profiles')
      .select('plan')
      .eq('id', user.id)
      .single()

    if (profileData?.plan === 'free') {
      // Check if user has any active bars
      const { data: activeAnnouncements } = await supabase
        .from('announcements')
        .select('id')
        .eq('user_id', user.id)
        .eq('visibility', true)

      if (activeAnnouncements && activeAnnouncements.length > 0) {
        // Redirect to dashboard with error state
        const redirectUrl = request.nextUrl.clone()
        redirectUrl.pathname = '/dashboard'
        redirectUrl.searchParams.set('error', 'free_plan_limit')
        return NextResponse.redirect(redirectUrl)
      }
    }
  }

  // Auth routes - redirect to dashboard if already authenticated
  if (
    (request.nextUrl.pathname.startsWith('/auth/login') || 
     request.nextUrl.pathname.startsWith('/auth/signup')) && 
    user
  ) {
    const redirectUrl = request.nextUrl.clone()
    redirectUrl.pathname = '/dashboard'
    return NextResponse.redirect(redirectUrl)
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/profile/:path*',
    '/auth/:path*',
  ],
} 