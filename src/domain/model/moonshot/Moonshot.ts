import { InitMoonshotOptions } from './InitMoonshotOptions';
import { Environment } from '../environment';
import { InitTokenOptions, Token } from '../token';
import {
  TokenLaunchpadIdl,
  AnchorProviderV1,
  BaseAnchorProvider,
} from '../../../solana';

export class Moonshot {
  private environment: Environment;

  provider: BaseAnchorProvider<TokenLaunchpadIdl>;

  constructor(options: InitMoonshotOptions) {
    this.provider = new AnchorProviderV1(
      options.rpcUrl,
      options.chainOptions?.solana?.confirmOptions,
    );
    this.environment = options.environment;
  }

  Token(options: Omit<InitTokenOptions, 'moonshot'>): Token {
    return new Token({ ...options, moonshot: this });
  }
}
