# donate.minerdog.qzz.io

Solana donation page for MinerDog — built with [Commerce Kit](https://solana.com/docs/tools/commerce-kit).

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Copy environment config
cp .env.example .env

# 3. Edit .env — add your Solana wallet address
#    VITE_MERCHANT_WALLET=YourSolanaPublicKeyHere
#    VITE_SOLANA_NETWORK=devnet    # Use devnet for testing

# 4. Start dev server
npm run dev
```

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `VITE_MERCHANT_WALLET` | ✅ | Solana wallet address (public key) to receive donations |
| `VITE_SOLANA_NETWORK` | ❌ | `mainnet` (default) or `devnet` |
| `VITE_RPC_URL` | ❌ | Custom RPC endpoint URL |

## Tech Stack

- **Vite** + **React 19** + **TypeScript**
- **@solana-commerce/kit** — Official Solana Commerce Kit
- **Tailwind CSS v4** — Styling
- **Cloudflare Pages** — Hosting

## Deploy to Cloudflare Pages

### Via Dashboard (recommended)

1. Push this repo to GitHub
2. Cloudflare Dashboard → Workers & Pages → Create → Connect to Git
3. Build command: `npm run build`
4. Output directory: `dist`
5. Set environment variables in Pages settings
6. Add custom domain: `donate.minerdog.qzz.io`

### Via CLI

```bash
npm run build
npx wrangler pages deploy dist --project-name=donate-minerdog
```

## Security

- ✅ Only the **public key** (wallet address) is used — no private keys
- ✅ `.env` is gitignored
- ✅ No secrets in source code
- ❌ NEVER commit private keys, seed phrases, or keypair files

## Testing on Devnet

1. Set `VITE_SOLANA_NETWORK=devnet` in `.env`
2. Get devnet SOL from [faucet.solana.com](https://faucet.solana.com)
3. Switch Phantom wallet to Devnet
4. Test the donation flow

## License

MIT
