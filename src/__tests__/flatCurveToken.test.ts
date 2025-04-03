import { TradeDirection } from '@heliofi/launchpad-common';
import { Environment, Moonshot, Token } from '../domain';
import 'dotenv/config';

describe('FLAT_V1 curve token', () => {
  let moonshot: Moonshot;

  const rpcUrl = process.env.RPC_URL as string;
  const mintAddress = process.env.FLAT_CURVE_MINT as string;

  let token: Token;

  beforeAll(() => {
    moonshot = new Moonshot({
      rpcUrl,
      environment: Environment.MAINNET,
    });

    token = moonshot.Token({
      mintAddress: mintAddress,
    });
  });

  test('should get the token details from curve account', async () => {
    const priceFor200SolCollateral = 412n;
    const constantPrice = await token.getCollateralPrice({
      tokenAmount: BigInt(1e9), // 1 token in minimal units
      curvePosition: 0n,
    });
    expect(constantPrice).toBe(priceFor200SolCollateral);

    const curveAccount = await token.getCurveAccount();

    expect(curveAccount.curveType).toBe(3);
    expect(curveAccount.marketcapThreshold).toBe(200000000000n);
    expect(curveAccount.priceIncrease).toBe(2000);
    expect(curveAccount.totalSupply).toBe(1000000000000000000n);
  });

  test('should check buy amounts at different curve position for same collateral to be the same', async () => {
    const buyAmountAtBeginning = await token.getTokenAmountByCollateral({
      collateralAmount: BigInt(1e8), // 0.1 SOL
      tradeDirection: TradeDirection.BUY,
      curvePosition: 0n,
    });

    const buyAmountAtCurvePos = await token.getTokenAmountByCollateral({
      collateralAmount: BigInt(1e8), // 0.1 SOL
      tradeDirection: TradeDirection.BUY,
      curvePosition: 1_000_000_000_000_000n,
    });

    expect(buyAmountAtBeginning).toBe(buyAmountAtCurvePos);
  });

  test('should check buy collateral amount at different curve positions for the same token amounts', async () => {
    const buyAmountAtBeginning = await token.getCollateralAmountByTokens({
      tokenAmount: BigInt(1e6 * 1e9), // 1m Tokens
      tradeDirection: TradeDirection.BUY,
      curvePosition: 0n,
    });

    const buyAmountAtCurvePos = await token.getCollateralAmountByTokens({
      tokenAmount: BigInt(1e6 * 1e9), // 1m Tokens
      tradeDirection: TradeDirection.BUY,
      curvePosition: 1_000_000_000_000_000n,
    });

    expect(buyAmountAtBeginning).toBe(buyAmountAtCurvePos);
  });

  test('should check sell collateral amount at different curve positions for the same token amounts', async () => {
    const buyAmountAtBeginning = await token.getCollateralAmountByTokens({
      tokenAmount: BigInt(1e6 * 1e9), // 1m Tokens
      tradeDirection: TradeDirection.SELL,
      curvePosition: 1_000_000_000_000_000n,
    });

    const buyAmountAtCurvePos = await token.getCollateralAmountByTokens({
      tokenAmount: BigInt(1e6 * 1e9), // 1m Tokens
      tradeDirection: TradeDirection.SELL,
      curvePosition: 2_000_000_000_000_000n,
    });

    expect(buyAmountAtBeginning).toBe(buyAmountAtCurvePos);
  });

  test('should have same amounts for buy and sell excluding trading fee', async () => {
    // From 1m curve position to 2m
    const collateralForBuy = await token.getCollateralAmountByTokens({
      tokenAmount: BigInt(1e6 * 1e9), // 1m Tokens
      tradeDirection: TradeDirection.BUY,
      curvePosition: BigInt(1e6 * 1e9),
    });

    // From 2m curve position to 1m
    const collateralForSell = await token.getCollateralAmountByTokens({
      tokenAmount: BigInt(1e6 * 1e9), // 1m Tokens
      tradeDirection: TradeDirection.SELL,
      curvePosition: BigInt(2 * 1e6 * 1e9),
    });

    const collateralForSellFeeAdjusted =
      collateralForSell + (collateralForSell * 100n) / 10000n;

    const collateralForBuyFeeAdjusted =
      collateralForBuy - (collateralForBuy * 100n) / 10000n;

    expect(collateralForBuyFeeAdjusted).toBe(collateralForSellFeeAdjusted);
  });

  test('should check sell amounts at different curve position for same collateral to be the same', async () => {
    const buyAmountAtCurvePosA = await token.getTokenAmountByCollateral({
      collateralAmount: BigInt(1e8), // 0.1 SOL
      tradeDirection: TradeDirection.SELL,
      curvePosition: 1_000_000_000_000_000n,
    });

    const buyAmountAtCurvePosB = await token.getTokenAmountByCollateral({
      collateralAmount: BigInt(1e8), // 0.1 SOL
      tradeDirection: TradeDirection.SELL,
      curvePosition: 2_000_000_000_000_000n,
    });

    expect(buyAmountAtCurvePosA).toBe(buyAmountAtCurvePosB);
  });

  test('get prepared instructions, ready for the submit after signing', async () => {
    const preparedBuyIx = await token.prepareIxs({
      tokenAmount: 1000000000n,
      collateralAmount: 100000000n,
      slippageBps: 100,
      creatorPK: 'Cb8Fnhp95f9dLxB3sYkNCbN3Mjxuc3v2uQZ7uVeqvNGB',
      tradeDirection: TradeDirection.BUY,
    });

    expect(preparedBuyIx.ixs[0]).toBeDefined();

    const preparedSellIx = await token.prepareIxs({
      tokenAmount: 1000000000n,
      collateralAmount: 100000000n,
      slippageBps: 100,
      creatorPK: 'Cb8Fnhp95f9dLxB3sYkNCbN3Mjxuc3v2uQZ7uVeqvNGB',
      tradeDirection: TradeDirection.SELL,
    });

    expect(preparedSellIx.ixs[0]).toBeDefined();
  });
});
