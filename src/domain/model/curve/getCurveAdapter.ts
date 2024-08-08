import { AbstractCurveAdapter } from './AbstractCurveAdapter';
import { CurveAccount } from './CurveAccount';
import { ContractCurveType } from '@heliofi/launchpad-common';
import { ConstantProductCurveV1Adapter } from './ConstantProductCurveV1Adapter';
import { LinearCurveV1Adapter } from './LinearCurveV1Adapter';
import { Program } from '@coral-xyz/anchor';
import { TokenLaunchpadIdl } from '../../../solana';

export const getCurveAdapter = (
  curveAccount: CurveAccount,
  moonshotProgram: Program<TokenLaunchpadIdl>,
  mintAddress: string,
): AbstractCurveAdapter => {
  switch (curveAccount.curveType) {
    case ContractCurveType.CONSTANT_PRODUCT_V1:
      return new ConstantProductCurveV1Adapter(moonshotProgram, mintAddress);
    case ContractCurveType.LINEAR_V1:
      return new LinearCurveV1Adapter(moonshotProgram, mintAddress);
    default:
      throw new Error('Unsupported curve type');
  }
};
