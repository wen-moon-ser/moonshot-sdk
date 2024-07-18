import 'reflect-metadata';
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
import { getCurveAccount, TokenLaunchpadIdl } from '../../../solana';
import { currencyDecimals } from '../currency';
import { calculateCurvePosition } from '../../../solana/utils/calculateCurvePosition';
import { PublicKey, TransactionInstruction } from '@solana/web3.js';
import { Program } from '@coral-xyz/anchor';
import { getBuyTx, getSellTx, TradeRequest } from '../instructions';
import { CurveAccount } from '../curve';

export class Token {
  private moonshot: Moonshot;

  private mintAddress: string;

  private curve: BaseCurve;

  constructor(options: InitTokenOptions) {
    this.moonshot = options.moonshot;
    this.mintAddress = options.mintAddress;
    this.curve = new LinearCurveV1(); // Add different curve types when implemented
  }

  async getCurveAccount(): Promise<CurveAccount> {
    return getCurveAccount(this.moonshot.provider.program, this.mintAddress);
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

    const { tokenAmount } = options;

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
      tokensAmount: tokenAmount,
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
      direction: options.tradeDirection as TradeDirection,
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

    return this.curve.getCollateralPrice({
      collateralDecimalsNr: currencyDecimals[collateralCurrency],
      tokenDecimalsNr: decimals,
      marketCapDecimalsNr: currencyDecimals[marketcapCurrency],
      totalSupply,
      marketCapThreshold: marketcapThreshold,
      tokensAmount: tokenAmount,
      curvePosition,
      coefB: BigInt(coefB),
    });
  }

  async prepareIxs(
    options: PrepareTxOptions,
  ): Promise<{ ixs: TransactionInstruction[] }> {
    const program = this.moonshot.provider.program;

    const {
      tokenAmount,
      collateralAmount,
      slippageBps,
      creatorPK,
      tradeDirection,
    } = options;

    const curveAccountPK = this.deriveCurveAddress(program);

    const req: TradeRequest = {
      tokenAmount,
      collateralAmount,
      slippageBps,
      sender: new PublicKey(creatorPK),
      curveAccount: new PublicKey(curveAccountPK),
      mint: new PublicKey(this.mintAddress),
    };
    return {
      ixs: [await this.getTradeInstruction(program, req, tradeDirection)],
    };
  }

  private async getTradeInstruction(
    program: Program<TokenLaunchpadIdl>,
    req: TradeRequest,
    direction: 'BUY' | 'SELL',
  ): Promise<TransactionInstruction> {
    if (direction === 'BUY') {
      return getBuyTx(program, req);
    }
    return getSellTx(program, req);
  }

  private deriveCurveAddress(program: Program<TokenLaunchpadIdl>): string {
    const [address] = PublicKey.findProgramAddressSync(
      [Buffer.from('token'), new PublicKey(this.mintAddress).toBytes()],
      program.programId,
    );
    return address.toBase58();
  }
}
