import { IS_DEVNET, SOLANA_NETWORK } from "../config/commerce";

/**
 * Small badge showing the current Solana network.
 * Only visually prominent on devnet to warn developers.
 */
export function NetworkBadge() {
  if (!IS_DEVNET) return null;

  return (
    <div className="fixed top-3 right-3 z-50">
      <span className="inline-flex items-center gap-1.5 rounded-full border border-yellow-500/30 bg-yellow-500/10 px-3 py-1 text-xs font-medium text-yellow-400">
        <span className="h-1.5 w-1.5 rounded-full bg-yellow-400 animate-pulse" />
        {SOLANA_NETWORK}
      </span>
    </div>
  );
}
