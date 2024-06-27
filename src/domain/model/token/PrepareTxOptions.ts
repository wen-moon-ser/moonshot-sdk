export interface PrepareTxOptions {
  tokenAmount: string;
  collateralAmount: string;
  slippage: number;
  creatorPK: string;
  tradeDirection: 'BUY' | 'SELL';
}
