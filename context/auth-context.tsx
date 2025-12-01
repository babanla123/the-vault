"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

interface AuthContextType {
  user: {
    id: string
    walletAddress: string
    isAuthenticated: boolean
  } | null
  loading: boolean
  login: (walletAddress: string) => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthContextType["user"]>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check if user is already authenticated (persisted in localStorage)
    const checkAuth = async () => {
      try {
        const storedUser = localStorage.getItem("vault_user")
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser)
          setUser(parsedUser)
          document.cookie = `vault_user=${JSON.stringify(parsedUser)}; path=/`
        }
      } catch (err) {
        console.error("Failed to restore authentication:", err)
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [])

  const login = async (walletAddress: string) => {
    try {
      setLoading(true)
      const newUser = {
        id: `user_${Date.now()}`,
        walletAddress: walletAddress,
        isAuthenticated: true,
      }
      setUser(newUser)
      localStorage.setItem("vault_user", JSON.stringify(newUser))
      document.cookie = `vault_user=${JSON.stringify(newUser)}; path=/`
    } finally {
      setLoading(false)
    }
  }

  const logout = async () => {
    try {
      setLoading(true)
      setUser(null)
      localStorage.removeItem("vault_user")
      document.cookie = "vault_user=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC"
    } finally {
      setLoading(false)
    }
  }

  return <AuthContext.Provider value={{ user, loading, login, logout }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within AuthProvider")
  }
  return context
}
