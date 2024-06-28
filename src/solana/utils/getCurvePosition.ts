import { PublicKey } from '@solana/web3.js';
import * as splToken from '@solana/spl-token';
import { getAssociatedTokenAddress } from '@solana/spl-token';
import { AnchorProviderV1 } from '../provider/AnchorProviderV1';

export async function getCurvePosition(
  provider: AnchorProviderV1,
  mintAddress: string,
  totalSupply: bigint,
): Promise<bigint> {
  const { connection, program } = provider;
  const [curveAddress] = PublicKey.findProgramAddressSync(
    [Buffer.from('token'), new PublicKey(mintAddress).toBytes()],
    program.programId,
  );

  const curveTokenAccount = await getAssociatedTokenAddress(
    new PublicKey(mintAddress),
    curveAddress,
    true,
  );

  const account = await splToken.getAccount(connection, curveTokenAccount);
  return totalSupply - account.amount;
}
