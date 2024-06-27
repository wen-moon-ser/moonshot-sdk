# moonshot-sdk

## Initial spec

```typescript
const sdk = new MoonSDK({rpcUrl: string});
const token = sdk.Token(mintAddress);

token.getCollateralPrice(options?: {curvePosition?: string }); // optionally accepts curve position, if not given it will take current token curve position from chain
token.getCurvePosition(); // gets current curve position from chain

// again, if curve position is not provided we calculate it from chain
token.getTokenAmountByCollateral(options: {collateralAmount: string, tradeDirection: 'BUY' | 'SELL', curvePosition?: string});

token.getCollateralAmountByTokens(options: {tokenAmount: string, tradeDirection: 'BUY' | 'SELL', curvePosition?: string});

// for v0 alpha release
const partiallySignedTxSerialized = token.getTx(options: {tokenAmount: string, collateralAmount: string, slippage: number, creatorPK: string, tradeDirection: 'BUY' | 'SELL'});

// for beta release which will follow in a day or two, we add those options
const partiallySignedSerializedTx = token.getTx(options: {tokenAmount: string, collateralAmount: string, slippage: number, creatorPK: string, tradeDirection: 'BUY' | 'SELL', prioFeeMicroLamports: number, affiliateFeeWallet: string, affiliateFeeBps: number});
```
