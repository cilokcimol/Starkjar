export type Creator = {
  address: string;
  name: string;
  bio: string;
  handle: string;
  avatarUrl: string | null;
  totalReceived: string;
  tipCount: number;
  joinedAt: string;
};

export type Tip = {
  id: string;
  creatorAddress: string;
  donorAddress: string;
  amount: string;
  message: string;
  txHash: string;
  timestamp: string;
};

/* eslint-disable no-var */
declare global {
  var __creatorsDb: Map<string, Creator> | undefined;
  var __tipsDb: Map<string, Tip[]> | undefined;
}
/* eslint-enable no-var */

export const creatorsDb: Map<string, Creator> =
  globalThis.__creatorsDb ?? (globalThis.__creatorsDb = new Map());

export const tipsDb: Map<string, Tip[]> =
  globalThis.__tipsDb ?? (globalThis.__tipsDb = new Map());
