import { TradeDirection } from '@heliofi/launchpad-common';

export interface GetCollateralAmountOptions {
  tokensAmount: string;
  tradeDirection: TradeDirection;
  curvePosition?: string;
}
