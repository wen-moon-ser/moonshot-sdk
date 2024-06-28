import { TradeDirection } from '@heliofi/launchpad-common';

export interface GetTokenAmountOptions {
  collateralAmount: string;
  tradeDirection: TradeDirection;
  curvePosition?: string;
}
