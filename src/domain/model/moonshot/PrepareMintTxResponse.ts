export interface PrepareMintTxResponse {
  /**
   * ID of the draft token
   */
  tokenId: string;

  /**
   * Serialized transaction to be signed
   */
  transaction: string;

  /**
   * Token identifier for checking the validity of the request
   */
  token: string;
}
