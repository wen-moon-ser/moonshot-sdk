import { GetCollateralAmountSyncOptions } from './GetCollateralAmountSyncOptions';
import { GetTokenAmountSyncOptions } from './GetTokenAmountSyncOptions';

export interface ITokenPreloadedOperations {
  getCollateralAmountByTokensSync(
    options: GetCollateralAmountSyncOptions,
  ): bigint;

  getTokenAmountByCollateralSync(options: GetTokenAmountSyncOptions): bigint;
}
