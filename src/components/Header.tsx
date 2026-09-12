/**
 * Site header with MinerDog branding and navigation link.
 */
export function Header() {
  return (
    <header className="w-full border-b border-border-subtle bg-bg-primary/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-3xl items-center justify-between px-4 sm:px-6">
        {/* Brand */}
        <a
          href="https://minerdog.qzz.io"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 text-text-primary no-underline transition-opacity hover:opacity-80"
        >
          <span className="text-xl font-bold tracking-tight">
            🐕 MinerDog
          </span>
        </a>

        {/* Nav */}
        <nav className="flex items-center gap-4">
          <a
            href="https://minerdog.qzz.io"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-text-secondary transition-colors hover:text-text-primary no-underline"
          >
            ← Back to MinerDog
          </a>
        </nav>
      </div>
    </header>
  );
}
