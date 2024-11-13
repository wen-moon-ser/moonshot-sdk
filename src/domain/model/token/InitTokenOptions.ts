import { CurveType } from '@heliofi/launchpad-common';
import { Moonshot } from '../moonshot';

export interface InitTokenOptions {
  mintAddress: string;
  moonshot: Moonshot;
  curveType?: CurveType;
  collateralCollected?: bigint;
  priceIncrease?: number;
}
