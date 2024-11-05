import { GetCollateralAmountOptions } from './GetCollateralAmountOptions';

export interface GetCollateralAmountSyncOptions
  extends GetCollateralAmountOptions {
  curvePosition: bigint;
}
