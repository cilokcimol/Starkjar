# Starkjar

Created by Vika Joestar for the Starkzap Developer Bounty Program

A STRK tipping platform built on Starknet Sepolia. Creators share a public profile link and fans connect their Starknet wallet to send on-chain STRK tips.

Live demo: https://starkjar.netlify.app

Repository: https://github.com/cilokcimol/Starkjar


## What It Does

Starkjar is the Buy Me a Coffee of Starknet. A creator registers their wallet address and gets a public tip page at /tip/0x... — anyone with Argent X or Braavos can open that link, connect, pick an amount, and send STRK directly on-chain.

Every tip is a real Starknet transaction. The message field is stored as a Starknet event, permanently on-chain. No custodian, no middleman, no redirects.


## Starkzap SDK Integration

This project integrates the Starkzap SDK at multiple layers:

**Wallet Onboarding**
Users connect via @starknet-io/get-starknet, which presents the native Starknet wallet picker (Argent X, Braavos, Keplr). The returned account object is used with Starkzap-compatible wallet flows.

**Token Setup**
getPresets and Amount.parse from the Starkzap SDK handle STRK token denomination and address resolution across Sepolia and Mainnet.

**Transaction Execution**
Tips are sent as a multicall: approve on the STRK ERC-20 followed by send_tip on the deployed Tipping contract. The connected wallet signs and broadcasts the transaction natively.

**On-chain Tipping Contract**
A custom Cairo 2.x Tipping contract deployed on Starknet Sepolia handles the transfer logic and emits a TipSent event with the message.

Contract address: 0x7a105e998b5e09b6a40b15a32bc1fc591f5748025d355e042259d659ab3c418


## Project Structure

```
src/
  app/
    (main)/
      page.tsx
      layout.tsx
      dashboard/page.tsx
      tip/[address]/page.tsx
    api/
      creator/
      tips/
      paymaster/
      wallet/starknet/
      wallet/sign/
  components/
    providers/
      WalletProvider.tsx
    landing/
    dashboard/
    tip/
    layout/
  lib/
    constants.ts
    db.ts

contracts/
  src/lib.cairo
  Scarb.toml
```


## Quick Start

```bash
cp .env.example .env.local
npm install
npm run dev
```

Open http://localhost:3000

Required environment variables in .env.local:

```
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_TIPPING_CONTRACT_ADDRESS=0x7a105e998b5e09b6a40b15a32bc1fc591f5748025d355e042259d659ab3c418
```

No Privy account required. Wallet connection is handled entirely client-side via @starknet-io/get-starknet.


## Cairo Contract

The Tipping contract is deployed and verified on Starknet Sepolia.

Address: 0x7a105e998b5e09b6a40b15a32bc1fc591f5748025d355e042259d659ab3c418

Voyager: https://sepolia.voyager.online/contract/0x7a105e998b5e09b6a40b15a32bc1fc591f5748025d355e042259d659ab3c418

For full deployment instructions see DEPLOYMENT.md.


## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 15, React 19, TypeScript |
| Styling | Tailwind CSS, vanilla CSS custom properties |
| Fonts | Space Grotesk and Space Mono |
| Wallet | @starknet-io/get-starknet v4 |
| Starknet | starkzap v2, starknet.js v6 |
| Smart Contract | Cairo 2.x on Starknet Sepolia |
| Deployment | Netlify with Next.js SSR plugin |


## Bounty Requirements

Meaningful Starkzap Integration: getPresets, Amount.parse, wallet account interface

Real On-chain UX: Native wallet picker for Argent and Braavos, STRK multicall tip, on-chain message event

Deployed Contract: Tipping contract live on Starknet Sepolia, verifiable on Voyager

Genuine Usefulness: Creator monetization solving a real problem in the Starknet ecosystem
