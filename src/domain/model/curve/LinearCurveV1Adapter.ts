import {
  GetCollateralPriceOptions,
  GetCollateralAmountOptions,
  GetTokenAmountOptions,
} from '../token';
import { AbstractCurveAdapter } from './AbstractCurveAdapter';
import { LinearCurveV1, TradeDirection } from '@heliofi/launchpad-common';
import { calculateCurvePosition } from '../../../solana/utils/calculateCurvePosition';
import { currencyDecimals } from '../currency';

export class LinearCurveV1Adapter extends AbstractCurveAdapter {
  private readonly curve = new LinearCurveV1();

  async getCollateralPrice(
    options: GetCollateralPriceOptions,
  ): Promise<bigint> {
    const curveState = await this.getCurveAccount();

    const {
      curveAmount,
      collateralCurrency,
      marketcapCurrency,
      totalSupply,
      marketcapThreshold,
      coefB,
      decimals,
    } = curveState;

    const { tokenAmount } = options;

    const curvePosition = calculateCurvePosition(
      totalSupply,
      curveAmount,
      options.curvePosition,
    );

    const price = this.curve.getCollateralPrice({
      collateralDecimalsNr: currencyDecimals[collateralCurrency],
      tokenDecimalsNr: decimals,
      marketCapDecimalsNr: currencyDecimals[marketcapCurrency],
      totalSupply,
      marketCapThreshold: marketcapThreshold,
      tokensAmount: tokenAmount,
      curvePosition,
      coefB: BigInt(coefB),
    });

    return BigInt(price.toFixed(0));
  }

  async getCollateralAmountByTokens(
    options: GetCollateralAmountOptions,
  ): Promise<bigint> {
    const curveState = await this.getCurveAccount();

    const {
      curveAmount,
      collateralCurrency,
      marketcapCurrency,
      totalSupply,
      marketcapThreshold,
      coefB,
      decimals,
    } = curveState;

    const { tokenAmount } = options;

    const currentCurvePosition = calculateCurvePosition(
      totalSupply,
      curveAmount,
      options.curvePosition,
    );

    const curvePosition =
      options.tradeDirection === TradeDirection.SELL
        ? currentCurvePosition - tokenAmount
        : currentCurvePosition;

    if (curvePosition < 0n) {
      throw new Error('Insufficient tokens amount');
    }

    const price = this.curve.getCollateralPrice({
      collateralDecimalsNr: currencyDecimals[collateralCurrency],
      tokenDecimalsNr: decimals,
      marketCapDecimalsNr: currencyDecimals[marketcapCurrency],
      totalSupply,
      marketCapThreshold: marketcapThreshold,
      tokensAmount: tokenAmount,
      curvePosition,
      coefB: BigInt(coefB),
    });
    return BigInt(price.toFixed(0));
  }

  getCollateralAmountByTokensSync(): bigint {
    throw new Error('Method not supported for this curve type.');
  }

  getTokenAmountByCollateralSync(): bigint {
    throw new Error('Method not implemented.');
  }

  async getTokenAmountByCollateral(
    options: GetTokenAmountOptions,
  ): Promise<bigint> {
    const curveState = await this.getCurveAccount();

    const { collateralAmount } = options;

    const {
      curveAmount,
      collateralCurrency,
      marketcapCurrency,
      totalSupply,
      marketcapThreshold,
      coefB,
      decimals,
    } = curveState;

    const curvePosition = calculateCurvePosition(
      totalSupply,
      curveAmount,
      options.curvePosition,
    );

    return this.curve.getTokensNrFromCollateral({
      collateralAmount,
      collateralDecimalsNr: currencyDecimals[collateralCurrency],
      tokenDecimalsNr: decimals,
      marketCapDecimalsNr: currencyDecimals[marketcapCurrency],
      totalSupply: totalSupply,
      marketCapThreshold: marketcapThreshold,
      curvePosition,
      coefB: BigInt(coefB),
      direction: options.tradeDirection as TradeDirection,
    });
  }
}
