import Header from "@/components/header"

export const metadata = {
  title: "Documentation - The Vault",
  description: "Complete documentation and guides for The Vault platform",
}

export default function DocsPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="space-y-4 mb-12">
            <h1 className="text-5xl font-bold text-foreground">Documentation</h1>
            <p className="text-xl text-muted-foreground">Complete guides and references for The Vault platform</p>
          </div>

          {/* Table of Contents */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Getting Started */}
            <section className="bg-card border border-border rounded-lg p-6 space-y-4">
              <h2 className="text-2xl font-bold text-foreground">Getting Started</h2>
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-primary">1. Connect Your Wallet</h3>
                <p className="text-muted-foreground">
                  Download Phantom Wallet or Solflare and connect your Solana account to The Vault. Your private keys
                  never leave your device.
                </p>
              </div>
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-primary">2. Upload Your Assets</h3>
                <p className="text-muted-foreground">
                  Click "Upload Asset" and select files from your device. The Vault supports all file types and
                  automatically detects file metadata.
                </p>
              </div>
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-primary">3. View Your Dashboard</h3>
                <p className="text-muted-foreground">
                  All uploaded assets appear in your dashboard with CIDs, metadata, and preview options. Search and
                  filter by file type or date.
                </p>
              </div>
            </section>

            {/* Key Concepts */}
            <section className="bg-card border border-border rounded-lg p-6 space-y-4">
              <h2 className="text-2xl font-bold text-foreground">Key Concepts</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-primary mb-2">Content Identifier (CID)</h3>
                  <p className="text-sm text-muted-foreground">
                    Unique hash representing your file on IPFS. Use it to retrieve your file anytime, anywhere.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-primary mb-2">On-Chain Metadata</h3>
                  <p className="text-sm text-muted-foreground">
                    Your asset information is stored permanently on Solana, creating immutable proof of ownership.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-primary mb-2">Wallet Authentication</h3>
                  <p className="text-sm text-muted-foreground">
                    Your Solana wallet serves as your identity and authentication method. No passwords needed.
                  </p>
                </div>
              </div>
            </section>

            {/* File Management */}
            <section className="bg-card border border-border rounded-lg p-6 space-y-4">
              <h2 className="text-2xl font-bold text-foreground">File Management</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-primary mb-2">Supported File Types</h3>
                  <p className="text-sm text-muted-foreground">
                    Images (PNG, JPG, GIF, WebP), PDFs, Documents (DOCX, TXT), Videos, and more. No file size
                    restrictions.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-primary mb-2">Viewing Assets</h3>
                  <p className="text-sm text-muted-foreground">
                    Preview images and PDFs directly in the dashboard. Use the IPFS gateway link to view from any
                    device.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-primary mb-2">Sharing Assets</h3>
                  <p className="text-sm text-muted-foreground">
                    Share CIDs with anyone to grant access to your files. CIDs are permanent and location-independent.
                  </p>
                </div>
              </div>
            </section>

            {/* Security */}
            <section className="bg-card border border-border rounded-lg p-6 space-y-4">
              <h2 className="text-2xl font-bold text-foreground">Security & Privacy</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-primary mb-2">Wallet Security</h3>
                  <p className="text-sm text-muted-foreground">
                    Your private keys are never exposed to The Vault. All transactions require your wallet approval.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-primary mb-2">Data Privacy</h3>
                  <p className="text-sm text-muted-foreground">
                    Your files are stored on decentralized IPFS nodes. The Vault has no central control over your data.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-primary mb-2">Immutability</h3>
                  <p className="text-sm text-muted-foreground">
                    Once uploaded, file content cannot be modified. CIDs ensure content authenticity forever.
                  </p>
                </div>
              </div>
            </section>
          </div>

          {/* API Reference Section */}
          <section className="mt-12 space-y-6">
            <h2 className="text-3xl font-bold text-foreground">API Reference</h2>
            <div className="bg-card border border-border rounded-lg p-6 space-y-4">
              <h3 className="text-xl font-semibold text-foreground">Upload Asset</h3>
              <pre className="bg-background p-4 rounded border border-border text-sm text-muted-foreground overflow-x-auto">
                {`POST /api/upload
Content-Type: multipart/form-data

file: <binary file data>
name: string
description: string

Response:
{
  cid: "QmXxxx...",
  fileHash: "0x123...",
  ipfsGateway: "https://ipfs.io/ipfs/QmXxxx..."
}`}
              </pre>
            </div>

            <div className="bg-card border border-border rounded-lg p-6 space-y-4">
              <h3 className="text-xl font-semibold text-foreground">Register on Solana</h3>
              <pre className="bg-background p-4 rounded border border-border text-sm text-muted-foreground overflow-x-auto">
                {`POST /api/register-asset
Content-Type: application/json

{
  cid: "QmXxxx...",
  name: "My Asset",
  description: "Asset description",
  fileType: "image/png",
  walletAddress: "Sol..."
}

Response:
{
  transactionSignature: "5hxxx...",
  timestamp: 1234567890
}`}
              </pre>
            </div>
          </section>

          {/* FAQ */}
          <section className="mt-12 space-y-6">
            <h2 className="text-3xl font-bold text-foreground">Frequently Asked Questions</h2>
            <div className="space-y-4">
              <div className="bg-card border border-border rounded-lg p-6">
                <h3 className="text-lg font-semibold text-foreground mb-2">Is my data encrypted?</h3>
                <p className="text-muted-foreground">
                  Files on IPFS are public by their content hash. For sensitive files, encrypt before uploading using
                  your preferred encryption tool.
                </p>
              </div>
              <div className="bg-card border border-border rounded-lg p-6">
                <h3 className="text-lg font-semibold text-foreground mb-2">What happens if IPFS nodes go offline?</h3>
                <p className="text-muted-foreground">
                  As long as at least one IPFS node has your content, it remains accessible. We recommend pinning
                  important files to multiple providers.
                </p>
              </div>
              <div className="bg-card border border-border rounded-lg p-6">
                <h3 className="text-lg font-semibold text-foreground mb-2">Can I delete files?</h3>
                <p className="text-muted-foreground">
                  IPFS content is immutable. You can stop pinning files to remove them from indexing, but copies may
                  persist on other nodes.
                </p>
              </div>
              <div className="bg-card border border-border rounded-lg p-6">
                <h3 className="text-lg font-semibold text-foreground mb-2">How much does this cost?</h3>
                <p className="text-muted-foreground">
                  File uploads to IPFS are free. Solana transactions have minimal fees (fractions of a cent). No
                  subscription required.
                </p>
              </div>
            </div>
          </section>

          {/* Support */}
          <section className="mt-12 py-12 text-center space-y-4 border-t border-border">
            <h2 className="text-2xl font-bold text-foreground">Need Help?</h2>
            <p className="text-muted-foreground">
              Check our documentation or reach out to our community on Discord and Twitter
            </p>
          </section>
        </div>
      </main>
    </div>
  )
}
