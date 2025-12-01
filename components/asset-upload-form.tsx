"use client"

import type React from "react"
import { useState } from "react"
import { useAuth } from "@/context/auth-context"
import { uploadToIPFS } from "@/services/ipfs"
import { registerAssetOnChain } from "@/services/solana"

interface AssetUploadFormProps {
  onSuccess?: () => void
}

export default function AssetUploadForm({ onSuccess }: AssetUploadFormProps) {
  const { user } = useAuth()
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  })

  if (!user?.isAuthenticated) {
    return (
      <div className="w-full max-w-2xl mx-auto p-6 bg-card rounded-xl border border-border text-center">
        <p className="text-muted-foreground">Please log in to upload assets</p>
      </div>
    )
  }

  const handleFileDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    const droppedFile = e.dataTransfer.files[0]
    if (droppedFile) {
      setFile(droppedFile)
      setError(null)
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      setFile(selectedFile)
      setError(null)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!file || !formData.name) {
      setError("Please select a file and enter an asset name")
      return
    }

    setLoading(true)
    setError(null)

    try {
      // Upload to IPFS
      const cid = await uploadToIPFS(file)

      await registerAssetOnChain(
        {
          name: formData.name,
          description: formData.description,
          fileType: file.type,
          cid,
          fileSize: file.size,
        },
        user.walletAddress,
      )

      // Reset form
      setFile(null)
      setFormData({ name: "", description: "" })
      onSuccess?.()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to upload asset")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-6 p-6 bg-card rounded-xl border border-border">
        <h2 className="text-2xl font-bold text-foreground">Register New Asset</h2>

        {/* File Upload */}
        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleFileDrop}
          className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
            file ? "border-primary bg-primary/5" : "border-border hover:border-primary/50 hover:bg-card"
          }`}
        >
          <input type="file" onChange={handleFileSelect} className="hidden" id="file-input" />
          <label htmlFor="file-input" className="cursor-pointer block">
            <div className="text-4xl mb-3">📤</div>
            {file ? (
              <div>
                <p className="font-semibold text-foreground">{file.name}</p>
                <p className="text-sm text-muted-foreground">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
              </div>
            ) : (
              <div>
                <p className="font-semibold text-foreground">Drag and drop your file here</p>
                <p className="text-sm text-muted-foreground">or click to browse your computer</p>
              </div>
            )}
          </label>
        </div>

        {/* Asset Name */}
        <div>
          <label className="block text-sm font-semibold text-foreground mb-2">Asset Name *</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="e.g., My Artwork, Contract Document"
            className="w-full px-4 py-2 bg-background border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        {/* Asset Description */}
        <div>
          <label className="block text-sm font-semibold text-foreground mb-2">Description</label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Add details about your asset..."
            rows={4}
            className="w-full px-4 py-2 bg-background border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
          />
        </div>

        {error && (
          <div className="p-4 bg-destructive/20 border border-destructive rounded-lg">
            <p className="text-destructive text-sm font-medium">{error}</p>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading || !file}
          className="w-full px-6 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {loading && (
            <svg className="w-5 h-5 animate-spin" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" opacity="0.25" />
              <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="2" fill="none" />
            </svg>
          )}
          {loading ? "Uploading..." : "Register Asset"}
        </button>
      </form>
    </div>
  )
}
