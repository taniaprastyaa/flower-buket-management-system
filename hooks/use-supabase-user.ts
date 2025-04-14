"use client"

import { useEffect, useState } from "react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import type { User } from "@supabase/supabase-js"

export function useSupabaseUser() {
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    const supabase = createClientComponentClient()

    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
    }

    getUser()
  }, [])

  return user
}
