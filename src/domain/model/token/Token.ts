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
    if (curveState == null) {
      throw new Error('Curve account data not found');
    }

    const tokensAmount = BigInt(options.tokensAmount);

    const curvePosition =
      curveState.curvePosition ?? (curveState.curvePosition as bigint);

    const {
      collateralDecimalsNr,
      tokenDecimalsNr,
      marketCapDecimalsNr,
      totalSupply,
      marketCapThreshold,
      coefB,
    } = curveState;

    return this.curve.getCollateralPrice({
      collateralDecimalsNr,
      tokenDecimalsNr,
      marketCapDecimalsNr,
      totalSupply,
      marketCapThreshold,
      tokensAmount,
      curvePosition,
      coefB,
    });
  }

  async getCurvePosition(): Promise<bigint> {
    const curveState = await getCurveAccount(
      this.moonshot.provider.program,
      this.mintAddress,
    );
    if (curveState == null) {
      throw new Error('Curve account data not found');
    }

    return curveState.curvePosition ?? (curveState.curvePosition as bigint);
  }

  async getTokenAmountByCollateral(
    options: GetTokenAmountOptions,
  ): Promise<bigint> {
    const curveState = await getCurveAccount(
      this.moonshot.provider.program,
      this.mintAddress,
    );
    if (curveState == null) {
      throw new Error('Curve account data not found');
    }

    const collateralAmount = BigInt(options.collateralAmount);

    const curvePosition =
      curveState.curvePosition ?? (curveState.curvePosition as bigint);

    const {
      collateralDecimalsNr,
      tokenDecimalsNr,
      marketCapDecimalsNr,
      totalSupply,
      marketCapThreshold,
      coefB,
    } = curveState;

    return this.curve.getTokensNrFromCollateral({
      collateralAmount,
      collateralDecimalsNr,
      tokenDecimalsNr,
      marketCapDecimalsNr,
      totalSupply: totalSupply,
      marketCapThreshold,
      curvePosition,
      coefB: coefB,
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
    if (curveState == null) {
      throw new Error('Curve account data not found');
    }

    const tokensAmount = BigInt(options.tokensAmount);

    const currentCurvePosition =
      curveState.curvePosition ?? (curveState.curvePosition as bigint);

    const curvePosition =
      options.tradeDirection === TradeDirection.SELL
        ? currentCurvePosition - tokensAmount
        : currentCurvePosition;

    if (curvePosition < 0n) {
      throw new Error('Insufficient tokens amount');
    }

    const {
      collateralDecimalsNr,
      tokenDecimalsNr,
      marketCapDecimalsNr,
      totalSupply,
      marketCapThreshold,
      coefB,
    } = curveState;

    return this.curve.getCollateralPrice({
      collateralDecimalsNr,
      tokenDecimalsNr,
      marketCapDecimalsNr,
      totalSupply,
      marketCapThreshold,
      tokensAmount,
      curvePosition,
      coefB,
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
