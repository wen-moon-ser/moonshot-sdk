import { TokenLaunchpadIdl, tokenLaunchpadIdlV1, programId } from '../program';
import { BaseAnchorProvider } from './BaseAnchorProvider';
import { ConfirmOptions } from '@solana/web3.js';

export class AnchorProviderV1 extends BaseAnchorProvider<TokenLaunchpadIdl> {
  constructor(connectionStr: string, confirmOptions?: ConfirmOptions) {
    super(connectionStr, tokenLaunchpadIdlV1, programId, confirmOptions);
  }

  get version(): string {
    return 'V1';
  }
}
