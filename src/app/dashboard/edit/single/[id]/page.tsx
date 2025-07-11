import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import EditSingleClient from './EditSingleClient'

export default async function EditSinglePage({ params }: { params: Promise<{ id: string }> }) {
  const cookieStore = await cookies()
  const { id } = await params
  
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
      },
    }
  )
  
  // Check authentication
  const { data: { user }, error: userError } = await supabase.auth.getUser()
  if (userError || !user) {
    redirect('/auth/login')
  }

  // Fetch announcement
  const { data: announcement, error: fetchError } = await supabase
    .from('announcements')
    .select('*')
    .eq('id', id)
    .single()

  if (fetchError || !announcement) {
    redirect('/dashboard')
  }

  // Verify ownership
  if (announcement.user_id !== user.id) {
    redirect('/dashboard')
  }

  // Verify type
  if (announcement.type !== 'single') {
    redirect('/dashboard')
  }

  return <EditSingleClient announcement={announcement} />
} 