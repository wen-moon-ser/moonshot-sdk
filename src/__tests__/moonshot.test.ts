import { Environment, Moonshot, SolanaSerializationService } from '../domain';
import { Keypair } from '@solana/web3.js';
import { CurveType, MigrationDex, TxStatus } from '@heliofi/launchpad-common';
import 'dotenv/config';
import { imagePathToBase64 } from '../domain';

jest.setTimeout(60000);

describe('Moonshot', () => {
  const testWallet = process.env.TEST_DEV_WALLET;
  let moonshot: Moonshot;
  let creator: Keypair;
  const rpcUrl = process.env.RPC_URL as string;

  beforeAll(() => {
    moonshot = new Moonshot({
      rpcUrl,
      authToken: 'TMP_TOKEN',
      environment: Environment.DEVNET,
    });

    creator = Keypair.fromSecretKey(
      Uint8Array.from(JSON.parse(testWallet as string)),
    );
  });

  it('should prepare a token mint', async () => {
    const img = imagePathToBase64('src/__tests__/assets/icon.png');

    const prepMint = await moonshot.prepareMintTx({
      creator: creator.publicKey.toBase58(),
      name: 'TEST_TOKEN',
      symbol: 'TEST_TOKEN',
      curveType: CurveType.CONSTANT_PRODUCT_V1,
      migrationDex: MigrationDex.RAYDIUM,
      icon: img,
      description: 'TEST_TOKEN',
      links: [{ url: 'https://x.com', label: 'x handle' }],
      banner: img,
    });

    expect(prepMint.token).toBeDefined();
    expect(prepMint.tokenId).toBeDefined();
    expect(prepMint.transaction).toBeDefined();
  });

  it('should prepare and submit token mint', async () => {
    const img = imagePathToBase64('src/__tests__/assets/icon.png');

    const prepMint = await moonshot.prepareMintTx({
      creator: creator.publicKey.toBase58(),
      name: 'TEST_TOKEN',
      symbol: 'TEST_TOKEN',
      curveType: CurveType.CONSTANT_PRODUCT_V1,
      migrationDex: MigrationDex.RAYDIUM,
      icon: img,
      description: 'TEST_TOKEN',
      links: [{ url: 'https://x.com', label: 'x handle' }],
      banner: img,
      tokenAmount: '42000000000',
      affiliate: {
        wallet: creator.publicKey.toBase58(),
      },
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

    expect(res.txSignature).toBeDefined();
    expect(res.status).toBe(TxStatus.SUCCESS);
  });
});
