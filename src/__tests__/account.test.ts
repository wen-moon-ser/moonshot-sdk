import { Environment, Moonshot, Token } from '../domain';

describe('Curve account', () => {
  const mintAddress = 'AhaAKM3dUKAeYoZCTXF8fqqbjcvugbgEmst6557jkZ9h';
  let moonshot: Moonshot;
  const rpcUrl =
    'https://rpc.helius.xyz/?api-key=4739a036-705f-48be-8704-1f5f2eff07fa';
  let token: Token;

  beforeAll(() => {
    moonshot = new Moonshot({
      rpcUrl,
      authToken: 'YOUR_AUTH_TOKEN',
      environment: Environment.MAINNET,
    });

    token = moonshot.Token({
      mintAddress,
    });
  });

  test('get collateral price', async () => {
    const account = await token.getCurveAccount();
    expect(account).toBeDefined();

    expect(account.curveType).toBe(0);
    expect(String(account.mint)).toBe(mintAddress);
  });
});
