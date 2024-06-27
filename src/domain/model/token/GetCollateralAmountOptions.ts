import { TradeDirection } from './TradeDirection';

export interface GetCollateralAmountOptions {
  tokenAmount: string;
  tradeDirection: TradeDirection;
  curvePosition?: string;
}
