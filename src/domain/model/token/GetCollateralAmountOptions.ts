import { TradeDirection } from '@heliofi/launchpad-common';

export interface GetCollateralAmountOptions {
  tokensAmount: bigint;
  tradeDirection: TradeDirection;
  curvePosition?: bigint;
}
