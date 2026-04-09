# Starkjar

**Created by Vika Joestar for the Starkzap Developer Bounty Program**

A STRK tipping platform built on Starknet Sepolia. Creators share a public profile link — fans connect their Starknet wallet (Argent X, Braavos) and send on-chain STRK tips in seconds.

Live demo: https://starkjar.netlify.app

---

## What It Does

Starkjar is the Buy Me a Coffee of Starknet. A creator registers their wallet address and gets a public tip page at `/tip/0x...`. Anyone with a Starknet wallet can open that link, connect, pick an amount, and send STRK directly on-chain.

Every tip is a real Starknet transaction — no custodian, no middleman, no redirects. The message field is stored as a Starknet event, permanently on-chain.

---

## Starkzap SDK Integration

This project uses the Starkzap SDK for wallet connectivity and token operations:

1. **Wallet Onboarding**
   Users connect via `@starknet-io/get-starknet`, which presents the native Starknet wallet picker (Argent X, Braavos, Keplr, etc.). The returned wallet account is passed directly into Starkzap-compatible flows.

2. **Token Setup**
   `getPresets` and `Amount.parse` from the Starkzap SDK handle STRK token denomination and address resolution across Sepolia and Mainnet.

3. **Transaction Execution**
   Tips are sent as a multicall — `approve` on the STRK ERC-20 followed by `send_tip` on the deployed Tipping contract. The connected wallet signs and broadcasts the transaction natively.

4. **On-chain Tipping Contract**
   A custom Cairo 2.x `Tipping` contract deployed on Starknet Sepolia handles the transfer logic and emits a `TipSent` event with the message.
   Contract: `0x7a105e998b5e09b6a40b15a32bc1fc591f5748025d355e042259d659ab3c418`

---

## Project Structure

```
src/
  app/
    (main)/
      page.tsx                  Landing page
      layout.tsx                Shared layout with navbar
      dashboard/page.tsx        Creator dashboard (tips table, balance, link)
      tip/[address]/page.tsx    Public creator tip page
    api/
      creator/                  Creator profile CRUD (name, handle, bio)
      tips/                     Tip recording and retrieval
      paymaster/                AVNU Paymaster proxy (API key stays server-side)
      wallet/starknet/          Wallet resolution endpoint
      wallet/sign/              Server-side signing endpoint
  components/
    providers/
      WalletProvider.tsx        Global wallet state via get-starknet
    landing/                    Hero, How It Works, Tech Spec, CTA sections
    dashboard/                  Creator setup modal
    tip/                        TipForm, SuccessOverlay, TipPageClient
    layout/                     Navbar
  lib/
    constants.ts                Starknet addresses, short address helper
    db.ts                       In-memory store (replace with DB in production)

contracts/
  src/lib.cairo                 Cairo tipping contract (send_tip, TipSent event)
  Scarb.toml                    Cairo project manifest
```

---

## Quick Start

```bash
cp .env.example .env.local
npm install
npm run dev
```

Open http://localhost:3000

Required environment variables (`.env.local`):

```
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_TIPPING_CONTRACT_ADDRESS=0x7a105e998b5e09b6a40b15a32bc1fc591f5748025d355e042259d659ab3c418

# Optional — only needed if using AVNU Paymaster proxy route
AVNU_PAYMASTER_API_KEY=
```

No Privy account required. Wallet connection is handled entirely client-side via `@starknet-io/get-starknet`.

---

## Cairo Contract

The `Tipping` contract is deployed and verified on Starknet Sepolia:

- **Address**: `0x7a105e998b5e09b6a40b15a32bc1fc591f5748025d355e042259d659ab3c418`
- **Voyager**: https://sepolia.voyager.online/contract/0x7a105e998b5e09b6a40b15a32bc1fc591f5748025d355e042259d659ab3c418

For deployment instructions see `DEPLOYMENT.md`.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 15, React 19, TypeScript |
| Styling | Tailwind CSS, vanilla CSS custom properties |
| Fonts | Space Grotesk + Space Mono (Google Fonts) |
| Wallet | `@starknet-io/get-starknet` v4 |
| Starknet SDK | `starkzap` v2, `starknet.js` v6 |
| Smart Contract | Cairo 2.x on Starknet Sepolia |
| Deployment | Netlify (Next.js SSR plugin) |

---

## Bounty Requirements Met

- **Meaningful Starkzap Integration**: `getPresets`, `Amount.parse`, wallet-compatible account interface
- **Real On-chain UX**: Native wallet picker (Argent/Braavos), STRK multicall tip, on-chain message event
- **Deployed Contract**: Tipping contract live on Starknet Sepolia, verifiable on Voyager
- **Genuine Usefulness**: Creator monetization solving a real problem in the Starknet ecosystem
