import { InitTokenOptions } from './InitTokenOptions';
import { Moonshot } from '../moonshot';
import { PrepareTxOptions } from './PrepareTxOptions';
import { GetCollateralPriceOptions } from './GetCollateralPriceOptions';
import { GetTokenAmountOptions } from './GetTokenAmountOptions';
import { GetCollateralAmountOptions } from './GetCollateralAmountOptions';

export class Token {
  private moonshot: Moonshot;

  private mintAddress: string;

  constructor(options: InitTokenOptions) {
    this.moonshot = options.moonshot;
    this.mintAddress = options.mintAddress;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  getCollateralPrice(options?: GetCollateralPriceOptions): Promise<string> {
    throw new Error('unimplemented');
  }

  getCurvePosition(): Promise<string> {
    throw Error('unimplemented');
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  getTokenAmountByCollateral(options: GetTokenAmountOptions): Promise<string> {
    throw new Error('unimplemented');
  }

  getCollateralAmountByTokens(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    options: GetCollateralAmountOptions,
  ): Promise<string> {
    throw new Error('unimplemented');
  }

  prepareTx(
    options: PrepareTxOptions,
  ): Promise<{ transaction: string; token: string }> {
    return this.moonshot.apiAdapter.prepareBuy(this.mintAddress, {
      creatorPK: options.creatorPK,
      amount: options.tokenAmount,
      slippageBps: options.slippageBps,
      collateralAmount: options.collateralAmount,
    });
  }
}
