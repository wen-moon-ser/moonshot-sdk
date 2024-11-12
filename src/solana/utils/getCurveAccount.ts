import { PublicKey } from '@solana/web3.js';
import { TokenLaunchpadIdl } from '../program';
import { CurveAccount } from '../../domain';
import { convertBNtoBigInt } from './convertBNToBigInt';
import { convertContractEnums } from './convertContractCurrency';
import { BaseAnchorProvider } from '../provider';

export async function getCurveAccount(
  provider: BaseAnchorProvider<TokenLaunchpadIdl>,
  mintAddress: string,
): Promise<CurveAccount> {
  const [curveAccountKey] = PublicKey.findProgramAddressSync(
    [Buffer.from('token'), new PublicKey(mintAddress).toBytes()],
    provider.program.programId,
  );

  const curveAccount =
    await // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (provider.program.account as any).curveAccount.fetch(
      curveAccountKey,
      provider.commitment,
    );

  if (curveAccount == null) {
    throw new Error('Curve account data not found');
  }
  const account = convertBNtoBigInt(curveAccount) as CurveAccount;
  return convertContractEnums(account);
}
