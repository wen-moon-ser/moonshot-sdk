import { TradeDirection } from './TradeDirection';

export interface GetTokenAmountOptions {
  collateralAmount: string;
  tradeDirection: TradeDirection;
  curvePosition?: string;
}
