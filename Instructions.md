# The Vault - Decentralized Digital Asset Management

A modern, decentralized digital asset management platform combining React.js, Solana blockchain, and IPFS. Register digital assets, upload files to IPFS, and store immutable metadata on Solana using Rust smart contracts.

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Environment Setup](#environment-setup)
- [Smart Contract Deployment](#smart-contract-deployment)
- [Running the Application](#running-the-application)
- [Project Structure](#project-structure)
- [Usage Guide](#usage-guide)
- [Security](#security)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)

## Features

- **Wallet Authentication** - Connect your Solana wallet (Phantom, Solflare, etc.)
- **File Upload to IPFS** - Upload any file type with automatic CID generation
- **On-Chain Metadata** - Store asset information immutably on Solana blockchain
- **User-Specific Assets** - Only see and manage your own uploaded files
- **Dashboard** - View, search, filter, and manage all your registered assets
- **Dynamic Previews** - Support for images, PDFs, and document previews
- **Secure Access Control** - Only asset owners can modify or delete their files
- **Responsive Design** - Works seamlessly on desktop, tablet, and mobile
- **Real-Time Updates** - Dashboard syncs with blockchain changes automatically

## Tech Stack

### Frontend
- **React 19** - Modern React with latest hooks
- **Next.js 16** - App Router for server and client components
- **TypeScript** - Full type safety
- **TailwindCSS v4** - Utility-first styling
- **Shadcn/UI** - High-quality, accessible components
- **Lucide Icons** - Beautiful icon library

### Blockchain & Storage
- **Solana Web3.js** - Blockchain interactions
- **Anchor Framework** - Rust smart contract development
- **IPFS** - Decentralized file storage (Pinata or Web3.Storage)
- **Phantom Wallet** - Wallet signing and transactions

### Development
- **ESLint** - Code quality and linting
- **Mocha** - Smart contract testing

## Prerequisites

Before you begin, ensure you have the following:

- **Node.js 18+** - [Download](https://nodejs.org/)
- **npm** or **yarn** - Package manager
- **Git** - Version control
- **Phantom Wallet** - [Browser extension](https://phantom.app/)
- **Solana Devnet SOL** - [Get free SOL here](https://faucet.solana.com/) (for testing)
- **IPFS Service Account** - Either [Web3.Storage](https://web3.storage) or [Pinata](https://pinata.cloud)

### Phantom Wallet Setup

1. Install Phantom Wallet extension
2. Create a new wallet or import existing
3. Switch network to **Devnet** (bottom left dropdown)
4. Optionally request airdrop: [Solana Faucet](https://faucet.solana.com/)

## Installation

### Step 1: Clone the Repository

```bash
git clone https://github.com/babanla123/the-vault.git
cd the-vault
```

### Step 2: Install Dependencies

```bash
npm install
# or
yarn install
```

### Step 3: Verify Installation

```bash
npm run type-check
```

## Environment Setup

### Step 1: Create Environment File

```bash
# Copy the example file
cp .env.example .env.local
```

### Step 2: Configure IPFS Provider

Choose **ONE** of the following options:

#### Option A: Web3.Storage (Recommended - Easiest)

1. Visit [web3.storage](https://web3.storage)
2. Click "Sign in with email"
3. Verify your email
4. Go to Settings → API Tokens
5. Click "Create an API token"
6. Copy the token
7. Add to `.env.local`:

```env
NEXT_PUBLIC_WEB3_STORAGE_TOKEN=your_token_here
```

#### Option B: Pinata

1. Visit [pinata.cloud](https://pinata.cloud)
2. Create an account
3. Go to API Keys section
4. Create new API key
5. Copy your API Key and Secret
6. Add to `.env.local`:

```env
NEXT_PUBLIC_PINATA_API_KEY=your_key_here
NEXT_PUBLIC_PINATA_API_SECRET=your_secret_here
```

### Step 3: Configure Solana Network

Update `.env.local` with:

```env
NEXT_PUBLIC_SOLANA_NETWORK=devnet
NEXT_PUBLIC_RPC_ENDPOINT=https://api.devnet.solana.com
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Step 4: Deploy Smart Contract (Next Section)

After deploying the contract, add:

```env
NEXT_PUBLIC_VAULT_PROGRAM_ID=your_program_id_here
```

## Smart Contract Deployment

### Prerequisites for Smart Contract

- **Rust** - [Install Rust](https://www.rust-lang.org/tools/install)
- **Anchor** - Solana framework for Rust
- **Solana CLI** - Command line tools

### Option 1: Deploy on Solana Playground (Easiest - 5 minutes)

1. Go to [Solana Playground](https://beta.solpg.io/)
2. Create new Anchor project
3. Copy code from \`contract/programs/the_vault/src/lib.rs\`
4. Replace default \`lib.rs\` in Playground
5. Click **Build** button
6. Click **Deploy** button → Select "Devnet"
7. Copy the **Program ID** from the deployment output
8. Export the **IDL JSON** and save to \`idl/the_vault.json\`
9. Add Program ID to \`.env.local\`

### Option 2: Deploy Locally (For Advanced Users)

#### Install Anchor

```bash
cargo install --git https://github.com/coral-xyz/anchor avm --locked --force
avm install latest
avm use latest
```

#### Setup Local Environment

```bash
# Configure Solana CLI
solana config set --url https://api.devnet.solana.com

# Generate keypair (if needed)
solana-keygen new

# Check balance
solana balance
```

#### Deploy Contract

```bash
cd contract

# Build
anchor build

# Deploy to Devnet
anchor deploy --provider.cluster devnet

# Run tests
anchor test --provider.cluster devnet
```

#### Extract Program ID

```bash
# Find Program ID in:
# 1. Output of 'anchor deploy'
# 2. contract/Anchor.toml [provider]
# 3. contract/target/idl/the_vault.json

# Copy Program ID to .env.local
NEXT_PUBLIC_VAULT_PROGRAM_ID=YOUR_PROGRAM_ID
```

## Running the Application

### Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build

```bash
npm run build
npm start
```

### Type Checking

```bash
npm run type-check
```

### Linting

```bash
npm run lint
```

## Project Structure

```
the-vault/
├── app/
│   ├── page.tsx                 # Home page
│   ├── about/page.tsx           # About The Vault
│   ├── docs/page.tsx            # Documentation
│   ├── account/page.tsx         # User profile (protected)
│   ├── layout.tsx               # Root layout
│   ├── globals.css              # Global styles
│   └── api/
│       └── upload/route.ts      # File upload endpoint
│
├── components/
│   ├── header.tsx               # App header/navigation
│   ├── wallet-connect.tsx       # Wallet connection UI
│   ├── asset-upload-form.tsx    # File upload form
│   ├── dashboard.tsx            # Asset management view
│   ├── asset-card.tsx           # Individual asset display
│   ├── protected-route.tsx      # Route protection wrapper
│   └── ui/                      # Shadcn/UI components
│
├── context/
│   ├── auth-context.tsx         # Authentication state
│   └── wallet-context.tsx       # Wallet state management
│
├── services/
│   ├── solana.ts                # Blockchain interactions & Anchor client
│   └── ipfs.ts                  # IPFS upload & file operations
│
├── lib/
│   └── utils.ts                 # Utility functions
│
├── idl/
│   └── the_vault.json           # Smart contract IDL (generated)
│
├── contract/
│   ├── programs/
│   │   └── the_vault/
│   │       ├── src/lib.rs       # Smart contract code
│   │       └── Cargo.toml       # Rust dependencies
│   ├── tests/
│   │   └── the_vault.ts         # Contract tests
│   ├── Anchor.toml              # Anchor configuration
│   └── package.json             # Contract dependencies
│
├── middleware.ts                # Route protection
├── .env.example                 # Environment template
├── .env.local                   # Your environment (git ignored)
├── README.md                    # This file
├── package.json                 # Dependencies
├── tsconfig.json                # TypeScript config
├── next.config.mjs              # Next.js config
└── tailwind.config.ts           # Tailwind CSS config
```

## Usage Guide

### 1. Connect Wallet

- Click "Connect Phantom Wallet" button on home page
- Approve connection in Phantom popup
- You'll be redirected to dashboard

### 2. Upload a File

- Click "+ Upload Asset" button
- Fill in asset details:
  - **Asset Name** - Display name for your file
  - **Description** - What your asset is about
  - **File** - Select file to upload (any type supported)
- Click "Upload & Register"
- Wait for IPFS upload and blockchain confirmation
- Asset appears in dashboard once confirmed

### 3. View Your Assets

- Dashboard shows all your uploaded assets
- Each asset card displays:
  - Asset preview (if image/PDF)
  - Name and description
  - File size and type
  - IPFS CID (click to view on gateway)
  - Upload date
- Search by name or filter by type

### 4. Manage Assets

- **Copy CID** - Copy IPFS content identifier to clipboard
- **View on IPFS** - Open file in IPFS gateway
- **Delete** - Remove asset (only for assets you own)

### 5. View Your Profile

- Click your wallet address in header
- See full wallet address and user ID
- Copy wallet for sharing
- Logout when done

## Security

### Authentication

- Wallet-based authentication (no passwords)
- Session stored in localStorage and cookies
- Automatic logout on browser close
- Protected routes redirect unauthenticated users

### File Management

- Only owners can upload/delete their assets
- File content stored on IPFS (decentralized)
- Metadata stored on Solana blockchain (immutable)
- Private key never leaves your wallet

### Smart Contract Security

- Program Derived Addresses (PDAs) ensure deterministic accounts
- Owner verification on all sensitive operations
- Input validation for all metadata
- Proper error handling and constraints

### Best Practices

1. **Never share your seed phrase**
2. **Keep your wallet secure**
3. **Verify Phantom requests before signing**
4. **Use Devnet first before Mainnet**
5. **Back up your wallet recovery phrase**

## Troubleshooting

### Issue: "Wallet not found"

**Solution:**
- Install [Phantom Wallet](https://phantom.app/)
- Refresh the page
- Make sure Phantom is enabled in browser extensions

### Issue: "Insufficient SOL balance"

**Solution:**
- Go to [Solana Faucet](https://faucet.solana.com/)
- Enter your Devnet wallet address
- Request airdrop (2 SOL)
- Wait 30 seconds and try again

### Issue: "Upload failed - JSON parse error"

**Solution:**
- Verify IPFS credentials in `.env.local`
- Check that NEXT_PUBLIC_WEB3_STORAGE_TOKEN or PINATA keys are correct
- Restart development server: \`npm run dev\`

### Issue: "Program ID not found"

**Solution:**
- Deploy contract using Solana Playground or local Anchor
- Copy Program ID from deployment output
- Add to \`.env.local\`: \`NEXT_PUBLIC_VAULT_PROGRAM_ID=...\`
- Restart development server

### Issue: "Can't connect to Devnet"

**Solution:**
- Check internet connection
- Verify RPC endpoint in `.env.local`
- Try alternative RPC: \`https://api.devnet.solana.com\`
- Check [Solana Status](https://status.solana.com/)

### Issue: "File upload too large"

**Solution:**
- Web3.Storage limit: 5GB per file
- Pinata free tier: 1GB per file
- Split large files or upgrade plan

### Issue: "Transaction failed/timeout"

**Solution:**
- Network might be congested
- Try again in a few moments
- Check transaction on [Solana Explorer](https://explorer.solana.com/?cluster=devnet)

## API Reference

### Services

#### IPFS Service (`services/ipfs.ts`)

```typescript
// Upload file to IPFS
await uploadToIPFS(file: File): Promise<string>
// Returns: IPFS CID

// Get IPFS gateway URL
getIPFSGatewayUrl(cid: string): string
// Returns: Full IPFS gateway URL
```

#### Solana Service (`services/solana.ts`)

```typescript
// Connect to wallet
await connectWallet(): Promise<string>
// Returns: Wallet address

// Register asset on blockchain
await registerAssetOnChain(
  metadata: AssetMetadata,
  walletAddress: string
): Promise<string>
// Returns: Transaction signature

// Fetch all assets for user
await getAssetsFromChain(walletAddress: string): Promise<AssetRecord[]>
// Returns: Array of user's assets

// Delete asset from blockchain
await deleteAssetFromChain(
  cid: string,
  walletAddress: string
): Promise<string>
// Returns: Transaction signature
```

### Smart Contract Instructions

#### register_asset

Registers a new digital asset on-chain.

**Accounts:**
- payer (signer) - User's wallet
- asset_registry (mut) - User's asset registry PDA
- system_program - System program

**Parameters:**
- cid: String - IPFS content identifier
- name: String - Asset name
- description: String - Asset description
- file_type: String - File type (e.g., "image/png")
- file_size: u64 - File size in bytes

#### delete_asset

Deletes an asset owned by the user.

**Accounts:**
- owner (signer) - Asset owner
- asset_registry (mut) - User's registry PDA
- system_program - System program

**Parameters:**
- cid: String - IPFS CID to delete

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (\`git checkout -b feature/amazing-feature\`)
3. Commit changes (\`git commit -m 'Add amazing feature'\`)
4. Push to branch (\`git push origin feature/amazing-feature\`)
5. Open Pull Request

## License

This project is licensed under the MIT License - see LICENSE file for details.

## Support

For issues and questions:

1. Check [Troubleshooting](#troubleshooting) section
2. Search [GitHub Issues](https://github.com/babanla123/the-vault/issues)
3. Create a new issue with:
   - Clear description
   - Steps to reproduce
   - Environment details
   - Error messages/screenshots

## Roadmap

- [ ] Mainnet deployment
- [ ] Mobile app
- [ ] NFT integration
- [ ] Advanced search and filters
- [ ] Bulk operations
- [ ] Collaboration features
- [ ] Content encryption

## Acknowledgments

- [Solana](https://solana.com/) - Blockchain network
- [Anchor](https://coral.xyz/) - Smart contract framework
- [IPFS](https://ipfs.io/) - Decentralized storage
- [Phantom Wallet](https://phantom.app/) - Wallet integration
- [Shadcn/UI](https://ui.shadcn.com/) - UI components
- [Next.js](https://nextjs.org/) - React framework
