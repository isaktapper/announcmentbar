'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function CreatePage() {
  const router = useRouter()

  useEffect(() => {
    router.push('/dashboard/create/single')
  }, [router])

  return null
} 