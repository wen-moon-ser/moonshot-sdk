import { PublicKey } from '@solana/web3.js';
import { FixedSide } from '../token';

export type TradeRequest = {
  tokenAmount: bigint;
  collateralAmount: bigint;
  slippageBps: number;
  sender: PublicKey;
  curveAccount: PublicKey;
  mint: PublicKey;
  fixedSide: FixedSide;
};
