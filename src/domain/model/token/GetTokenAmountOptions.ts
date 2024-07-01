import { TradeDirection } from '@heliofi/launchpad-common';

export interface GetTokenAmountOptions {
  collateralAmount: bigint;
  tradeDirection: TradeDirection;
  curvePosition?: bigint;
}
