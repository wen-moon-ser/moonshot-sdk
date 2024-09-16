import { GetCollateralAmountOptions } from './GetCollateralAmountOptions';
import { AbstractCurveAdapter } from '../curve/AbstractCurveAdapter';

export interface GetCollateralAmountSyncOptions
  extends GetCollateralAmountOptions {
  curvePosition: bigint;
  curveAdapter: AbstractCurveAdapter;
}
