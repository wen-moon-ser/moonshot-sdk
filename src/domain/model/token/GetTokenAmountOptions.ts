import { TradeDirection } from '../../';

export interface GetTokenAmountOptions {
  collateralAmount: string;
  tradeDirection: TradeDirection;
  curvePosition?: string;
}
