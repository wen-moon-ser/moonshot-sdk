import { GetTokenAmountOptions } from './GetTokenAmountOptions';

export interface GetTokenAmountSyncOptions extends GetTokenAmountOptions {
  curvePosition: bigint;
}
