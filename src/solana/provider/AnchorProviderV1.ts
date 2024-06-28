import { TokenLaunchpadIdl, tokenLaunchpadIdlV1, programId } from '../program';
import { BaseAnchorProvider } from './BaseAnchorProvider';

export class AnchorProviderV1 extends BaseAnchorProvider<TokenLaunchpadIdl> {
  constructor(connectionStr: string) {
    super(connectionStr, tokenLaunchpadIdlV1, programId);
  }

  get version(): string {
    return 'V1';
  }
}
