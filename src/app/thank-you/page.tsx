"use client"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

export default function ThankYouPage() {
  const [count, setCount] = useState(5)
  const router = useRouter()

  useEffect(() => {
    if (count === 0) {
      router.push("/dashboard")
      return
    }
    const timer = setTimeout(() => setCount(c => c - 1), 1000)
    return () => clearTimeout(timer)
  }, [count, router])

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-yellow-50 to-yellow-100">
      <div className="bg-white rounded-2xl shadow-lg p-10 flex flex-col items-center">
        <h1 className="text-3xl font-bold mb-4 text-yellow-700">Thank you for your purchase! 🥳</h1>
        <p className="text-lg text-gray-700 mb-2">You just unlocked unlimited bars. Cheers!</p>
        <p className="text-md text-gray-500 mb-6">We're redirecting you to bar heaven in <span className="font-semibold text-yellow-700">{count}</span> second{count !== 1 ? 's' : ''}...</p>
        {/* Ingen emoji här */}
      </div>
    </div>
  )
} 