/**
 * Commerce Kit configuration for the MinerDog Donate page.
 *
 * This centralizes all PaymentButton settings so they can be
 * shared across components and easily updated.
 */

/** Solana network to connect to */
export const SOLANA_NETWORK = (import.meta.env.VITE_SOLANA_NETWORK ||
  "mainnet") as "mainnet" | "devnet";

/** Whether we're running on devnet */
export const IS_DEVNET = SOLANA_NETWORK === "devnet";

/**
 * Default public RPC endpoints for Solana networks.
 */
export const DEFAULT_RPC_URLS = {
  mainnet: "https://api.mainnet-beta.solana.com",
  devnet: "https://api.devnet.solana.com",
} as const;

/**
 * Basic check for valid Solana Base58 public key.
 * Solana addresses are base58 strings of length 32-44.
 */
export function isValidSolanaAddress(address?: string): boolean {
  if (!address || typeof address !== "string") return false;
  const trimmed = address.trim();
  if (trimmed === "" || trimmed === "YourSolanaPublicKeyHere") return false;
  // Base58 characters only, 32 to 44 characters
  return /^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(trimmed);
}

/**
 * Commerce Kit PaymentButton config object.
 *
 * @see https://solana.com/docs/tools/commerce-kit
 */
export function getCommerceConfig() {
  const wallet = import.meta.env.VITE_MERCHANT_WALLET?.trim() || "";
  const rpcUrl =
    import.meta.env.VITE_RPC_URL?.trim() ||
    DEFAULT_RPC_URLS[SOLANA_NETWORK] ||
    DEFAULT_RPC_URLS.mainnet;

  if (!wallet) {
    console.warn(
      "[Commerce Config] VITE_MERCHANT_WALLET is not set. " +
        "Copy .env.example to .env and set your wallet address."
    );
  }

  return {
    merchant: {
      name: "MinerDog",
      wallet,
      logo: "/logo.jpg",
    },
    mode: "tip" as const,
    network: SOLANA_NETWORK,
    rpcUrl,
    showQR: true,
    debug: true,
    // Allow default tokens with SOL as default
    allowedMints: ["SOL", "USDC", "USDT"],
  };
}

/**
 * Get a Solscan URL for a given transaction signature.
 */
export function getSolscanUrl(signature: string): string {
  const cluster = IS_DEVNET ? "?cluster=devnet" : "";
  return `https://solscan.io/tx/${signature}${cluster}`;
}
