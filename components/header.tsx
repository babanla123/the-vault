"use client"

import Link from "next/link"
import { useAuth } from "@/context/auth-context"

export default function Header() {
  const { user, logout } = useAuth()

  return (
    <header className="border-b border-border bg-card/50 backdrop-blur-sm">
      <div className="container mx-auto px-4 py-6 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-lg">🔐</span>
          </div>
          <h1 className="text-2xl font-bold text-foreground">The Vault</h1>
        </Link>
        <div className="hidden md:flex items-center gap-8">
          <nav className="flex gap-6">
            <Link href="/docs" className="text-muted-foreground hover:text-foreground transition-colors">
              Documentation
            </Link>
            <Link href="/about" className="text-muted-foreground hover:text-foreground transition-colors">
              About
            </Link>
            {user?.isAuthenticated && (
              <Link href="/account" className="text-muted-foreground hover:text-foreground transition-colors">
                Account
              </Link>
            )}
          </nav>
          {user?.isAuthenticated && (
            <button
              onClick={logout}
              className="px-4 py-2 text-muted-foreground hover:text-foreground transition-colors border border-border rounded hover:bg-card"
            >
              Logout
            </button>
          )}
        </div>
      </div>
    </header>
  )
}
