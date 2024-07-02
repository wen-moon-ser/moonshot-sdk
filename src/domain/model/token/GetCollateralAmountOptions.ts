export interface GetCollateralAmountOptions {
  tokenAmount: bigint;
  tradeDirection: 'BUY' | 'SELL';
  curvePosition?: bigint;
}
