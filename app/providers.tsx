// app/providers.tsx
"use client"

import { ReactNode, useMemo } from "react"
import { ConnectionProvider, WalletProvider } from "@solana/wallet-adapter-react"
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui"
import { PhantomWalletAdapter } from "@solana/wallet-adapter-wallets"
import { Cluster, clusterApiUrl } from "@solana/web3.js"
import { AuthProvider } from "@/context/auth-context"
import "@solana/wallet-adapter-react-ui/styles.css"

export default function Providers({ children }: { children: ReactNode }) {
  // Use your env var!
  const network = process.env.NEXT_PUBLIC_SOLANA_NETWORK || "devnet"
  const customRpc = process.env.NEXT_PUBLIC_RPC_ENDPOINT

  const endpoint = useMemo(() => {
    return customRpc || clusterApiUrl(network as unknown as Cluster)
  }, [customRpc, network])

  const wallets = useMemo(() => [new PhantomWalletAdapter()], [])

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          <AuthProvider>{children}</AuthProvider>
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  )
}