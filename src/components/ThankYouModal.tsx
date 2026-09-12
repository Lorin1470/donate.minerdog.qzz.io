import { getSolscanUrl } from "../config/commerce";

interface ThankYouModalProps {
  signature: string;
  onClose: () => void;
}

/**
 * Modal displayed after a successful donation.
 * Shows a thank-you message and a link to view the transaction on Solscan.
 */
export function ThankYouModal({ signature, onClose }: ThankYouModalProps) {
  const solscanUrl = getSolscanUrl(signature);
  const shortSig = `${signature.slice(0, 8)}...${signature.slice(-8)}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="mx-4 w-full max-w-md rounded-2xl border border-border-subtle bg-bg-card p-8 text-center shadow-2xl">
        {/* Success icon */}
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-solana-green/10">
          <svg
            className="h-8 w-8 text-solana-green"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>

        {/* Message */}
        <h3 className="mb-2 text-xl font-bold text-text-primary">
          Thank You! 🎉
        </h3>
        <p className="mb-6 text-sm text-text-secondary">
          Your donation has been confirmed on the Solana blockchain.
        </p>

        {/* Transaction link */}
        <a
          href={solscanUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mb-6 inline-flex items-center gap-2 rounded-lg border border-border-subtle bg-bg-secondary px-4 py-2 text-xs font-mono text-solana-green no-underline transition-colors hover:border-solana-green/30 hover:bg-bg-card-hover"
        >
          <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
          {shortSig}
        </a>

        {/* Close button */}
        <div className="mt-6">
          <button
            onClick={onClose}
            className="w-full cursor-pointer rounded-xl bg-gradient-to-r from-solana-purple to-solana-green px-6 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90 border-0"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
