import * as anchor from "@coral-xyz/anchor"
import type { Program } from "@coral-xyz/anchor"
import type { TheVault } from "../target/types/the_vault"
import * as assert from "assert"
import { describe, before, it } from "mocha"

describe("The Vault", () => {
  const provider = anchor.AnchorProvider.env()
  anchor.setProvider(provider)
  const program = anchor.workspace.TheVault as Program<TheVault>

  let registryPDA: anchor.web3.PublicKey
  let registryBump: number

  before(async () => {
    const [pda, bump] = anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from("asset_registry"), provider.wallet.publicKey.toBuffer()],
      program.programId,
    )
    registryPDA = pda
    registryBump = bump
  })

  it("Registers an asset", async () => {
    const tx = await program.methods
      .registerAsset(
        "QmYwAPJzVeD6bBL2UcVvNZYaK1eivoQKAd8d36niktLiQ",
        "Test Asset",
        "A test asset for The Vault",
        "image/jpeg",
        2048576,
      )
      .accounts({
        owner: provider.wallet.publicKey,
        registry: registryPDA,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .rpc()

    console.log("Asset registered with tx:", tx)

    const registry = await program.account.assetRegistry.fetch(registryPDA)
    assert.strictEqual(registry.assets.length, 1)
    assert.strictEqual(registry.assets[0].name, "Test Asset")
  })

  it("Deletes an asset", async () => {
    const tx = await program.methods
      .deleteAsset("QmYwAPJzVeD6bBL2UcVvNZYaK1eivoQKAd8d36niktLiQ")
      .accounts({
        owner: provider.wallet.publicKey,
        registry: registryPDA,
      })
      .rpc()

    console.log("Asset deleted with tx:", tx)

    const registry = await program.account.assetRegistry.fetch(registryPDA)
    assert.strictEqual(registry.assets.length, 0)
  })
})
