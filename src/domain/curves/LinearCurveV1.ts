import BigNumber from 'bignumber.js';
import { CurveType, TradeDirection } from '../constants';
import { BaseCurve } from './BaseCurve';
import {
  CalculatePriceOptions,
  CalculateTokensOptions,
  CurveDefaults,
} from './types';

BigNumber.config({ DECIMAL_PLACES: 28 });

export class LinearCurveV1 extends BaseCurve {
  dynamicThreshold = 55;

  maxThreshold = 65;

  curveLimit = 3_300;

  readonly curveDefaults: CurveDefaults = {
    tokenDecimals: 9,
    type: CurveType.LINEAR_V1,
    feeBps: 100,
    totalSupply: BigInt(1e18),
    minAllocationTokenAmount:
      (BigInt(1e18) * BigInt(this.dynamicThreshold)) / 100n,
    maxAllocationTokenAmount: (BigInt(1e18) * BigInt(this.maxThreshold)) / 100n,
    marketCapThreshold: 500n * BigInt(1e9),
    address: '11111111111111111111111111111111', // tmp address
    coefB: 10n,
  } as const;

  constructor() {
    super();
    this.curveType = CurveType.LINEAR_V1;
  }

  calculateCostForNTokens(options: CalculatePriceOptions): bigint | undefined {
    const {
      coefA,
      coefB,
      nAmount,
      curvePosition,
      decimalsNr,
      collateralDecimalsNr,
    } = options;
    const tokenDecimals = new BigNumber(10).pow(decimalsNr);
    const collateralDecimals = new BigNumber(10).pow(collateralDecimalsNr);

    const n = new BigNumber(nAmount.toString()).dividedBy(tokenDecimals);
    const m = new BigNumber(curvePosition.toString()).dividedBy(tokenDecimals);

    // 1/2 a n (2 m + n) + b n
    // Simplified calculation: (0.5 * coefA * n * (2 * m + n) + coefB * n) * collateralDecimals
    const two = new BigNumber(2);
    const half = new BigNumber(0.5);
    // half * coefA * n * (2 * m + n) + coefB * n
    const result = half
      .multipliedBy(coefA)
      .multipliedBy(n)
      .multipliedBy(two.multipliedBy(m).plus(n))
      .plus(coefB.multipliedBy(n))
      .multipliedBy(collateralDecimals);
    try {
      return BigInt(result.toFixed(0));
    } catch (e) {
      return undefined;
    }
  }

  calculateTokensNrFromCollateral(
    options: CalculateTokensOptions,
  ): bigint | undefined {
    // Quadratic equation Ax^2 + Bx + C = 0 solution: x = (- +- sqrt(b^2 - 4ac)) / 2a
    // For Buy
    // Our equation: y = 1/2 a x (2 m + x) + b x, m is curve position, y is collateral amount
    // A -> a | B -> 2(am + b) |  C -> -2y
    // For Sell
    // Our equation: y = 1/2 a x (2(m-x) + x) + b x, m is current curve position (we move it to the left for x amount), y is collateral amount
    // A -> a | B -> - 2(am + b) |  C -> 2y
    const {
      coefA,
      coefB,
      collateralAmount,
      curvePosition, // TODO: curve position is correct for the buy but not for sell?
      decimalsNr,
      collateralDecimalsNr,
    } = options;

    try {
      const tokenDecimals = new BigNumber(10).pow(decimalsNr);
      const collateralDecimals = new BigNumber(10).pow(collateralDecimalsNr);

      const y = new BigNumber(collateralAmount.toString()).dividedBy(
        collateralDecimals,
      );
      const m = new BigNumber(curvePosition.toString()).dividedBy(
        tokenDecimals,
      );

      const a = coefA;
      let b = a.multipliedBy(m).plus(coefB).multipliedBy(2);
      let c = y.multipliedBy(-2);

      if (options.tradeDirection === TradeDirection.SELL) {
        b = b.negated();
        c = c.negated();
      }

      // Calculate the discriminant: B^2 - 4AC
      const discriminant = b.pow(2).minus(a.multipliedBy(c).multipliedBy(4));
      if (discriminant.isNegative()) {
        throw new Error(
          'Negative discriminant, no real roots for tokensNr from collateral calculation',
        );
      }

      // x = (-B ± sqrt(discriminant)) / (2A)
      const sqrtDiscriminant = discriminant.sqrt();
      const twoA = a.multipliedBy(2);

      // Two solutions, we'll take the larger one for buy and lesser one for the sell???
      const x1 = b.negated().plus(sqrtDiscriminant).dividedBy(twoA);
      const x2 = b.negated().minus(sqrtDiscriminant).dividedBy(twoA);
      const x = options.tradeDirection === TradeDirection.SELL ? x2 : x1; // For buy tradeDirection can be undefined
      return BigInt(x.toFixed(0)) * BigInt(tokenDecimals.toNumber()); // Round to 1 token
    } catch (e) {
      // TODO: log the error (be, fe ?)
      return undefined;
    }
  }

