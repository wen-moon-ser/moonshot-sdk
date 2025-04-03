import 'dotenv/config';
import { Environment, Moonshot, Token } from '../domain';

describe('Curve account', () => {
  let moonshot: Moonshot;
  const rpcUrl = process.env.RPC_URL as string;
  const mintAddress = process.env.TEST_MINT_ADDRESS as string;

  let token: Token;

  beforeAll(() => {
    moonshot = new Moonshot({
      rpcUrl,
      environment: Environment.DEVNET,
    });

    token = moonshot.Token({
      mintAddress,
    });
  });

  test('get collateral price', async () => {
    const account = await token.getCurveAccount();
    expect(account).toBeDefined();

    expect(account.curveType).toBe(1);
    expect(account.totalSupply).toBe(1000000000000000000n);
    expect(account.decimals).toBe(9);
    expect(String(account.mint)).toBe(mintAddress);
  });
});
