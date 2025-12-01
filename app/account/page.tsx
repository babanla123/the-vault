"use client"

import { useAuth } from "@/context/auth-context"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import Header from "@/components/header"
import Link from "next/link"

export default function AccountPage() {
  const { user, logout } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!user?.isAuthenticated) {
      router.push("/")
    }
  }, [user, router])

  if (!user?.isAuthenticated) {
    return null
  }

  const handleLogout = async () => {
    await logout()
    router.push("/")
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto space-y-8">
          {/* Account Header */}
          <div className="space-y-2">
            <h1 className="text-4xl font-bold text-foreground">Account Settings</h1>
            <p className="text-muted-foreground">Manage your Vault account and wallet</p>
          </div>

          {/* Account Info Card */}
          <div className="bg-card border border-border rounded-lg p-8 space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-6">Connected Wallet</h2>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-semibold text-muted-foreground">Wallet Address</label>
                  <p className="text-foreground font-mono bg-background/50 p-3 rounded border border-border mt-2 break-all">
                    {user.walletAddress}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-semibold text-muted-foreground">User ID</label>
                  <p className="text-foreground font-mono bg-background/50 p-3 rounded border border-border mt-2">
                    {user.id}
                  </p>
                </div>
              </div>
            </div>

            {/* Copy Wallet Address */}
            <button
              onClick={() => {
                navigator.clipboard.writeText(user.walletAddress)
              }}
              className="w-full px-4 py-2 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-colors"
            >
              Copy Wallet Address
            </button>
          </div>

          {/* Account Actions */}
          <div className="bg-card border border-border rounded-lg p-8 space-y-4">
            <h2 className="text-2xl font-bold text-foreground mb-6">Account Actions</h2>
            <Link
              href="/"
              className="block w-full px-4 py-3 bg-background border border-border text-foreground rounded-lg font-semibold hover:bg-card transition-colors text-center"
            >
              Back to Dashboard
            </Link>
            <button
              onClick={handleLogout}
              className="w-full px-4 py-3 bg-destructive/10 border border-destructive text-destructive rounded-lg font-semibold hover:bg-destructive/20 transition-colors"
            >
              Logout
            </button>
          </div>

          {/* Security Notice */}
          <div className="bg-card border border-border rounded-lg p-6 space-y-3">
            <h3 className="text-lg font-semibold text-foreground">Security Notice</h3>
            <p className="text-sm text-muted-foreground">
              Your wallet is secured by Phantom or your wallet provider. The Vault never has access to your private
              keys. All transactions require your wallet approval.
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}
