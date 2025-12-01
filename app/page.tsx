"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Header from "@/components/header"
import WalletConnect from "@/components/wallet-connect"
import Dashboard from "@/components/dashboard"
import AssetUploadForm from "@/components/asset-upload-form"
import { WalletProvider } from "@/context/wallet-context"
import { useAuth } from "@/context/auth-context"

function HomeContent() {
  const { user, loading } = useAuth()
  const [showUploadForm, setShowUploadForm] = useState(false)
  const router = useRouter()

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <svg className="w-6 h-6 animate-spin text-primary mr-2" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" opacity="0.25" />
          <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="2" fill="none" />
        </svg>
        <span>Loading...</span>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-12">
        {!user?.isAuthenticated ? (
          <div className="flex items-center justify-center min-h-[600px]">
            <WalletConnect />
          </div>
        ) : (
          <div className="space-y-8">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-4xl font-bold text-foreground mb-2">Your Digital Assets</h1>
                <p className="text-muted-foreground">Manage and secure your files on Solana + IPFS</p>
              </div>
              <button
                onClick={() => setShowUploadForm(!showUploadForm)}
                className="px-6 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-colors"
              >
                {showUploadForm ? "Cancel" : "+ Upload Asset"}
              </button>
            </div>

            {showUploadForm && (
              <AssetUploadForm
                onSuccess={() => {
                  setShowUploadForm(false)
                }}
              />
            )}

            <Dashboard />
          </div>
        )}
      </main>
    </div>
  )
}

export default function Home() {
  return (
    <WalletProvider>
      <HomeContent />
    </WalletProvider>
  )
}
