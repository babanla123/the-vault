"use client"

import type React from "react"
import { useState } from "react"
import { useAuth } from "@/context/auth-context"
import { uploadToIPFS } from "@/services/ipfs"
import { useVault } from "@/hooks/useVault" // ← Our new hook
import toast from "react-hot-toast"

interface AssetUploadFormProps {
  onSuccess?: () => void
}

export default function AssetUploadForm({ onSuccess }: AssetUploadFormProps) {
  const { user } = useAuth()
  const { registerAsset, transactionPending, globalInitialized, initializeVault } = useVault()

  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  })

  // Show global vault init button if needed
  if (globalInitialized === false) {
    return (
      <div className="w-full max-w-2xl mx-auto p-8 text-center">
        <div className="bg-card rounded-xl border border-border p-8 space-y-6">
          <h2 className="text-2xl font-bold">Vault Not Initialized</h2>
          <p className="text-muted-foreground">
            The global vault needs to be initialized once (by anyone). This is a one-time setup.
          </p>
          <button
            onClick={async () => {
              try {
                await initializeVault()
                toast.success("Vault initialized globally!")
              } catch {
                // Error already toasted inside hook
              }
            }}
            disabled={transactionPending}
            className="px-8 py-4 bg-primary text-primary-foreground rounded-lg font-bold hover:bg-primary/90 transition"
          >
            {transactionPending ? "Initializing..." : "Initialize Global Vault"}
          </button>
        </div>
      </div>
    )
  }

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
    if (!file || !formData.name.trim()) {
      setError("Please select a file and enter an asset name")
      return
    }

    setLoading(true)
    setError(null)

    try {
      // 1. Upload to IPFS
      toast.loading("Uploading to IPFS...", { id: "ipfs" })
      const cid = await uploadToIPFS(file)
      toast.success("Uploaded to IPFS!", { id: "ipfs" })

      // 2. Register on-chain
      toast.loading("Registering asset on Solana...", { id: "solana" })
      await registerAsset({
        cid,
        name: formData.name.trim(),
        description: formData.description.trim(),
        fileType: file.type || "application/octet-stream",
        fileSize: file.size,
      })

      toast.success("Asset registered on-chain!", { id: "solana" })

      // Reset form
      setFile(null)
      setFormData({ name: "", description: "" })
      onSuccess?.()
    } catch (err: any) {
      console.error("Upload failed:", err)
      const msg = err?.message || "Upload failed. Please try again."
      setError(msg)
      toast.error(msg)
    } finally {
      setLoading(false)
      toast.dismiss() // clear any lingering toasts
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
          className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-all ${
            file ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
          }`}
        >
          <input type="file" onChange={handleFileSelect} className="hidden" id="file-input" />
          <label htmlFor="file-input" className="cursor-pointer block">
            <div className="text-4xl mb-3">Upload</div>
            {file ? (
              <div>
                <p className="font-semibold text-foreground">{file.name}</p>
                <p className="text-sm text-muted-foreground">
                  {(file.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
            ) : (
              <div>
                <p className="font-semibold text-foreground">Drag & drop your file here</p>
                <p className="text-sm text-muted-foreground">or click to browse</p>
              </div>
            )}
          </label>
        </div>

        {/* Asset Name */}
        <div>
          <label className="block text-sm font-semibold text-foreground mb-2">
            Asset Name <span className="text-destructive">*</span>
          </label>
          <input
            type="text"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="e.g., My Artwork, Legal Contract"
            className="w-full px-4 py-2 bg-background border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-semibold text-foreground mb-2">
            Description <span className="text-muted-foreground text-xs">(optional)</span>
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="What is this asset about?"
            rows={4}
            className="w-full px-4 py-2 bg-background border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
          />
        </div>

        {error && (
          <div className="p-4 bg-destructive/20 border border-destructive rounded-lg">
            <p className="text-destructive text-sm font-medium">{error}</p>
          </div>
        )}

        <button
          type="submit"
          disabled={loading || transactionPending || !file || !formData.name.trim()}
          className="w-full px-6 py-4 bg-primary text-primary-foreground rounded-lg font-bold hover:bg-primary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
        >
          {(loading || transactionPending) && (
            <svg className="w-5 h-5 animate-spin" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" fill="none" opacity="0.3" />
              <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="3" fill="none" />
            </svg>
          )}
          {loading || transactionPending ? "Processing..." : "Register Asset on Solana"}
        </button>
      </form>
    </div>
  )
}