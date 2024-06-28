export enum BlockchainSymbol {
  SOL = 'SOL',
  ETH = 'ETH',
  POLYGON = 'POLYGON',
  BITCOIN = 'BITCOIN',
}

export enum BlockchainEngineType {
  EVM = 'EVM',
  SOL = 'SOL',
  BTC = 'BTC',
}

export const blockchainEngineMap = new Map<
  BlockchainSymbol,
  BlockchainEngineType
>([
  [BlockchainSymbol.SOL, BlockchainEngineType.SOL],
  [BlockchainSymbol.ETH, BlockchainEngineType.EVM],
  [BlockchainSymbol.POLYGON, BlockchainEngineType.EVM],
  [BlockchainSymbol.BITCOIN, BlockchainEngineType.BTC],
]);

export function getDefaultBlockChainName(): BlockchainSymbol {
  return BlockchainSymbol.SOL;
}
