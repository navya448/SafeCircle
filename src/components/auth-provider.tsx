
"use client"

import { usePathname, useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    // This is a simple auth check using localStorage.
    // In a real app, you would use a more secure method.
    const user = localStorage.getItem('safeCircleUser')
    
    if (!user && pathname !== '/signup') {
      router.push('/signup')
    }
  }, [pathname, router])

  return <>{children}</>
}
