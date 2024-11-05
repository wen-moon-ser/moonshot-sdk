export interface SubmitMintTxOptions {
  /**
   * ID of a draft Token from prepare tx call
   * */
  tokenId: string;

  /**
   * Validity token
   * */
  token: string;

  /**
   * Transaction signed by creator wallet
   * */
  signedTransaction: string;
}
