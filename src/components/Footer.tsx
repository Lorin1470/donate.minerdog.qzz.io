/**
 * Page footer with Solana branding and links.
 *
 * Uses the official Solana logomark SVG (3 stacked parallelograms)
 * extracted from solana.com/branding — not a custom recreation.
 */
export function Footer() {
  return (
    <footer className="w-full border-t border-border-subtle">
      <div className="mx-auto flex max-w-3xl flex-col items-center gap-4 px-4 py-8 sm:px-6">
        {/* Built on Solana */}
        <div className="flex items-center gap-2 text-text-tertiary">
          <span className="text-xs">Built on</span>
          {/* Official Solana logomark SVG */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 100 100"
            fill="none"
            className="inline-block"
          >
            <path
              fill="url(#solana-footer-grad)"
              d="M86.619 69.036 74.403 82.101a2.837 2.837 0 0 1-2.075.899h-57.91a1.421 1.421 0 0 1-1.3-.85 1.411 1.411 0 0 1 .263-1.53l12.225-13.064a2.837 2.837 0 0 1 2.07-.899h57.906a1.423 1.423 0 0 1 1.3.85 1.412 1.412 0 0 1-.263 1.53ZM74.403 42.727a2.837 2.837 0 0 0-2.075-.898h-57.91a1.421 1.421 0 0 0-1.3.85 1.412 1.412 0 0 0 .263 1.529l12.225 13.065a2.84 2.84 0 0 0 2.07.898h57.906a1.422 1.422 0 0 0 1.3-.85 1.412 1.412 0 0 0-.263-1.529L74.403 42.727Zm-59.985-9.384h57.91a2.844 2.844 0 0 0 2.075-.899l12.216-13.065A1.414 1.414 0 0 0 85.582 17H27.676a2.845 2.845 0 0 0-2.07.899L13.384 30.964a1.412 1.412 0 0 0 1.034 2.379Z"
            />
            <defs>
              <linearGradient
                id="solana-footer-grad"
                x1="19.247"
                x2="79.786"
                y1="84.573"
                y2="16.138"
                gradientUnits="userSpaceOnUse"
              >
                <stop offset=".08" stopColor="#9945FF" />
                <stop offset=".3" stopColor="#8752F3" />
                <stop offset=".5" stopColor="#5497D5" />
                <stop offset=".6" stopColor="#43B4CA" />
                <stop offset=".72" stopColor="#28E0B9" />
                <stop offset=".97" stopColor="#19FB9B" />
              </linearGradient>
            </defs>
          </svg>
          <span className="text-xs font-medium text-text-secondary">
            Solana
          </span>
        </div>

        {/* Links */}
        <div className="flex gap-6 text-xs text-text-tertiary">
          <a
            href="https://minerdog.qzz.io"
            target="_blank"
            rel="noopener noreferrer"
            className="text-text-tertiary no-underline transition-colors hover:text-text-primary"
          >
            MinerDog
          </a>
          <a
            href="https://solana.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-text-tertiary no-underline transition-colors hover:text-text-primary"
          >
            Solana
          </a>
          <a
            href="https://solscan.io"
            target="_blank"
            rel="noopener noreferrer"
            className="text-text-tertiary no-underline transition-colors hover:text-text-primary"
          >
            Solscan
          </a>
        </div>

        <p className="text-[11px] text-text-tertiary">
          © {new Date().getFullYear()} MinerDog。所有贊助均為區塊鏈上交易，無法退款。
        </p>
      </div>
    </footer>
  );
}
