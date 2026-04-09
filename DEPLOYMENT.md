# Starkjar Deployment Guide


## Prerequisites

Node.js 20 or later
Scarb 2.x (Cairo build tool)
Starkli (Starknet CLI)
A funded Starknet Sepolia wallet


## Environment Variables

Create a file named .env.local in the project root with the following:

```
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_TIPPING_CONTRACT_ADDRESS=
```

For Netlify deployment, add those same keys in the Netlify dashboard under Site Settings > Environment Variables.


## Cairo Contract Deployment

The contract source is in contracts/src/lib.cairo.

Step 1. Build the contract

```bash
cd contracts
scarb build
```

Step 2. Set up Starkli keystore

```bash
starkli signer keystore new keystore.json
starkli account fetch --rpc https://starknet-sepolia.g.alchemy.com/starknet/version/rpc/v0_10/<KEY> --output account.json <YOUR_ADDRESS>
```

Step 3. Declare the contract class

```bash
starkli declare target/dev/starkjar_Tipping.contract_class.json \
  --rpc https://starknet-sepolia.g.alchemy.com/starknet/version/rpc/v0_10/<KEY> \
  --account account.json \
  --keystore keystore.json
```

Copy the class hash from the output.

Step 4. Deploy the contract instance

```bash
starkli deploy <CLASS_HASH> \
  --rpc https://starknet-sepolia.g.alchemy.com/starknet/version/rpc/v0_10/<KEY> \
  --account account.json \
  --keystore keystore.json
```

Copy the contract address from the output.

Step 5. Update environment variable

Set NEXT_PUBLIC_TIPPING_CONTRACT_ADDRESS to the deployed contract address in .env.local and in the Netlify dashboard.


## Deployed Contract

The contract is already deployed on Starknet Sepolia at:

0x7a105e998b5e09b6a40b15a32bc1fc591f5748025d355e042259d659ab3c418

Voyager: https://sepolia.voyager.online/contract/0x7a105e998b5e09b6a40b15a32bc1fc591f5748025d355e042259d659ab3c418

You do not need to redeploy unless you change the Cairo source.


## Local Development

```bash
npm install
npm run dev
```

Open http://localhost:3000 in a browser with Argent X or Braavos extension installed.


## Netlify Deployment

The repository includes a netlify.toml that configures the Next.js SSR plugin automatically.

Connect the GitHub repository at app.netlify.com, set the environment variables, and deploy. Netlify will run npm run build on every push to main.


## Wallet Connection

Starkjar uses @starknet-io/get-starknet for wallet connection. When a user clicks Connect Wallet, the library presents the installed Starknet wallet extensions in a selection modal. No Privy account or API key is required.
