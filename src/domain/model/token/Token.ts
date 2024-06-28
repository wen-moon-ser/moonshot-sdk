import { InitTokenOptions } from './InitTokenOptions';
import { Moonshot } from '../moonshot';
import { PrepareTxOptions } from './PrepareTxOptions';
import { GetCollateralPriceOptions } from './GetCollateralPriceOptions';
import { GetTokenAmountOptions } from './GetTokenAmountOptions';
import { GetCollateralAmountOptions } from './GetCollateralAmountOptions';
import {
  BaseCurve,
  LinearCurveV1,
  TradeDirection,
} from '@heliofi/launchpad-common';
import { getCurveAccount } from '../../../solana';
import { currencyDecimals } from '../currency/CurrencyDecimals';
import { calculateCurvePosition } from '../../../solana/utils/calculateCurvePosition';

export class Token {
  private moonshot: Moonshot;

  private mintAddress: string;

  private curve: BaseCurve;

  constructor(options: InitTokenOptions) {
    this.moonshot = options.moonshot;
    this.mintAddress = options.mintAddress;
    this.curve = new LinearCurveV1(); // Add different curve types when implemented
  }

  async getCollateralPrice(
    options: GetCollateralPriceOptions,
  ): Promise<bigint> {
    const curveState = await getCurveAccount(
      this.moonshot.provider.program,
      this.mintAddress,
    );

    const {
      curveAmount,
      collateralCurrency,
      marketcapCurrency,
      totalSupply,
      marketcapThreshold,
      coefB,
      decimals,
    } = curveState;

    const { tokensAmount } = options;

    const curvePosition = calculateCurvePosition(
      totalSupply,
      curveAmount,
      options.curvePosition,
    );

    return this.curve.getCollateralPrice({
      collateralDecimalsNr: currencyDecimals[collateralCurrency],
      tokenDecimalsNr: decimals,
      marketCapDecimalsNr: currencyDecimals[marketcapCurrency],
      totalSupply,
      marketCapThreshold: marketcapThreshold,
      tokensAmount,
      curvePosition,
      coefB: BigInt(coefB),
    });
  }

  async getCurvePosition(): Promise<bigint> {
    const curveState = await getCurveAccount(
      this.moonshot.provider.program,
      this.mintAddress,
    );
    return calculateCurvePosition(
      curveState.totalSupply,
      curveState.curveAmount,
    );
  }

  async getTokenAmountByCollateral(
    options: GetTokenAmountOptions,
  ): Promise<bigint> {
    const curveState = await getCurveAccount(
      this.moonshot.provider.program,
      this.mintAddress,
    );

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
      direction: options.tradeDirection,
    });
  }

  async getCollateralAmountByTokens(
    options: GetCollateralAmountOptions,
  ): Promise<bigint> {
    const curveState = await getCurveAccount(
      this.moonshot.provider.program,
      this.mintAddress,
    );

    const {
      curveAmount,
      collateralCurrency,
      marketcapCurrency,
      totalSupply,
      marketcapThreshold,
      coefB,
      decimals,
    } = curveState;

    const { tokensAmount } = options;

    const currentCurvePosition = calculateCurvePosition(
      totalSupply,
      curveAmount,
      options.curvePosition,
    );

    const curvePosition =
      options.tradeDirection === TradeDirection.SELL
        ? currentCurvePosition - tokensAmount
        : currentCurvePosition;

    if (curvePosition < 0n) {
      throw new Error('Insufficient tokens amount');
    }

    return this.curve.getCollateralPrice({
      collateralDecimalsNr: currencyDecimals[collateralCurrency],
      tokenDecimalsNr: decimals,
      marketCapDecimalsNr: currencyDecimals[marketcapCurrency],
      totalSupply,
      marketCapThreshold: marketcapThreshold,
      tokensAmount,
      curvePosition,
      coefB: BigInt(coefB),
    });
  }

  prepareTx(
    options: PrepareTxOptions,
  ): Promise<{ transaction: string; token: string }> {
    return options.tradeDirection === TradeDirection.SELL
      ? this.moonshot.apiAdapter.prepareSell(this.mintAddress, {
          creatorPK: options.creatorPK,
          amount: options.tokenAmount,
          slippageBps: options.slippageBps,
          collateralAmount: options.collateralAmount,
        })
      : this.moonshot.apiAdapter.prepareBuy(this.mintAddress, {
          creatorPK: options.creatorPK,
          amount: options.tokenAmount,
          slippageBps: options.slippageBps,
          collateralAmount: options.collateralAmount,
        });
  }
}
