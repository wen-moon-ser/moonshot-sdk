import { Idl } from '@coral-xyz/anchor';
import { PublicKey } from '@solana/web3.js';
import { IDL_V4 } from './tokenLaunchpadIdlV4';

export const programId = new PublicKey(IDL_V4.metadata.address);
export const tokenLaunchpadIdlV4 = IDL_V4 as TokenLaunchpadIdl;

export type TokenLaunchpadIdl = Idl;
