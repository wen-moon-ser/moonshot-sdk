import { Idl } from '@coral-xyz/anchor';
import { PublicKey } from '@solana/web3.js';
import idl from './tokenLaunchpadIdlV4';

export const programId = new PublicKey(idl.address);
export const tokenLaunchpadIdlV4 = idl as TokenLaunchpadIdl;

export type TokenLaunchpadIdl = Idl;
