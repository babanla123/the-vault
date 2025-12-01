"use client"

import { useState } from "react"
import { getIPFSGatewayUrl } from "@/services/ipfs"

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

interface AssetCardProps {
  asset: Asset
  onRefresh?: () => void
}

export default function AssetCard({ asset, onRefresh }: AssetCardProps) {
  const [copied, setCopied] = useState(false)

  const handleCopyCID = () => {
    navigator.clipboard.writeText(asset.cid)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const getFileIcon = (fileType: string) => {
    if (fileType.startsWith("image")) return "🖼️"
    if (fileType.includes("pdf")) return "📄"
    if (fileType.startsWith("video")) return "🎥"
    if (fileType.startsWith("audio")) return "🎵"
    return "📦"
  }

  const formatDate = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  const gatewayUrl = getIPFSGatewayUrl(asset.cid)

  return (
    <div className="flex flex-col bg-card border border-border rounded-lg overflow-hidden hover:border-primary/50 transition-colors">
      {/* Preview Area */}
      <div className="h-40 bg-background/50 flex items-center justify-center text-5xl">
        {getFileIcon(asset.fileType)}
      </div>

      {/* Content */}
      <div className="flex-1 p-4 space-y-3">
        <div>
          <h3 className="font-semibold text-foreground truncate">{asset.name}</h3>
          <p className="text-xs text-muted-foreground mt-1">{asset.fileType || "Unknown type"}</p>
        </div>

        {asset.description && <p className="text-sm text-muted-foreground line-clamp-2">{asset.description}</p>}

        <div className="space-y-2 text-xs text-muted-foreground">
          <div className="flex items-center justify-between">
            <span>Size:</span>
            <span>{(asset.fileSize / 1024).toFixed(2)} KB</span>
          </div>
          <div className="flex items-center justify-between">
            <span>Date:</span>
            <span>{formatDate(asset.timestamp)}</span>
          </div>
        </div>

        {/* CID Display */}
        <div className="bg-background/50 rounded p-2 break-all">
          <p className="text-xs font-mono text-muted-foreground">{asset.cid.substring(0, 16)}...</p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-2 p-4 bg-background/30 border-t border-border">
        <button
          onClick={handleCopyCID}
          className="flex-1 px-3 py-2 bg-primary text-primary-foreground rounded text-sm font-medium hover:bg-primary/90 transition-colors"
        >
          {copied ? "✓ Copied" : "📋 Copy CID"}
        </button>
        <a
          href={gatewayUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 flex items-center justify-center px-3 py-2 bg-secondary text-secondary-foreground rounded text-sm font-medium hover:bg-secondary/90 transition-colors"
        >
          🔗 View
        </a>
      </div>
    </div>
  )
}
