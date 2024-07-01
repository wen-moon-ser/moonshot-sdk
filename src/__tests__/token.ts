import { Environment, Moonshot, Token } from '../domain';

describe('Token', () => {
  let moonshot: Moonshot;
  const rpcUrl = 'https://api.mainnet-beta.solana.com';
  let token: Token;
  const minimalPrice = 10n;

  beforeAll(() => {
    moonshot = new Moonshot({
      rpcUrl,
      authToken: '',
      environment: Environment.MAINNET,
    });

    token = moonshot.Token({
      mintAddress: 'AhaAKM3dUKAeYoZCTXF8fqqbjcvugbgEmst6557jkZ9h',
    });
  });

  test('get collateral price', async () => {
    const initalPrice = await token.getCollateralPrice({
      tokensAmount: BigInt(1_000_000_000),
      curvePosition: 0n,
    });
    expect(initalPrice).toBe(minimalPrice);

    const currentPrice = await token.getCollateralPrice({
      tokensAmount: BigInt(1_000_000_000),
    });
    expect(currentPrice).toBeGreaterThan(minimalPrice);
  });
});
