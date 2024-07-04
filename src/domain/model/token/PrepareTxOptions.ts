import { TradeDirection } from '@heliofi/launchpad-common';

export interface PrepareTxOptions {
  tokenAmount: bigint;
  collateralAmount: bigint;
  slippageBps: number;
  creatorPK: string;
  tradeDirection: TradeDirection;
}
