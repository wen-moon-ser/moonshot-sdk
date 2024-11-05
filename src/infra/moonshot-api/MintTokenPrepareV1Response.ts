/**
 * Response interface for token preparation endpoint
 */
export interface MintTokenPrepareV1Response {
  /**
   * ID of the draft token
   */
  draftTokenId: string;

  /**
   * Serialized transaction to be signed
   */
  transaction: string;

  /**
   * Token identifier for checking the validity of the request
   */
  token: string;
}
