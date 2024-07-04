import { PublicKey } from '@solana/web3.js';

export type TradeRequest = {
  tokenAmount: bigint;
  collateralAmount: bigint;
  slippageBps: number;
  sender: PublicKey;
  curveAccount: PublicKey;
  mint: PublicKey;
};
