import { InitTokenOptions } from './InitTokenOptions';
import { Moonshot } from '../moonshot';
import { getCurveAccount } from '../../../solana';
import { getCurveAdapter } from '../curve';
import { AbstractCurveAdapter } from '../curve/AbstractCurveAdapter';
import { GetCollateralAmountSyncOptions } from './GetCollateralAmountSyncOptions';
import { GetTokenAmountSyncOptions } from './GetTokenAmountSyncOptions';
import { ITokenPreloadedOperations } from './ITokenPreloadedOperations';
import { BaseToken } from './BaseToken';

/**
 * PreloadedToken extends Token class in its functionality
 * And allows synchronous
 * This helps to avoid async calls even when the curve position is known
 * */
export class PreloadedToken
  extends BaseToken
  implements ITokenPreloadedOperations
{
  protected moonshot: Moonshot;

  protected readonly mintAddress: string;

  protected _curveAdapter: AbstractCurveAdapter;

  private constructor(
    options: InitTokenOptions,
    curveAdapter: AbstractCurveAdapter,
  ) {
    super(options);
    this.moonshot = options.moonshot;
    this.mintAddress = options.mintAddress;
    this._curveAdapter = curveAdapter;
  }

  static async init(options: InitTokenOptions): Promise<PreloadedToken> {
    const curveAccount = await getCurveAccount(
      options.moonshot.provider,
      options.mintAddress,
    );
    const curveAdapter = getCurveAdapter(
      curveAccount,
      options.moonshot.provider,
      options.mintAddress,
    );
    return new PreloadedToken(options, curveAdapter);
  }

  get curveAdapterSync(): AbstractCurveAdapter {
    return this._curveAdapter;
  }

  getCollateralAmountByTokensSync(
    options: GetCollateralAmountSyncOptions,
  ): bigint {
    return this.curveAdapterSync.getCollateralAmountByTokensSync(options);
  }

  getTokenAmountByCollateralSync(options: GetTokenAmountSyncOptions): bigint {
    return this.curveAdapterSync.getTokenAmountByCollateralSync(options);
  }
}
