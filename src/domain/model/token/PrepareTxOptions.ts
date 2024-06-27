export interface PrepareTxOptions {
  tokenAmount: string;
  collateralAmount: string;
  slippageBps: number;
  creatorPK: string;
  tradeDirection: 'BUY' | 'SELL';
}
