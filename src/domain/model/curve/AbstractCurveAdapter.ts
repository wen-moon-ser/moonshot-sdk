import {
  GetCollateralAmountOptions,
  GetCollateralPriceOptions,
  GetTokenAmountOptions,
} from '../token';
import { CurveAccount } from './CurveAccount';
import {
  BaseAnchorProvider,
  getCurveAccount,
  TokenLaunchpadIdl,
} from '../../../solana';
import { calculateCurvePosition } from '../../../solana/utils/calculateCurvePosition';

export abstract class AbstractCurveAdapter {
  constructor(
    protected moonshotProgram: BaseAnchorProvider<TokenLaunchpadIdl>,
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

  abstract getCollateralAmountByTokensSync(
    options: GetCollateralAmountOptions & { curvePosition: bigint },
  ): bigint;

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
