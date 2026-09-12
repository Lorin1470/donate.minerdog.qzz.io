import { useState, useCallback, useEffect } from "react";
import { PaymentButton } from "@solana-commerce/kit";
import { getCommerceConfig, isValidSolanaAddress } from "../config/commerce";
import { ThankYouModal } from "./ThankYouModal";

/**
 * Main donation section using the official Solana Commerce Kit PaymentButton.
 *
 * The PaymentButton handles ALL payment logic internally:
 * - Wallet connection (Wallet Standard)
 * - Token selection UI (SOL, USDC, USDT)
 * - Amount input (tip mode)
 * - Transaction construction & signing
 * - On-chain confirmation
 * - QR Code generation (Solana Pay)
 * - Error handling UI
 *
 * We ONLY provide config and callbacks. We do NOT rewrite any of this.
 */
export function DonateSection() {
  const [successSignature, setSuccessSignature] = useState<string | null>(null);
  const config = getCommerceConfig();
  const hasValidWallet = isValidSolanaAddress(config.merchant.wallet);

  const handleSuccess = useCallback((signature: string) => {
    console.log("[Donate] Payment confirmed:", signature);
    setSuccessSignature(signature);
  }, []);

  const handlePayment = useCallback((amount: number, currency: string) => {
    console.log("[Donate] Payment event received:", { amount, currency });
  }, []);

  const handleError = useCallback((error: unknown) => {
    console.error("[Donate] Payment failed:", error);
  }, []);

  const handleStart = useCallback(() => {
    console.log("[Donate] Payment flow started");
  }, []);

  const handleCancel = useCallback(() => {
    console.log("[Donate] Payment cancelled by user");
  }, []);

  // Listen to Commerce Kit completion to capture transaction signature
  useEffect(() => {
    const origLog = console.log;
    console.log = function (...args: unknown[]) {
      if (args[0] === "[SecureIframeShell] Payment successful:" && args[1]) {
        const sig = String(args[1]);
        console.info("[Donate] Captured real signature from Commerce Kit:", sig);
        setSuccessSignature(sig);
      }
      return origLog.apply(console, args);
    };

    const handleMessage = (event: MessageEvent) => {
      const data = event.data;
      if (data && typeof data === "object" && data.type === "paymentSuccess" && data.signature) {
        console.log("[Donate] Captured signature from window postMessage:", data.signature);
        setSuccessSignature(String(data.signature));
      }
    };

    window.addEventListener("message", handleMessage);
    return () => {
      console.log = origLog;
      window.removeEventListener("message", handleMessage);
    };
  }, []);

  return (
    <section className="flex flex-1 items-center justify-center px-4 py-16 sm:py-24">
      <div className="donate-glow w-full max-w-lg">
        {/* Content card */}
        <div className="relative z-10 rounded-2xl border border-border-subtle bg-bg-card/80 p-8 text-center backdrop-blur-sm sm:p-10">
          {/* Icon */}
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-solana-purple/20 to-solana-green/20 text-4xl">
            💜
          </div>

          {/* Heading */}
          <h1 className="mb-3 text-3xl font-bold tracking-tight sm:text-4xl">
            <span className="solana-gradient-text">Support MinerDog</span>
          </h1>

          {/* Description */}
          <p className="mb-8 text-sm leading-relaxed text-text-secondary sm:text-base">
            Your donation helps keep MinerDog running.
            <br />
            Choose your amount and pay with{" "}
            <span className="font-medium text-text-primary">SOL</span>,{" "}
            <span className="font-medium text-text-primary">USDC</span>, or{" "}
            <span className="font-medium text-text-primary">USDT</span>.
          </p>

          {/* === Official Solana Commerce Kit PaymentButton === */}
          {hasValidWallet ? (
            <div className="flex justify-center">
              <PaymentButton
                config={config}
                onPaymentStart={handleStart}
                onPayment={handlePayment}
                onPaymentSuccess={handleSuccess}
                onPaymentError={handleError}
                onCancel={handleCancel}
              />
            </div>
          ) : (
            <div className="rounded-xl border border-yellow-500/30 bg-yellow-500/10 p-5 text-left text-sm text-yellow-300">
              <div className="flex items-center gap-2 font-semibold text-yellow-400 mb-2">
                <span>⚠️</span>
                <span>Wallet address not configured</span>
              </div>
              <p className="text-xs text-yellow-300/80 mb-3 leading-relaxed">
                Please configure your Solana public key in <code className="rounded bg-yellow-500/20 px-1 py-0.5 text-[11px] text-yellow-200">.env</code>:
              </p>
              <pre className="overflow-x-auto rounded-lg bg-black/40 p-2.5 font-mono text-xs text-yellow-200">
                VITE_MERCHANT_WALLET=YourSolanaPublicKeyHere
              </pre>
            </div>
          )}

          {/* Features */}
          <div className="mt-8 grid grid-cols-3 gap-4 border-t border-border-subtle pt-6">
            {[
              { icon: "⚡", label: "Instant" },
              { icon: "💸", label: "Low Fees" },
              { icon: "🔒", label: "On-Chain" },
            ].map(({ icon, label }) => (
              <div key={label} className="text-center">
                <div className="text-lg">{icon}</div>
                <div className="mt-1 text-xs text-text-tertiary">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Thank you modal */}
      {successSignature && (
        <ThankYouModal
          signature={successSignature}
          onClose={() => setSuccessSignature(null)}
        />
      )}
    </section>
  );
}
