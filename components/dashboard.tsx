"use client"

import { useState } from "react"
import { useAuth } from "@/context/auth-context"
import AssetCard from "@/components/asset-card"
import { useVault, type Asset } from "@/hooks/useVault" // ← Our hook

export default function Dashboard() {
  const { user } = useAuth()
  const {
    assets,
    loading,
    globalInitialized,
    initializeVault,
    transactionPending,
    refetch,
  } = useVault()

  const [filter, setFilter] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")

  // Show global vault init if needed (rare, but safe)
  if (globalInitialized === false) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6">
        <div className="text-center max-w-md space-y-4">
          <h2 className="text-2xl font-bold">Global Vault Not Initialized</h2>
          <p className="text-muted-foreground">
            The vault needs to be initialized once by anyone. This is a one-time setup.
          </p>
          <button
            onClick={initializeVault}
            disabled={transactionPending}
            className="px-8 py-4 bg-primary text-primary-foreground rounded-lg font-bold hover:bg-primary/90 transition disabled:opacity-50"
          >
            {transactionPending ? "Initializing..." : "Initialize Global Vault"}
          </button>
        </div>
      </div>
    )
  }

  if (!user?.isAuthenticated) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Please log in to view your assets</p>
      </div>
    )
  }

  // Filter + Search Logic
  const filteredAssets = assets
    .filter((asset) => {
      if (filter === "all") return true
      return asset.fileType.startsWith(filter)
    })
    .filter((asset) =>
      asset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      asset.cid.toLowerCase().includes(searchTerm.toLowerCase())
    )

  return (
    <div className="space-y-6">
      {/* Header + Filters */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold">My Vault</h1>
          <span className="text-muted-foreground">
            {assets.length} asset{assets.length !== 1 && "s"}
          </span>
        </div>

        <div className="flex flex-col gap-4 sm:flex-row">
          <input
            type="text"
            placeholder="Search by name or CID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-4 py-2 bg-card border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />

          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-4 py-2 bg-card border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="all">All Files</option>
            <option value="image">Images</option>
            <option value="video">Videos</option>
            <option value="audio">Audio</option>
            <option value="application/pdf">PDFs</option>
            <option value="text">Documents</option>
          </select>
        </div>
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="flex items-center justify-center py-16">
          <svg className="w-8 h-8 animate-spin text-primary mr-3" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" opacity="0.3" fill="none" />
            <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="3" fill="none" />
          </svg>
          <span className="text-muted-foreground">Loading your vault...</span>
        </div>
      ) : filteredAssets.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredAssets.map((asset) => (
            <AssetCard
              key={asset.publicKey.toBase58()}
              asset={{
                id: asset.publicKey.toBase58(),
                index: asset.index,
                name: asset.name,
                description: asset.description,
                cid: asset.cid,
                fileType: asset.fileType,
                fileSize: asset.fileSize,
                timestamp: asset.timestamp,
                owner: user.walletAddress!,
              }}
              onRefresh={refetch} // Pass refetch to trigger update after delete
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <div className="text-6xl mb-6 opacity-50">Empty</div>
          <h3 className="text-xl font-semibold mb-2">
            {searchTerm || filter !== "all"
              ? "No assets match your filters"
              : "Your vault is empty"}
          </h3>
          <p className="text-muted-foreground">
            {searchTerm || filter !== "all"
              ? "Try adjusting your search or filter"
              : "Upload your first asset to get started!"}
          </p>
        </div>
      )}
    </div>
  )
}