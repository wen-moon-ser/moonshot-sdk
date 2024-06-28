import BigNumber from 'bignumber.js';
import { CurveType } from '../constants';
import {
  CalculatePriceOptions,
  CalculateTokensOptions,
  GetCollateralPriceOptions,
  GetPriceForCurvePositionOptions,
  GetTokensNrFromCollateralOptions,
} from './types';

export abstract class BaseCurve {
  dynamicThreshold: number;

  curveLimit: number;

  curveType: CurveType;

  getCollateralPrice(options: GetCollateralPriceOptions): bigint {
    const coefB = this.getCoefB(options.coefB, options.collateralDecimalsNr);
    const coefA = this.getCoefA(
      coefB,
      options.totalSupply,
      options.tokenDecimalsNr,
      options.marketCapThreshold,
      options.marketCapDecimalsNr,
    );

    const collateralPrice = this.calculateCostForNTokens({
      coefA,
      coefB,
      nAmount: options.tokensAmount,
      curvePosition: options.curvePosition,
      decimalsNr: options.tokenDecimalsNr,
      collateralDecimalsNr: options.collateralDecimalsNr,
    });

    if (!collateralPrice) {
      throw new Error('Expected collateral amount is 0 or undefined!');
    }
    return collateralPrice;
  }

  getTokensNrFromCollateral(options: GetTokensNrFromCollateralOptions): bigint {
    const coefB = this.getCoefB(options.coefB, options.collateralDecimalsNr);
    const coefA = this.getCoefA(
      coefB,
      options.totalSupply,
      options.tokenDecimalsNr,
      options.marketCapThreshold,
      options.marketCapDecimalsNr,
    );

    const tokensNr = this.calculateTokensNrFromCollateral({
      coefA,
      coefB,
      collateralAmount: options.collateralAmount,
      curvePosition: options.curvePosition,
      decimalsNr: options.tokenDecimalsNr,
      collateralDecimalsNr: options.collateralDecimalsNr,
      tradeDirection: options.direction,
    });

    if (!tokensNr) {
      throw new Error('Expected collateral amount is 0 or undefined!');
    }
    return tokensNr;
  }

  getPriceForCurvePosition(options: GetPriceForCurvePositionOptions): bigint {
    const coefB = this.getCoefB(options.coefB, options.collateralDecimalsNr);
    const coefA = this.getCoefA(
      coefB,
      options.totalSupply,
      options.tokenDecimalsNr,
      options.marketCapThreshold,
      options.marketCapDecimalsNr,
    );

    const price = this.calculateCurvePrice(
      coefA,
      coefB,
      options.curvePosition,
      options.collateralDecimalsNr,
      options.tokenDecimalsNr,
    );

    if (price === undefined) {
      throw new Error('Price cannot be calculated!');
    }
    return price;
  }

  abstract calculateCostForNTokens(
    options: CalculatePriceOptions,
  ): bigint | undefined;

  abstract calculateTokensNrFromCollateral(
    options: CalculateTokensOptions,
  ): bigint | undefined;

  abstract tokensToMigrate(
    coefA: BigNumber,
    coefB: BigNumber,
    allocation: bigint,
    decimalsNr: number,
    migrationFee: number,
  ): bigint | undefined;

  abstract tokensToBurn(
    totalSupply: bigint,
    allocation: bigint,
    tokensToMigrate: bigint,
  ): bigint | undefined;

  abstract migrationFee(): bigint;

  abstract calculateCurvePrice(
    coefA: BigNumber,
    coefB: BigNumber,
    curvePosition: bigint,
    collateralDecimals: number,
    tokenDecimals: number,
  ): bigint | undefined;

  abstract getCoefA(
    coef_b: BigNumber,
    totalSupply: bigint,
    decimalNr: number,
    marketcapThreshold: bigint,
    marketcapDecimalNr: number,
  ): BigNumber;

  abstract getCoefB(
    coefBMinimalUnits: bigint,
    collateralDecimalsNr: number,
  ): BigNumber;
}
