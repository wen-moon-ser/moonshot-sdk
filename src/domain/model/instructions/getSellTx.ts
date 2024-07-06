import {
  ASSOCIATED_TOKEN_PROGRAM_ID,
  getAssociatedTokenAddress,
  TOKEN_PROGRAM_ID,
} from '@solana/spl-token';
import {
  PublicKey,
  SystemProgram,
  TransactionInstruction,
} from '@solana/web3.js';
import { TokenLaunchpadIdl } from '../../../solana';
import { BN, Program } from '@coral-xyz/anchor';
import { convertBigIntToBN } from './utils';
import { dexFeeAccount, helioFeeAccount } from '../feeAccounts';
import { TradeRequest } from './types';

export const getSellTx = async (
  program: Program<TokenLaunchpadIdl>,
  req: TradeRequest,
): Promise<TransactionInstruction> => {
  const { sender, mint, curveAccount } = req;

  const [configAccount] = PublicKey.findProgramAddressSync(
    [Buffer.from('config_account')],
    program.programId,
  );

  const senderTokenAccount = await getAssociatedTokenAddress(
    mint,
    sender,
    true,
  );

  const curveTokenAccount = await getAssociatedTokenAddress(
    mint,
    curveAccount,
    true,
  );

  const data = {
    amount: convertBigIntToBN(req.tokenAmount),
    collateralAmount: convertBigIntToBN(req.collateralAmount),
    slippageBps: new BN(req.slippageBps),
  };

  return program.methods
    .sell(data)
    .accounts({
      sender,
      senderTokenAccount,
      curveAccount,
      curveTokenAccount,
      mint,
      configAccount,
      dexFee: dexFeeAccount,
      helioFee: helioFeeAccount,
      tokenProgram: TOKEN_PROGRAM_ID,
      associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
      systemProgram: SystemProgram.programId,
    })
    .instruction();
};
