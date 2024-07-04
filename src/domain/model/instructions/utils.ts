import { BN } from '@coral-xyz/anchor';

export const convertBigIntToBN = (bigInt: bigint): BN => {
  return new BN(String(bigInt));
};
