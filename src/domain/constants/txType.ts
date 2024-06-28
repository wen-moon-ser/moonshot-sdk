export enum TxType {
  MINT = 'MINT',
  BUY = 'BUY',
  SELL = 'SELL',
  MIGRATE = 'MIGRATE',
  MINT_BUY = 'MINT_BUY',
}

export const tradeTypes = [TxType.BUY, TxType.SELL, TxType.MINT_BUY];
