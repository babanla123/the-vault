"use client"

import { useState } from "react"
import { getIPFSGatewayUrl } from "@/services/ipfs"
import { useVault } from "@/hooks/useVault"
import toast from "react-hot-toast"

interface Asset {
  id: string
  index: number
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
  const [deleting, setDeleting] = useState(false)
  const { deleteAsset } = useVault()

  const handleCopyCID = () => {
    navigator.clipboard.writeText(asset.cid)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleDelete = async () => {
    if (!confirm(`Are you sure you want to delete "${asset.name}"? This cannot be undone.`)) {
      return
    }

    setDeleting(true)
    try {
      await deleteAsset(asset.index)
      toast.success("Asset deleted permanently")
      onRefresh?.()
    } catch (err: any) {
      toast.error(err?.message || "Failed to delete asset")
    } finally {
      setDeleting(false)
    }
  }

  const getFileIcon = (fileType: string) => {
    if (fileType.startsWith("image")) return "Image"
    if (fileType === "application/pdf") return "PDF"
    if (fileType.startsWith("video")) return "Video"
    if (fileType.startsWith("audio")) return "Audio"
    if (fileType.includes("text")) return "Document"
    return "File"
  }

  const formatDate = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const gatewayUrl = getIPFSGatewayUrl(asset.cid)

  return (
    <div className="group flex flex-col bg-card border border-border rounded-xl overflow-hidden hover:shadow-lg hover:border-primary/50 transition-all duration-300">
      {/* Preview */}
      <div className="relative h-48 bg-gradient-to-br from-background/50 to-background/80 flex items-center justify-center text-6xl">
        {getFileIcon(asset.fileType)}
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>

      {/* Content */}
      <div className="flex-1 p-5 space-y-4">
        <div>
          <h3 className="font-bold text-foreground text-lg line-clamp-2 leading-tight">
            {asset.name}
          </h3>
          <p className="text-xs text-muted-foreground mt-1">
            {asset.fileType.split("/").pop()?.toUpperCase() || "FILE"}
          </p>
        </div>

        {asset.description ? (
          <p className="text-sm text-muted-foreground line-clamp-2">
            {asset.description}
          </p>
        ) : (
          <p className="text-sm text-muted-foreground italic">No description</p>
        )}

        <div className="space-y-2 text-xs">
          <div className="flex justify-between text-muted-foreground">
            <span>Size</span>
            <span className="font-medium">
              {(asset.fileSize / 1024 / 1024).toFixed(2)} MB
            </span>
          </div>
          <div className="flex justify-between text-muted-foreground">
            <span>Uploaded</span>
            <span className="font-medium">{formatDate(asset.timestamp)}</span>
          </div>
        </div>

        {/* CID Preview */}
        <div className="bg-background/50 rounded-lg p-3 border border-border/50">
          <p className="text-xs font-mono text-muted-foreground truncate">
            {asset.cid}
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className="p-4 pt-0 grid grid-cols-3 gap-2">
        <button
          onClick={handleCopyCID}
          className="px-3 py-2 bg-primary/10 hover:bg-primary/20 text-primary rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-1.5"
        >
          {copied ? "Copied" : "Copy"}
        </button>

        <a
          href={gatewayUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="px-3 py-2 bg-secondary hover:bg-secondary/90 text-secondary-foreground rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-1.5"
        >
          View
        </a>

        <button
          onClick={handleDelete}
          disabled={deleting}
          className="px-3 py-2 bg-destructive/10 hover:bg-destructive/20 text-destructive rounded-lg text-sm font-medium transition-all disabled:opacity-50 flex items-center justify-center gap-1.5"
        >
          {deleting ? (
            <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" fill="none" opacity="0.3" />
              <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="3" fill="none" />
            </svg>
          ) : (
            "Delete"
          )}
        </button>
      </div>
    </div>
  )
}