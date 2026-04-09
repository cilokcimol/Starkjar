export const STARKNET_SEPOLIA_RPC =
  "https://starknet-sepolia.public.blastapi.io";

export const STRK_TOKEN_ADDRESS =
  "0x04718f5a0fc34cc1af16a1cdee98ffb20c31f5cd61d6ab07201858f4287c938d";

export const TIPPING_CONTRACT_ADDRESS =
  process.env.NEXT_PUBLIC_TIPPING_CONTRACT_ADDRESS ?? "";

export const AVNU_PAYMASTER_URL = "https://starknet.paymaster.avnu.fi";

export const VOYAGER_SEPOLIA_URL = "https://sepolia.voyager.online";

export const PRESET_AMOUNTS = ["1", "3", "5", "10", "25"];

export const DEFAULT_TIP_MESSAGE = "";

export const STRK_DECIMALS = 18;

export function shortAddress(address: string | null): string {
  if (!address) return "";
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

export function voyagerTxUrl(hash: string): string {
  return `${VOYAGER_SEPOLIA_URL}/tx/${hash}`;
}

export function parseStrkAmount(amount: string): bigint {
  const [whole, frac = ""] = amount.split(".");
  const padded = frac.padEnd(STRK_DECIMALS, "0").slice(0, STRK_DECIMALS);
  return BigInt(whole + padded);
}

export function formatStrkAmount(raw: bigint): string {
  const divisor = BigInt(10 ** STRK_DECIMALS);
  const whole = raw / divisor;
  const frac = raw % divisor;
  const fracStr = frac.toString().padStart(STRK_DECIMALS, "0").slice(0, 4);
  return `${whole}.${fracStr}`;
}