  tokensToMigrate(
    coefA: BigNumber,
    coefB: BigNumber,
    allocation: bigint,
    decimalsNr: number,
    migrationFee: number,
  ): bigint | undefined {
    const decimalsPow = new BigNumber(10).pow(decimalsNr);

    // Normalize curve allocation into whole units
    const curveAllocationNormalized = new BigNumber(
      allocation.toString(),
    ).dividedBy(decimalsPow);

    // Fee in collateral, assume migration fee is given in a smaller unit and must be normalized
    const feeInCollateral = new BigNumber(migrationFee).dividedBy(decimalsPow);

    const half = new BigNumber(0.5);
    const numerator = half
      .multipliedBy(coefA)
      .multipliedBy(curveAllocationNormalized)
      .multipliedBy(curveAllocationNormalized)
      .plus(coefB.multipliedBy(curveAllocationNormalized))
      .minus(feeInCollateral);

    const denominator = coefA
      .multipliedBy(curveAllocationNormalized)
      .plus(coefB);

    const result = numerator.dividedBy(denominator).multipliedBy(decimalsPow);

    try {
      return BigInt(result.toFixed(0));
    } catch (e) {
      return undefined;
    }
  }

  tokensToBurn(
    totalSupply: bigint,
    allocation: bigint,
    tokensToMigrate: bigint,
  ): bigint | undefined {
    // Check if the subtraction would underflow
    if (totalSupply < allocation) {
      return undefined;
    }

    const remaining_supply = totalSupply - allocation;

    // Check if the second subtraction would underflow
    if (remaining_supply < tokensToMigrate) {
      return undefined;
    }

    return remaining_supply - tokensToMigrate;
  }

  migrationFee(): bigint {
    return BigInt(4_000_000_000); // migration fee, 4 sol fixed for now
  }

  calculateCurvePrice(
    coefA: BigNumber,
    coefB: BigNumber,
    curvePosition: bigint,
    collateralDecimalsNr: number,
    tokenDecimalsNr: number,
  ): bigint | undefined {
    const collateralDecimals = new BigNumber(10).pow(collateralDecimalsNr);
    const tokenDecimals = new BigNumber(10).pow(tokenDecimalsNr);
    const x = new BigNumber(curvePosition.toString());

    const price = coefA
      .multipliedBy(x)
      .dividedBy(tokenDecimals)
      .plus(coefB)
      .multipliedBy(collateralDecimals);
    try {
      return BigInt(price.toFixed(0));
    } catch (e) {
      return undefined;
    }
  }

  getCoefA(
    coefB: BigNumber,
    totalSupply: bigint,
    decimalNr: number,
    marketcapThreshold: bigint,
    marketcapDecimalNr: number,
  ): BigNumber {
    const tokenDecimals = new BigNumber(10).pow(decimalNr);
    const marketcapDecimals = new BigNumber(10).pow(marketcapDecimalNr);

    // Get dynamic threshold
    const dynamicThreshold = new BigNumber(
      this.dynamicThreshold.toString(),
    ).dividedBy(100);

    // Get dynamic threshold in whole tokens
    const dynamicThresholdInWholeUnit = new BigNumber(totalSupply.toString())
      .multipliedBy(dynamicThreshold)
      .dividedBy(tokenDecimals);

    const marketcapThresholdInWholeUnit = new BigNumber(
      marketcapThreshold.toString(),
    ).dividedBy(marketcapDecimals);

    return marketcapThresholdInWholeUnit
      .dividedBy(dynamicThresholdInWholeUnit)
      .minus(coefB)
      .dividedBy(dynamicThresholdInWholeUnit);
  }

  getCoefB(coefBMinimalUnits: bigint, collateralDecimalsNr: number): BigNumber {
    return new BigNumber(String(coefBMinimalUnits)).dividedBy(
      new BigNumber(10).pow(collateralDecimalsNr),
    );
  }
}
