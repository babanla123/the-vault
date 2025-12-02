"use client"

import { useEffect } from "react"
import { useAuth } from "@/context/auth-context"
import { useRouter } from "next/navigation"

// Correct imports
import { useWallet } from "@solana/wallet-adapter-react"
import { WalletModalProvider, WalletMultiButton } from "@solana/wallet-adapter-react-ui"

import toast from "react-hot-toast"
import "@solana/wallet-adapter-react-ui/styles.css"

export default function WalletConnect() {
  const { login, user } = useAuth()
  const router = useRouter()

  // ← Hook called at the top level → VALID
  const { connected, connecting, publicKey } = useWallet()

  // Auto-login + redirect when wallet connects
  useEffect(() => {
    if (connected && publicKey && !user?.isAuthenticated) {
      const address = publicKey.toBase58()

      login(address)
        .then(() => {
          toast.success("Wallet connected!")
          router.push("/dashboard")
        })
        .catch((err) => {
          console.error(err)
          toast.error("Login failed")
        })
    } else if (connected && user?.isAuthenticated) {
      router.push("/dashboard")
    }
  }, [connected, publicKey, user, login, router])

  // Already connected → nothing to show
  if (connected && user?.isAuthenticated) {
    return null
  }

  return (
    <div className="w-full max-w-md mx-auto space-y-10 py-12">
      <div className="text-center space-y-6">
        <div className="text-8xl">Vault</div>
        <h1 className="text-4xl font-bold text-foreground">The Vault</h1>
        <p className="text-lg text-muted-foreground">
          Secure digital asset storage on Solana
        </p>
      </div>

      <WalletModalProvider>
        <div className="flex justify-center">
          <WalletMultiButton
            style={{
              background: "linear-gradient(135deg, #a855f7, #3b82f6)",
              borderRadius: "16px",
              padding: "18px 40px",
              fontSize: "18px",
              fontWeight: "700",
              height: "auto",
              boxShadow: "0 10px 30px rgba(139, 92, 246, 0.3)",
            }}
          >
            {connecting ? "Connecting..." : "Connect Wallet"}
          </WalletMultiButton>
        </div>
      </WalletModalProvider>

      <div className="space-y-4 text-center text-sm text-muted-foreground">
        <p className="flex items-center justify-center gap-2">
          <span className="text-green-500 text-lg">Check</span> Full control over your assets
        </p>
        <p className="flex items-center justify-center gap-2">
          <span className="text-green-500 text-lg">Check</span> Non-custodial & open source
        </p>
        <p className="flex items-center justify-center gap-2">
          <span className="text-green-500 text-lg">Check</span> Powered by IPFS + Solana
        </p>
      </div>
    </div>
  )
}