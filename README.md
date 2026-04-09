# Starkjar

**Created by Vika Joestar for the Starkzap Developer Bounty Program**

A gasless tipping and donation platform built on Starknet Mainnet. Fans support
creators by sending STRK tokens with zero gas fees, powered by the Starkzap SDK
and AVNU Paymaster.

---

## What It Does

Starkjar is the Buy Me a Coffee of Starknet. A creator shares their profile URL
and fans can send STRK tips directly to their wallet. Gas fees are completely
sponsored through AVNU Paymaster via the Starkzap SDK, making the experience
identical to using any Web2 payment tool.

---

## Starkzap SDK Integration

This project uses the Starkzap SDK at the core of its architecture:

1. Onboarding
   Users sign in with email or Google via Privy. The Starkzap OnboardStrategy.Privy
   flow creates and deploys a Starknet smart account on Mainnet automatically.
   No wallet extension or seed phrase is ever required.

2. Gasless Transactions
   Every tip transaction uses feeMode: "sponsored" through the AVNU Paymaster.
   The Starkzap SDK routes the transaction through our server-side paymaster proxy
   so the donor only spends the STRK tip amount. Gas is completely abstracted away.

3. Token Operations
   The Starkzap Amount.parse and getPresets helpers handle STRK token denomination
   and amount formatting throughout the codebase.

4. Server-side Signing
   The PrivySigner integration uses our /api/wallet/sign endpoint to sign
   transaction hashes server-side via Privy rawSign so no private key ever
   appears on the frontend.

---

## Project Structure

```
src/
  app/
    (main)/
      page.tsx              Landing page
      layout.tsx            Shared layout with navbar
      dashboard/page.tsx    Creator dashboard
      tip/[address]/page.tsx  Public creator tip page
    api/
      wallet/starknet/      Privy wallet creation endpoint
      wallet/sign/          Server-side transaction signing
      paymaster/            AVNU Paymaster proxy (keeps API key server-side)
      creator/              Creator profile CRUD
      tips/                 Tip recording and retrieval
  components/
    providers/
      PrivyProvider.tsx     Privy React Auth wrapper
      WalletProvider.tsx    Global Starkzap wallet state context
    landing/                Hero, How It Works, Features, CTA sections
    dashboard/              Creator setup modal
    tip/                    Tip form, success overlay, page client
    layout/                 Navbar
  lib/
    constants.ts            Starknet addresses, helpers
    db.ts                   In-memory data store (replace with DB in production)

contracts/
  src/lib.cairo             Cairo tipping contract
  Scarb.toml                Cairo project manifest
```

---

## Quick Start

```bash
cp .env.local.example .env.local
```

Fill in the following values in .env.local:

```
NEXT_PUBLIC_PRIVY_APP_ID     Create at https://dashboard.privy.io
PRIVY_APP_ID                 Same as above
PRIVY_APP_SECRET             From the Privy dashboard API keys section
AVNU_PAYMASTER_API_KEY       Create at https://portal.avnu.fi
NEXT_PUBLIC_APP_URL          http://localhost:3000 for local dev
NEXT_PUBLIC_TIPPING_CONTRACT_ADDRESS   After deploying the Cairo contract
```

Then run:

```bash
npm install
npm run dev
```

Open http://localhost:3000

---

## Cairo Contract Deployment

See DEPLOYMENT.md for the complete step-by-step guide covering:

- Compiling with Scarb
- Declaring the class on Mainnet with Starkli
- Deploying the contract instance
- Verifying on the Voyager explorer

---

## Tech Stack

Next.js 15, React 19, TypeScript, Tailwind CSS
Starkzap SDK with Privy strategy and AVNU Paymaster
Cairo 2.x smart contract on Starknet Mainnet
Privy for social login and server-side key management
AVNU Paymaster for gas sponsorship

---

## Bounty Requirements Met

Meaningful Starkzap Integration: OnboardStrategy.Privy, feeMode sponsored, Amount.parse, getPresets, PrivySigner
Web2 to On-chain UX: Email/Google login, no pop-ups, no gas fees, direct STRK tips
Mainnet Ready: All configuration targets Starknet Mainnet. Cairo contract deployed via Starkli.
Genuine Usefulness: Creator monetization solving real problems for the Starknet ecosystem.
