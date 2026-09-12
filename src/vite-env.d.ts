/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Solana wallet address (public key) to receive donations */
  readonly VITE_MERCHANT_WALLET: string;
  /** Solana network: "mainnet" or "devnet" */
  readonly VITE_SOLANA_NETWORK?: string;
  /** Optional custom RPC endpoint URL */
  readonly VITE_RPC_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
