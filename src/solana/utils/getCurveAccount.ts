import { Program } from '@coral-xyz/anchor';
import { PublicKey } from '@solana/web3.js';
import { TokenLaunchpadIdl } from '../program';
import { CurveAccount } from '../../domain/model/curve/CurveAccount';
import { convertBNtoBigInt } from './convertBNToBigInt';

export async function getCurveAccount(
  program: Program<TokenLaunchpadIdl>,
  mintAddress: string,
): Promise<CurveAccount> {
  const [curveAccountKey] = PublicKey.findProgramAddressSync(
    [Buffer.from('token'), new PublicKey(mintAddress).toBytes()],
    program.programId,
  );

  const curveAccount =
    await program.account.curveAccount.fetch(curveAccountKey);

  if (curveAccount == null) {
    throw new Error('Curve account data not found');
  }
  return convertBNtoBigInt(curveAccount) as CurveAccount;
}
