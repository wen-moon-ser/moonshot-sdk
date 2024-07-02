export interface PrepareTxOptions {
  tokenAmount: bigint;
  collateralAmount: bigint;
  slippageBps: number;
  creatorPK: string;
  tradeDirection: 'BUY' | 'SELL';
}
