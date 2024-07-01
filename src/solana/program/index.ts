import { Idl } from '@coral-xyz/anchor';
import { PublicKey } from '@solana/web3.js';
import idl from './tokenLaunchpadIdlV1';

export const programId = new PublicKey(idl.metadata.address);
export const tokenLaunchpadIdlV1 = idl as TokenLaunchpadIdl;

export type TokenLaunchpadIdl = Idl & {
  metadata: {
    address: string;
  };
};
