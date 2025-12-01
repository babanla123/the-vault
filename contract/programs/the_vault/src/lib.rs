use anchor_lang::prelude::*;
use std::str::FromStr;

declare_id!("11111111111111111111111111111111");

#[program]
pub mod the_vault {
    use super::*;

    /// Register a new asset for the user
    pub fn register_asset(
        ctx: Context<RegisterAsset>,
        cid: String,
        name: String,
        description: String,
        file_type: String,
        file_size: u64,
    ) -> Result<()> {
        require!(cid.len() > 0 && cid.len() <= 100, VaultError::InvalidCID);
        require!(name.len() > 0 && name.len() <= 100, VaultError::InvalidName);
        require!(
            description.len() <= 500,
            VaultError::InvalidDescription
        );
        require!(file_type.len() > 0 && file_type.len() <= 50, VaultError::InvalidFileType);

        let registry = &mut ctx.accounts.registry;
        let clock = Clock::get()?;

        let asset = AssetRecord {
            cid,
            name,
            description,
            file_type,
            file_size,
            owner: ctx.accounts.owner.key(),
            timestamp: clock.unix_timestamp,
            bump: ctx.bumps.registry,
        };

        registry.assets.push(asset);
        registry.owner = ctx.accounts.owner.key();
        registry.asset_count += 1;

        Ok(())
    }

    /// Delete an asset owned by the user
    pub fn delete_asset(ctx: Context<DeleteAsset>, cid: String) -> Result<()> {
        let registry = &mut ctx.accounts.registry;

        let initial_len = registry.assets.len();
        registry.assets.retain(|asset| asset.cid != cid);

        require!(
            registry.assets.len() < initial_len,
            VaultError::AssetNotFound
        );

        Ok(())
    }
}

#[derive(Accounts)]
#[instruction(cid: String)]
pub struct RegisterAsset<'info> {
    #[account(mut)]
    pub owner: Signer<'info>,

    #[account(
        init_if_needed,
        payer = owner,
        space = 8 + 32 + 4 + (300 * 350) + 1,
        seeds = [b"asset_registry", owner.key().as_ref()],
        bump
    )]
    pub registry: Account<'info, AssetRegistry>,

    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
#[instruction(cid: String)]
pub struct DeleteAsset<'info> {
    #[account(mut)]
    pub owner: Signer<'info>,

    #[account(
        mut,
        seeds = [b"asset_registry", owner.key().as_ref()],
        bump = registry.bump,
        has_one = owner
    )]
    pub registry: Account<'info, AssetRegistry>,
}

#[account]
pub struct AssetRegistry {
    pub owner: Pubkey,
    pub assets: Vec<AssetRecord>,
    pub asset_count: u32,
    pub bump: u8,
}

#[derive(Clone, Debug, AnchorSerialize, AnchorDeserialize)]
pub struct AssetRecord {
    pub cid: String,
    pub name: String,
    pub description: String,
    pub file_type: String,
    pub file_size: u64,
    pub owner: Pubkey,
    pub timestamp: i64,
    pub bump: u8,
}

#[error_code]
pub enum VaultError {
    #[msg("Invalid CID format")]
    InvalidCID,
    #[msg("Invalid asset name")]
    InvalidName,
    #[msg("Invalid description")]
    InvalidDescription,
    #[msg("Invalid file type")]
    InvalidFileType,
    #[msg("Asset not found")]
    AssetNotFound,
    #[msg("Unauthorized: Only asset owner can perform this action")]
    Unauthorized,
}
