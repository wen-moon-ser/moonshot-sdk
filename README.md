# moonshot-sdk

## Direct RPC call prepare and send transaction

Generate a keypair and send funds for the right environment (devnet or mainnet).

### Buy example
```typescript
import { Environment, FixedSide, Moonshot } from '@wen-moon-ser/moonshot-sdk';
import {
  ComputeBudgetProgram,
  Connection,
  Keypair,
  TransactionMessage,
  VersionedTransaction,
} from '@solana/web3.js';
import testWallet from '../test-wallet.json';

export const buyIx = async (): Promise<void> => {
  console.log('--- Buying token example ---');

  const rpcUrl = 'https://api.devnet.solana.com';

  const connection = new Connection(rpcUrl);

  const moonshot = new Moonshot({
    rpcUrl,
    environment: Environment.DEVNET,
    chainOptions: {
      solana: { confirmOptions: { commitment: 'confirmed' } },
    },
  });

  const token = moonshot.Token({
    mintAddress: '9ThH8ayxFCFZqssoZmodgvtbTiBmMoLWUqQhRAP89Y97',
  });

  const curvePos = await token.getCurvePosition();
  console.log('Current position of the curve: ', curvePos); // Prints the current curve position

  // make sure creator has funds
  const creator = Keypair.fromSecretKey(Uint8Array.from(testWallet));
  console.log('Creator: ', creator.publicKey.toBase58());

  const tokenAmount = 10000n * 1000000000n; // Buy 10k tokens

  // Buy example
  const collateralAmount = await token.getCollateralAmountByTokens({
    tokenAmount,
    tradeDirection: 'BUY',
  });

  const { ixs } = await token.prepareIxs({
    slippageBps: 500,
    creatorPK: creator.publicKey.toBase58(),
    tokenAmount,
    collateralAmount,
    tradeDirection: 'BUY',
    fixedSide: FixedSide.OUT, // This means you will get exactly the token amount and slippage is applied to collateral amount
  });

  const priorityIx = ComputeBudgetProgram.setComputeUnitPrice({
    microLamports: 200_000,
  });

  const blockhash = await connection.getLatestBlockhash('confirmed');
  const messageV0 = new TransactionMessage({
    payerKey: creator.publicKey,
    recentBlockhash: blockhash.blockhash,
    instructions: [priorityIx, ...ixs],
  }).compileToV0Message();

  const transaction = new VersionedTransaction(messageV0);

  transaction.sign([creator]);
  const txHash = await connection.sendTransaction(transaction, {
    skipPreflight: false,
    maxRetries: 0,
    preflightCommitment: 'confirmed',
  });

  console.log('Buy Transaction Hash:', txHash);
};
```

