import { TradeDirection } from '@heliofi/launchpad-common';

export interface GetCollateralAmountOptions {
  tokenAmount: string;
  tradeDirection: TradeDirection;
  curvePosition?: string;
}
