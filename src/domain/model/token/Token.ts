import { PreloadedToken } from './PreloadedToken';
import { BaseToken } from './BaseToken';

export class Token extends BaseToken {
  /**
   * Preload the token with chain data to be able to use synchronous methods
   * getCollateralAmountByTokensSync and getTokenAmountByCollateralSync
   * */
  preload(): Promise<PreloadedToken> {
    return PreloadedToken.init({
      mintAddress: this.mintAddress,
      moonshot: this.moonshot,
    });
  }
}
