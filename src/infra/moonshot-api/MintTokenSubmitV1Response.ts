import { TxStatus } from '@heliofi/launchpad-common';

/**
 * Response interface for token transaction submission
 */
export interface MintTokenSubmitV1Response {
  /**
   * Transaction hash
   */
  txnId: string;

  /**
   * Status of the transaction
   */
  status: TxStatus.SUCCESS | TxStatus.FAILED | TxStatus.PENDING;

  /**
   * Optional token status
   */
  statusToken?: string;
}
