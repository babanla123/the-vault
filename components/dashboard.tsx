"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/context/auth-context"
import AssetCard from "@/components/asset-card"
import { getAssetsFromChain } from "@/services/solana"

interface Asset {
  id: string
  name: string
  description: string
  cid: string
  fileType: string
  owner: string
  timestamp: number
  fileSize: number
}

export default function Dashboard() {
  const { user } = useAuth()
  const [assets, setAssets] = useState<Asset[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    if (user?.isAuthenticated) {
      loadAssets()
      const interval = setInterval(loadAssets, 10000)
      return () => clearInterval(interval)
    }
  }, [user?.isAuthenticated])

  const loadAssets = async () => {
    try {
      setLoading(true)
      const data = await getAssetsFromChain(user?.walletAddress)
      setAssets(data)
    } catch (err) {
      console.error("Failed to load assets:", err)
    } finally {
      setLoading(false)
    }
  }

  if (!user?.isAuthenticated) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Please log in to view your assets</p>
      </div>
    )
  }

  const filteredAssets = assets
    .filter((asset) => {
      if (filter !== "all") {
        return asset.fileType.startsWith(filter)
      }
      return true
    })
    .filter((asset) => asset.name.toLowerCase().includes(searchTerm.toLowerCase()) || asset.cid.includes(searchTerm))

  return (
    <div className="space-y-6">
      {/* Filters and Search */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <input
          type="text"
          placeholder="Search by name or CID..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 px-4 py-2 bg-card border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
        />
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="px-4 py-2 bg-card border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <option value="all">All Files</option>
          <option value="image">Images</option>
          <option value="application/pdf">PDFs</option>
          <option value="text">Documents</option>
          <option value="video">Videos</option>
        </select>
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <svg className="w-6 h-6 animate-spin text-primary mr-2" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" opacity="0.25" />
            <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="2" fill="none" />
          </svg>
          <span className="text-muted-foreground">Loading your assets...</span>
        </div>
      ) : (
        <>
          {/* Assets Grid */}
          {filteredAssets.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredAssets.map((asset) => (
                <AssetCard key={asset.id} asset={asset} onRefresh={loadAssets} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-4xl mb-4">📭</div>
              <h3 className="text-lg font-semibold text-foreground mb-2">No assets found</h3>
              <p className="text-muted-foreground">
                {assets.length === 0 ? "Upload your first asset to get started" : "Try adjusting your search filters"}
              </p>
            </div>
          )}
        </>
      )}
    </div>
  )
}
