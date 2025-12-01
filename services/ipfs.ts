export interface IPFSUploadResponse {
  cid: string
  gateway: string
}

/**
 * Upload file to IPFS using secure server action
 * Returns the IPFS CID (Content Identifier)
 */
export async function uploadToIPFS(file: File): Promise<string> {
  try {
    const formData = new FormData()
    formData.append("file", file)

    const response = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: "Upload failed" }))
      throw new Error(errorData.error || "Failed to upload file to IPFS")
    }

    const data = await response.json().catch((err) => {
      console.error("[v0] JSON parse error:", err)
      throw new Error("Invalid response from upload server")
    })

    if (!data.cid) {
      throw new Error("No CID returned from upload server")
    }

    if (data.mock) {
      console.log("[v0] Using mock CID:", data.cid)
    }

    return data.cid
  } catch (error) {
    console.error("[v0] IPFS upload error:", error)
    throw new Error(error instanceof Error ? error.message : "Failed to upload file to IPFS")
  }
}

/**
 * Get IPFS gateway URL for a CID
 */
export function getIPFSGatewayUrl(cid: string): string {
  // Using ipfs.io as the gateway (can be changed to any IPFS gateway)
  return `https://ipfs.io/ipfs/${cid}`
}

/**
 * Get file from IPFS using CID
 */
export async function getFileFromIPFS(cid: string): Promise<Blob> {
  const url = getIPFSGatewayUrl(cid)
  const response = await fetch(url)
  if (!response.ok) {
    throw new Error("Failed to fetch file from IPFS")
  }
  return response.blob()
}
