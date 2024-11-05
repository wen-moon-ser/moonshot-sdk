/**
 * Request interface for submitting a signed token transaction
 */
export interface MintTokenSubmitV1Request {
  /**
   * Token identifier returned by POST /tokens/v1 endpoint
   */
  token: string;

  /**
   * Transaction returned by POST /tokens/v1/ endpoint and signed by the creator wallet
   */
  signedTransaction: string;
}
