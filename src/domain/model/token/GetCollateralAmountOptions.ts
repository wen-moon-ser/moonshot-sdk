import { TradeDirection } from '../../';

export interface GetCollateralAmountOptions {
  tokenAmount: string;
  tradeDirection: TradeDirection;
  curvePosition?: string;
}
