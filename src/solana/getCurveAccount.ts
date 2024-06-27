import { Program } from '@coral-xyz/anchor';
import { PublicKey } from '@solana/web3.js';
import { TokenLaunchpadIdl } from './program';

export async function getCurveAccount(
  program: Program<TokenLaunchpadIdl>,
  mintAddress: string,
): Promise<any> {
  // any for now, we'll have to create the type later
  const [curveAccountKey] = PublicKey.findProgramAddressSync(
    [Buffer.from('token'), new PublicKey(mintAddress).toBytes()],
    program.programId,
  );

  return program.account.curveAccount.fetch(curveAccountKey);
}
