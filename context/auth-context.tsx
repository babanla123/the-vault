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
    const checkAuth = async () => {
      try {
        const storedUser = localStorage.getItem("vault_user")
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser)
          setUser(parsedUser)
          console.log("[v0] Auth restored from localStorage for:", parsedUser.id)
        }
      } catch (err) {
        console.error("[v0] Failed to restore authentication:", err)
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

      const response = await fetch("/api/auth/set-cookie", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user: newUser }),
      })

      if (!response.ok) {
        throw new Error("Failed to set authentication cookie")
      }

      console.log("[v0] User logged in:", newUser.id)
    } catch (error) {
      console.error("[v0] Login error:", error)
      setUser(null)
      localStorage.removeItem("vault_user")
      throw error
    } finally {
      setLoading(false)
    }
  }

  const logout = async () => {
    try {
      setLoading(true)
      setUser(null)
      localStorage.removeItem("vault_user")

      await fetch("/api/auth/logout", {
        method: "POST",
      }).catch(() => {
        // Ignore errors during logout
      })

      console.log("[v0] User logged out")
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
