import { AbstractCurveAdapter } from './AbstractCurveAdapter';
import { CurveAccount } from './CurveAccount';
import { ContractCurveType } from '@heliofi/launchpad-common';
import { ConstantProductCurveV1Adapter } from './ConstantProductCurveV1Adapter';
import { LinearCurveV1Adapter } from './LinearCurveV1Adapter';
import { BaseAnchorProvider, TokenLaunchpadIdl } from '../../../solana';
import { FlatCurveV1Adapter } from './FlatCurveV1Adapter';
import { ConstantProductCurveV2Adapter } from './ConstantProductCurveV2Adapter';

export const getCurveAdapter = (
  curveAccount: CurveAccount,
  programProvider: BaseAnchorProvider<TokenLaunchpadIdl>,
  mintAddress: string,
): AbstractCurveAdapter => {
  switch (curveAccount.curveType) {
    case ContractCurveType.CONSTANT_PRODUCT_V1:
      return new ConstantProductCurveV1Adapter(programProvider, mintAddress);
    case ContractCurveType.CONSTANT_PRODUCT_V2:
      return new ConstantProductCurveV2Adapter(programProvider, mintAddress);
    case ContractCurveType.LINEAR_V1:
      return new LinearCurveV1Adapter(programProvider, mintAddress);
    case ContractCurveType.FLAT_V1:
      return new FlatCurveV1Adapter(
        programProvider,
        mintAddress,
        curveAccount.marketcapThreshold,
      );
    default:
      throw new Error('Unsupported curve type');
  }
};
