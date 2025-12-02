// hooks/useVault.ts
import * as anchor from "@project-serum/anchor";
import { useCallback, useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { SystemProgram, PublicKey } from "@solana/web3.js";
import { useAnchorWallet, useConnection, useWallet } from "@solana/wallet-adapter-react";
import idl from "@/idl/the_vault.json";

const PROGRAM_ID = new PublicKey("CArUiBgaHH6ooWBw9UNbcZNicenByQeS7yvdswZjKzXx");

export type Asset = {
  publicKey: PublicKey;
  index: number;
  cid: string;
  name: string;
  description: string;
  fileType: string;
  fileSize: number;
  timestamp: number;
};

export function useVault() {
  const { connection } = useConnection();
  const { publicKey } = useWallet();
  const anchorWallet = useAnchorWallet();

  const [assets, setAssets] = useState<Asset[]>([]);
  const [globalInitialized, setGlobalInitialized] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);
  const [transactionPending, setTransactionPending] = useState(false);

  const program = useMemo(() => {
    if (!anchorWallet) return null;
    const provider = new anchor.AnchorProvider(connection, anchorWallet, {
      commitment: "confirmed",
    });
    return new anchor.Program(idl as anchor.Idl, PROGRAM_ID, provider);
  }, [connection, anchorWallet]);

  // PDAs
  const [globalCounterPda] = anchor.utils.publicKey.findProgramAddressSync(
    [Buffer.from("global_registry")],
    PROGRAM_ID
  );

  const getAssetPda = (owner: PublicKey, index: number) => {
    return anchor.utils.publicKey.findProgramAddressSync(
      [
        Buffer.from("asset"),
        owner.toBuffer(),
        Buffer.from(new Uint32Array([index]).buffer), // proper little-endian u32
      ],
      PROGRAM_ID
    );
  };

  // Check if global counter exists + load all user assets
  const fetchAssets = useCallback(async () => {
    if (!program || !publicKey) {
      setAssets([]);
      setGlobalInitialized(null);
      setLoading(false);
      return;
    }

    setLoading(true);

    try {
      // Check if global counter exists
      let isInitialized = true;
      try {
        await program.account.counterRegistry.fetch(globalCounterPda);
      } catch {
        isInitialized = false;
      }
      setGlobalInitialized(isInitialized);

      if (!isInitialized) {
        setAssets([]);
        return;
      }

      // Fetch counter to know total assets ever created
      const counter = await program.account.counterRegistry.fetch(globalCounterPda);
      const totalAssets = counter.count;

      const userAssets: Asset[] = [];

      // Scan all possible indices
      for (let i = 0; i < totalAssets; i++) {
        const [assetPda] = getAssetPda(publicKey, i);
        try {
          const acc = await program.account.assetRecord.fetch(assetPda);
          if (acc.owner.equals(publicKey)) {
            userAssets.push({
              publicKey: assetPda,
              index: acc.index,
              cid: acc.cid,
              name: acc.name,
              description: acc.description,
              fileType: acc.fileType,
              fileSize: Number(acc.fileSize),
              timestamp: Number(acc.timestamp),
            });
          }
        } catch {
          // skip missing or foreign assets
        }
      }

      setAssets(userAssets.sort((a, b) => a.index - b.index));
    } catch (err) {
      console.error("Failed to load vault:", err);
      toast.error("Failed to load your assets");
    } finally {
      setLoading(false);
    }
  }, [program, publicKey]);

  useEffect(() => {
    fetchAssets();
  }, [fetchAssets]);

  // Auto-initialize global vault in development ONLY
useEffect(() => {
  if (!program || !publicKey || globalInitialized !== false) return

  const isDev = process.env.NODE_ENV === "development"

  if (isDev) {
    // Auto-init in dev if not already done
    (async () => {
      try {
        await program.account.counterRegistry.fetch(globalCounterPda)
      } catch {
        toast.loading("Initializing vault for dev...", { id: "init" })
        try {
          await program.methods
            .initializeCounter()
            .accounts({
              signer: publicKey,
              counterRegistry: globalCounterPda,
              systemProgram: SystemProgram.programId,
            })
            .rpc()
          toast.success("Vault auto-initialized (dev mode)", { id: "init" })
          setGlobalInitialized(true)
          await fetchAssets()
        } catch (err) {
          toast.error("Auto-init failed. Click Initialize manually.", { id: "init" })
        }
      }
    })()
  }
}, [program, publicKey, globalInitialized, fetchAssets])

  // One-time global initialization
  const initializeVault = useCallback(async () => {
    if (!program || !publicKey) return;
    setTransactionPending(true);
    try {
      const tx = await program.methods
        .initializeCounter()
        .accounts({
          signer: publicKey,
          counterRegistry: globalCounterPda,
          systemProgram: SystemProgram.programId,
        })
        .rpc();

      toast.success("Vault initialized globally!");
      setGlobalInitialized(true);
      await fetchAssets();
      return tx;
    } catch (err: any) {
      toast.error(err?.message || "Failed to initialize vault");
      throw err;
    } finally {
      setTransactionPending(false);
    }
  }, [program, publicKey, fetchAssets]);

  // Register new asset
  const registerAsset = useCallback(
    async (data: {
      cid: string;
      name: string;
      description: string;
      fileType: string;
      fileSize: number;
    }) => {
      if (!program || !publicKey) return;

      setTransactionPending(true);
      try {
        const counter = await program.account.counterRegistry.fetch(globalCounterPda);
        const nextIndex = counter.count;
        const [assetPda] = getAssetPda(publicKey, nextIndex);

        const tx = await program.methods
          .registerAsset(
            data.cid,
            data.name,
            data.description,
            data.fileType,
            new anchor.BN(data.fileSize)
          )
          .accounts({
            owner: publicKey,
            counterRegistry: globalCounterPda,
            assetRecord: assetPda,
            systemProgram: SystemProgram.programId,
          })
          .rpc();

        toast.success(`Asset #${nextIndex} saved to vault!`);
        await fetchAssets();
        return tx;
      } catch (err: any) {
        const msg = getErrorMessage(err);
        toast.error(msg);
        throw err;
      } finally {
        setTransactionPending(false);
      }
    },
    [program, publicKey, fetchAssets]
  );

  // Delete asset
  const deleteAsset = useCallback(
    async (index: number) => {
      if (!program || !publicKey) return;

      setTransactionPending(true);
      try {
        const [assetPda] = getAssetPda(publicKey, index);

        const tx = await program.methods
          .deleteAsset(index)
          .accounts({
            owner: publicKey,
            assetRecord: assetPda,
          })
          .rpc();

        toast.success(`Asset #${index} deleted`);
        await fetchAssets();
        return tx;
      } catch (err: any) {
        toast.error(getErrorMessage(err));
        throw err;
      } finally {
        setTransactionPending(false);
      }
    },
    [program, publicKey, fetchAssets]
  );

  return {
    // State
    assets,
    globalInitialized,    // null = loading, false = not init, true = ready
    loading,
    transactionPending,

    // Actions
    initializeVault,
    registerAsset,
    deleteAsset,
    refetch: fetchAssets,
  };
}

// Helper: nicer error messages
function getErrorMessage(err: any): string {
  if (!err?.logs) return "Transaction failed";

  const log = err.logs?.find((l: string) => l.includes("custom program error"));
  if (!log) return "Transaction failed";

  const code = parseInt(log.split("0x").pop() || "0", 16);
  switch (code) {
    case 6000: return "Invalid CID (check length/format)";
    case 6001: return "Invalid name (too long or empty)";
    case 6002: return "Description too long";
    case 6003: return "Invalid file type";
    case 6005: return "You don't own this asset";
    default: return `Error ${code}`;
  }
}