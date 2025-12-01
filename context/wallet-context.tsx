"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import type { PublicKey } from "@solana/web3.js"

interface WalletContextType {
  connected: boolean
  publicKey: PublicKey | null
  setConnected: (connected: boolean) => void
  setPublicKey: (publicKey: PublicKey | null) => void
}

const WalletContext = createContext<WalletContextType | undefined>(undefined)

export function WalletProvider({ children }: { children: React.ReactNode }) {
  const [connected, setConnected] = useState(false)
  const [publicKey, setPublicKey] = useState<PublicKey | null>(null)

  useEffect(() => {
    const checkWallet = async () => {
      if (typeof window !== "undefined" && window.solana) {
        try {
          const response = await window.solana.connect({ onlyIfTrusted: true })
          setPublicKey(response.publicKey)
          setConnected(true)
        } catch (err) {
          setConnected(false)
        }
      }
    }
    checkWallet()
  }, [])

  return (
    <WalletContext.Provider value={{ connected, publicKey, setConnected, setPublicKey }}>
      {children}
    </WalletContext.Provider>
  )
}

export function useWallet() {
  const context = useContext(WalletContext)
  if (context === undefined) {
    throw new Error("useWallet must be used within WalletProvider")
  }
  return context
}
