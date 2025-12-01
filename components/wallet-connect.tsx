"use client"

import { useState } from "react"
import { useAuth } from "@/context/auth-context"
import { useRouter } from "next/navigation"
import { connectWallet } from "@/services/solana"

export default function WalletConnect() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { login } = useAuth()
  const router = useRouter()

  const handleConnect = async () => {
    setLoading(true)
    setError(null)
    try {
      const walletAddress = await connectWallet()
      await login(walletAddress)
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to connect wallet")
      setLoading(false)
    }
  }

  return (
    <div className="w-full max-w-md space-y-6">
      <div className="text-center space-y-4">
        <div className="text-6xl mb-6">🔑</div>
        <h2 className="text-3xl font-bold text-foreground">Welcome to The Vault</h2>
        <p className="text-muted-foreground text-lg">Connect your Solana wallet to manage your digital assets</p>
      </div>

      {error && (
        <div className="p-4 bg-destructive/20 border border-destructive rounded-lg">
          <p className="text-destructive text-sm font-medium">{error}</p>
        </div>
      )}

      <button
        onClick={handleConnect}
        disabled={loading}
        className="w-full px-6 py-4 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
      >
        {loading && (
          <svg className="w-5 h-5 animate-spin" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" opacity="0.25" />
            <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="2" fill="none" />
          </svg>
        )}
        {loading ? "Connecting..." : "Connect Phantom Wallet"}
      </button>

      <div className="space-y-3 text-sm text-muted-foreground">
        <p className="flex items-start gap-2">
          <span className="text-primary mt-1">✓</span>
          <span>No private keys shared with our servers</span>
        </p>
        <p className="flex items-start gap-2">
          <span className="text-primary mt-1">✓</span>
          <span>Your assets remain under your control</span>
        </p>
        <p className="flex items-start gap-2">
          <span className="text-primary mt-1">✓</span>
          <span>All transactions signed by your wallet</span>
        </p>
      </div>
    </div>
  )
}
