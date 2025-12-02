import { type NextRequest, NextResponse } from "next/server"
/**
 * Server-side API route for secure IPFS file uploads
 * Handles Web3.Storage and Pinata uploads with server-side credentials
 */
export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    try {
      // Try Web3.Storage first
      const web3StorageToken = process.env.NEXT_PUBLIC_WEB3_STORAGE_TOKEN
      if (web3StorageToken) {
        const cid = await uploadToWeb3Storage(file, web3StorageToken)
        return NextResponse.json({ cid, success: true })
      }
    } catch (web3Error) {
      console.warn("[Web3.Storage] Upload failed, trying next provider:", web3Error)
    }

    try {
      const cid = await uploadToPinata(file)
      return NextResponse.json({ cid, success: true })
    } catch (pinataError) {
      const errorMessage = pinataError instanceof Error ? pinataError.message : "Unknown error occurred"
      console.warn("[Pinata] Upload failed, using mock:", pinataError)
      return NextResponse.json({ error: "Failed to upload to pinata", details: errorMessage,  })
    }

  } catch (error) {
    console.error("[Upload Route] Error:", error)
    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred"
    return NextResponse.json({ error: "Failed to upload file", details: errorMessage }, { status: 500 })
  }
}

async function uploadToWeb3Storage(file: File, token: string): Promise<string> {
  const formData = new FormData()
  formData.append("file", file)

  const response = await fetch(`https://api.web3.storage/upload`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`Web3.Storage error (${response.status}): ${errorText}`)
  }

  const contentType = response.headers.get("content-type")
  if (!contentType?.includes("application/json")) {
    throw new Error("Invalid response type from Web3.Storage")
  }

  const data = await response.json()
  if (!data.cid) {
    throw new Error("No CID returned from Web3.Storage")
  }
  return data.cid
}

async function uploadToPinata(file: File): Promise<string> {
  const formData = new FormData()
  formData.append("file", file)
  formData.append("network", "public")

  const response = await fetch("https://uploads.pinata.cloud/v3/files", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.PINATA_JWT!}`,
    },
    body: formData,
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`Pinata error (${response.status}): ${errorText}`)
  }

  const contentType = response.headers.get("content-type")
  if (!contentType?.includes("application/json")) {
    throw new Error("Invalid response type from Pinata")
  }

  const { data } = await response.json()
  if (!data.cid) {
    throw new Error("No IpfsHash returned from Pinata")
  }
  return data.cid
}
