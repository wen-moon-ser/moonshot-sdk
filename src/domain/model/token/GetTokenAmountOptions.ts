export interface GetTokenAmountOptions {
  collateralAmount: bigint;
  tradeDirection: 'BUY' | 'SELL';
  curvePosition?: bigint;
}
