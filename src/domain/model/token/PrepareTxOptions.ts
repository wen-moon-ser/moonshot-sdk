import { FixedSide } from './FixedSide';

export interface PrepareTxOptions {
  tokenAmount: bigint;
  collateralAmount: bigint;
  slippageBps: number;
  creatorPK: string;
  tradeDirection: 'BUY' | 'SELL';
  fixedSide?: FixedSide;
}