### Sell example
```typescript
import { Environment, FixedSide, Moonshot } from '@wen-moon-ser/moonshot-sdk';
import {
  ComputeBudgetProgram,
  Connection,
  Keypair,
  TransactionMessage,
  VersionedTransaction,
} from '@solana/web3.js';
import testWallet from '../test-wallet.json';

export const sellIx = async (): Promise<void> => {
  console.log('--- Selling token example ---');
  const rpcUrl = 'https://api.devnet.solana.com';

  const connection = new Connection(rpcUrl);

  const moonshot = new Moonshot({
    rpcUrl,
    environment: Environment.DEVNET,
    chainOptions: {
      solana: { confirmOptions: { commitment: 'confirmed' } },
    },
  });

  const token = moonshot.Token({
    mintAddress: '9ThH8ayxFCFZqssoZmodgvtbTiBmMoLWUqQhRAP89Y97',
  });

  const curvePos = await token.getCurvePosition();
  console.log('Current position of the curve: ', curvePos); // Prints the current curve position

  // make sure creator has funds
  const creator = Keypair.fromSecretKey(Uint8Array.from(testWallet));
  console.log('Creator: ', creator.publicKey.toBase58());

  const tokenAmount = 10000n * 1000000000n; // Buy 10k tokens

  // Buy example
  const collateralAmount = await token.getCollateralAmountByTokens({
    tokenAmount,
    tradeDirection: 'SELL',
  });

  const { ixs } = await token.prepareIxs({
    slippageBps: 500,
    creatorPK: creator.publicKey.toBase58(),
    tokenAmount,
    collateralAmount,
    tradeDirection: 'SELL',
    fixedSide: FixedSide.IN, // This means you will pay exactly the token amount slippage is applied to collateral amount
  });

  const priorityIx = ComputeBudgetProgram.setComputeUnitPrice({
    microLamports: 200_000,
  });

  const blockhash = await connection.getLatestBlockhash('confirmed');
  const messageV0 = new TransactionMessage({
    payerKey: creator.publicKey,
    recentBlockhash: blockhash.blockhash,
    instructions: [priorityIx, ...ixs],
  }).compileToV0Message();

  const transaction = new VersionedTransaction(messageV0);

  transaction.sign([creator]);
  const txHash = await connection.sendTransaction(transaction, {
    skipPreflight: false,
    maxRetries: 0,
    preflightCommitment: 'confirmed',
  });

  console.log('Sell Transaction Hash:', txHash);
};
```


### Mint token using SDK

You can now mint tokens using the SDK. The SDK abstracts and handles the preparation, the submissions and the upload of all assets.
We introduce two new functions on `Moonshot` class: `prepareMintTx` and `submitMintTx`.

The `prepareMintTx` will gather all the necessary data to mint a token, and the function will return a transaction, which needs to be signed by creator wallet.
This can be done both in the browser or on the server side using KeyPair of the creator.

Example:
```typescript
import {
  CurveType,
  Environment,
  MigrationDex,
  Moonshot,
  SolanaSerializationService,
  imagePathToBase64,
} from '@wen-moon-ser/moonshot-sdk';
import { Keypair } from '@solana/web3.js';
import testWallet from '../../test-wallet.json';

export const createMint = async (): Promise<void> => {
  console.log('--- Create mint example ---');

  const creator = Keypair.fromSecretKey(Uint8Array.from(testWallet));
  console.log('Creator: ', creator.publicKey.toBase58());

  const moonshot = new Moonshot({
    rpcUrl: 'https://api.devnet.solana.com',
    environment: Environment.DEVNET,
    chainOptions: {
      solana: { confirmOptions: { commitment: 'confirmed' } },
    },
  });

  const icon = imagePathToBase64('src/assets/icon.png');

  const prepMint = await moonshot.prepareMintTx({
    creator: creator.publicKey.toBase58(),
    name: 'SDK_MINT',
    symbol: 'SDK_MINT',
    curveType: CurveType.CONSTANT_PRODUCT_V1,
    migrationDex: MigrationDex.RAYDIUM,
    icon,
    description: 'Token minted using the @wen-moon-ser/moonshot-sdk',
    links: [{ url: 'https://x.com', label: 'x handle' }],
    banner: icon,
    tokenAmount: '42000000000',
  });

  const deserializedTransaction =
    SolanaSerializationService.deserializeVersionedTransaction(
      prepMint.transaction,
    );
  if (deserializedTransaction == null) {
    throw new Error('Failed to deserialize transaction');
  }

  deserializedTransaction.sign([creator]);

  const signedTransaction =
    SolanaSerializationService.serializeVersionedTransaction(
      deserializedTransaction,
    );

  const res = await moonshot.submitMintTx({
    tokenId: prepMint.tokenId,
    token: prepMint.token,
    signedTransaction,
  });

  console.log(res);
};

```
For full example code please refer to [moonshot-bot-examples](https://github.com/wen-moon-ser/moonshot-bot-examples) repository.
> Please note the mint endpoint is subject to rate limit per IP address, current limit is **2 requests per 10 seconds**.

