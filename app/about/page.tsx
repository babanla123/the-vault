import Header from "@/components/header"
import Link from "next/link"

export const metadata = {
  title: "About The Vault",
  description: "Learn about The Vault decentralized digital asset management platform",
}

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto space-y-12">
          {/* Hero Section */}
          <div className="text-center space-y-4">
            <h1 className="text-5xl font-bold text-foreground">About The Vault</h1>
            <p className="text-xl text-muted-foreground">
              Secure, decentralized digital asset management powered by Solana and IPFS
            </p>
          </div>

          {/* Mission Section */}
          <section className="space-y-6">
            <h2 className="text-3xl font-bold text-foreground">Our Mission</h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              The Vault empowers individuals and organizations to maintain complete ownership and control over their
              digital assets. By combining blockchain immutability with decentralized storage, we provide a platform
              that ensures your files are secure, accessible, and permanently addressable.
            </p>
          </section>

          {/* Core Features */}
          <section className="space-y-6">
            <h2 className="text-3xl font-bold text-foreground">Core Features</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-card border border-border rounded-lg p-6 space-y-3">
                <h3 className="text-xl font-semibold text-foreground">Decentralized Storage</h3>
                <p className="text-muted-foreground">
                  Files are stored on IPFS with unique content identifiers (CIDs), ensuring no single point of failure.
                </p>
              </div>
              <div className="bg-card border border-border rounded-lg p-6 space-y-3">
                <h3 className="text-xl font-semibold text-foreground">Blockchain Metadata</h3>
                <p className="text-muted-foreground">
                  Asset metadata is recorded immutably on Solana, creating an unalterable record of ownership.
                </p>
              </div>
              <div className="bg-card border border-border rounded-lg p-6 space-y-3">
                <h3 className="text-xl font-semibold text-foreground">True Ownership</h3>
                <p className="text-muted-foreground">
                  Your Solana wallet is your key. No middleman, no KYC required. Complete control is yours.
                </p>
              </div>
              <div className="bg-card border border-border rounded-lg p-6 space-y-3">
                <h3 className="text-xl font-semibold text-foreground">Permanent Access</h3>
                <p className="text-muted-foreground">
                  Content addressed by CID means your files are permanently retrievable as long as IPFS exists.
                </p>
              </div>
            </div>
          </section>

          {/* Technology Stack */}
          <section className="space-y-6">
            <h2 className="text-3xl font-bold text-foreground">Technology Stack</h2>
            <div className="bg-card border border-border rounded-lg p-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold text-primary">Blockchain</h3>
                  <p className="text-muted-foreground">Solana - Fast, scalable, and energy-efficient</p>
                </div>
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold text-primary">Storage</h3>
                  <p className="text-muted-foreground">IPFS - Decentralized and content-addressed</p>
                </div>
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold text-primary">Frontend</h3>
                  <p className="text-muted-foreground">React + Next.js - Modern and performant</p>
                </div>
              </div>
            </div>
          </section>

          {/* Call to Action */}
          <section className="text-center space-y-6 py-12">
            <h2 className="text-3xl font-bold text-foreground">Ready to Vault Your Assets?</h2>
            <p className="text-lg text-muted-foreground">
              Start securing your digital files today with Solana and IPFS
            </p>
            <Link
              href="/"
              className="inline-block px-8 py-4 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-colors"
            >
              Get Started
            </Link>
          </section>
        </div>
      </main>
    </div>
  )
}
