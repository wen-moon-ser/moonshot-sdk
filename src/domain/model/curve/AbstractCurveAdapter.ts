import {
  GetCollateralAmountOptions,
  GetCollateralPriceOptions,
  GetTokenAmountOptions,
} from '../token';
import { CurveAccount } from './CurveAccount';
import { Program } from '@coral-xyz/anchor';
import { getCurveAccount, TokenLaunchpadIdl } from '../../../solana';
import { calculateCurvePosition } from '../../../solana/utils/calculateCurvePosition';

export abstract class AbstractCurveAdapter {
  constructor(
    protected moonshotProgram: Program<TokenLaunchpadIdl>,
    protected mintAddress: string,
  ) {}

  /**
   * @deprecated
   * you can get the collateral price by using getCollateralAmountByTokens and provide 1 as an input
   * */
  abstract getCollateralPrice(
    options: GetCollateralPriceOptions,
  ): Promise<bigint>;

  abstract getCollateralAmountByTokens(
    options: GetCollateralAmountOptions,
  ): Promise<bigint>;

  abstract getTokenAmountByCollateral(
    options: GetTokenAmountOptions,
  ): Promise<bigint>;

  async getCurveAccount(): Promise<CurveAccount> {
    return getCurveAccount(this.moonshotProgram, this.mintAddress);
  }

  async getCurvePosition(): Promise<bigint> {
    const curveState = await this.getCurveAccount();

    return calculateCurvePosition(
      curveState.totalSupply,
      curveState.curveAmount,
    );
  }
}
