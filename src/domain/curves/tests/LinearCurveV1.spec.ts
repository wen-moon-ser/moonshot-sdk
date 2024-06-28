import BigNumber from 'bignumber.js';
import { LinearCurveV1 } from '../LinearCurveV1';
import { TradeDirection } from '../../constants/tradeDirection';

describe('LinearCurveV1', () => {
  let curve: LinearCurveV1;
  const totalSupply = BigInt((1e18).toString()); // 1 billion tokens in supply
  const decimalsNr = 9; // Using 9 for all decimal-related calculations
  const marketCapThreshold = BigInt(500e9); // Example threshold
  const marketCapDecimalsNr = 9;
  const collateralDecimalsNr = 9;
  const migrationFee = 2; // SOL

  let coefA: BigNumber;
  let coefB: BigNumber;

  beforeAll(() => {
    curve = new LinearCurveV1();
  });

  describe('getCoeficients', () => {
    it('should get coefficient a and b value', () => {
      coefB = curve.getCoefB(1n, collateralDecimalsNr);
      expect(coefB.toNumber()).toBe(1e-9);

      coefA = curve.getCoefA(
        coefB,
        totalSupply,
        decimalsNr,
        marketCapThreshold,
        marketCapDecimalsNr,
      );
      expect(coefA.toNumber()).toBeGreaterThan(1e-15);
      expect(coefA.toNumber()).toBeLessThan(2e-15);
    });
  });

  describe('calculateCostForNTokens', () => {
    it('should calculate the correct cost for 1e6 tokens', () => {
      const nAmount = BigInt(1e12); // minimal units
      const curvePosition = BigInt(0); // Initial position is 0
      const expectedCost = curve.calculateCostForNTokens({
        coefA,
        coefB,
        nAmount,
        curvePosition,
        decimalsNr,
        collateralDecimalsNr,
      });
      expect(expectedCost).toBe(BigInt(1001));
    });
  });

  describe('calculateNrOfTokensPerCollateral', () => {
    it('should calculate the correct nr of tokens for buy with 1001 collateral', () => {
      const collateralAmount = BigInt(1001); // minimal units
      const curvePosition = BigInt(0); // Initial position is 0
      const expectedNrOfTokens = curve.calculateTokensNrFromCollateral({
        coefA,
        coefB,
        collateralAmount,
        curvePosition,
        decimalsNr,
        collateralDecimalsNr,
      });
      expect(expectedNrOfTokens).toBe(BigInt(1e12));
    });

    it('should calculate the correct nr of tokens for sell with 1001 collateral when curve position is 1e6', () => {
      const collateralAmount = BigInt(1001); // minimal units
      const curvePosition = BigInt(1e12); // Initial position is 0
      const expectedNrOfTokens = curve.calculateTokensNrFromCollateral({
        tradeDirection: TradeDirection.SELL,
        coefA,
        coefB,
        collateralAmount,
        curvePosition,
        decimalsNr,
        collateralDecimalsNr,
      });
      expect(expectedNrOfTokens).toBe(BigInt(1e12));
    });

    it('should calculate the correct nr of tokens for buy with 0.001 collateral for curve position 20M', () => {
      const collateralAmount = BigInt(1e6);
      const curvePosition = BigInt(20 * 1e15);
      const expectedNrOfTokens = curve.calculateTokensNrFromCollateral({
        coefA,
        coefB,
        collateralAmount,
        curvePosition,
        decimalsNr,
        collateralDecimalsNr,
      });
      expect(expectedNrOfTokens).toBe(BigInt(2.9372e13));
    });

    it('should calculate the correct nr of tokens to sell with 0.001 collateral for curve position 20M+', () => {
      const collateralAmount = BigInt(1e6);
      const curvePosition = BigInt(20.029372 * 1e15);
      const expectedNrOfTokens = curve.calculateTokensNrFromCollateral({
        tradeDirection: TradeDirection.SELL,
        coefA,
        coefB,
        collateralAmount,
        curvePosition,
        decimalsNr,
        collateralDecimalsNr,
      });
      expect(expectedNrOfTokens).toBe(BigInt(2.9372e13));
    });
  });

  describe('tokensToMigrate', () => {
    it('should calculate the correct tokens to migrate based on allocation', () => {
      const curveAllocation = BigInt(5.5e17);
      const expectedMigrate = curve.tokensToMigrate(
        coefA,
        coefB,
        curveAllocation,
        decimalsNr,
        migrationFee,
      );
      expect(expectedMigrate).toBeDefined();
    });
  });

  describe('tokensToBurn', () => {
    it('should calculate the correct tokens to burn after migration', () => {
      const allocation = BigInt(1e6); // Allocation after first sale
      const tokensToMigrate = BigInt(500000); // Assuming some tokens are set to migrate
      const expectedBurn = curve.tokensToBurn(
        totalSupply,
        allocation,
        tokensToMigrate,
      );
      expect(expectedBurn).toBeDefined();
    });
  });

  describe('calculateCostForNTokens using getCollateralPrice', () => {
    it('should calculate the correct cost for 1e6 tokens', () => {
      const nAmount = BigInt(1e12); // minimal units
      const curvePosition = BigInt(0); // Initial position is 0
      const expectedCost = curve.getCollateralPrice({
        curvePosition,
        tokenDecimalsNr: decimalsNr,
        collateralDecimalsNr,
        marketCapDecimalsNr,
        marketCapThreshold,
        tokensAmount: nAmount,
        totalSupply,
        coefB: 1n,
      });
      expect(expectedCost).toBe(BigInt(1001));
    });
  });

  describe('calculateCurvePrice', () => {
    it('should calculate the correct price for 1e3 position', () => {
      const curvePosition = BigInt(1e12);
      const price = curve.getPriceForCurvePosition({
        curvePosition,
        tokenDecimalsNr: decimalsNr,
        collateralDecimalsNr,
        marketCapDecimalsNr,
        marketCapThreshold,
        totalSupply,
        coefB: 1n,
      });
      expect(price).toBe(1n);
    });
    it('should calculate the correct price for threshold position', () => {
      const curvePositionAtThreshold = BigInt(5.5e17);
      const priceAtThreshold = curve.calculateCurvePrice(
        coefA,
        coefB,
        curvePositionAtThreshold,
        collateralDecimalsNr,
        decimalsNr,
      );
      expect(priceAtThreshold).toBe(909n);
    });
  });
});
