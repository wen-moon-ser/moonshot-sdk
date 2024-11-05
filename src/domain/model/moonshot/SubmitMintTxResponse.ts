import { TxStatus } from '@heliofi/launchpad-common';

export interface SubmitMintTxResponse {
  /**
   * Main signature of the transaction
   */
  txSignature: string;

  /**
   * Status of the transaction
   */
  status: TxStatus.SUCCESS | TxStatus.FAILED | TxStatus.PENDING;
}
