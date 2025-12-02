import { Idl } from "@coral-xyz/anchor"
import idl from "@/idl/the_vault.json"

export type TheVault = Idl & typeof idl

export default idl as TheVault
