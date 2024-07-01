import { InitMoonshotOptions } from './InitMoonshotOptions';
import { Environment } from '../environment';
import { InitTokenOptions, Token } from '../token';
import { LaunchpadApiAdapter } from '../../../infra';
import { AnchorProviderV1, BaseAnchorProvider } from '../../../solana/provider';
import { TokenLaunchpadIdl } from '../../../solana';

export class Moonshot {
  private environment: Environment;

  provider: BaseAnchorProvider<TokenLaunchpadIdl>;

  apiAdapter: LaunchpadApiAdapter;

  constructor(options: InitMoonshotOptions) {
    this.provider = new AnchorProviderV1(options.rpcUrl);
    this.environment = options.environment;
    this.apiAdapter = new LaunchpadApiAdapter(
      options.authToken,
      this.environment,
    );
  }

  Token(options: Omit<InitTokenOptions, 'moonshot'>): Token {
    return new Token({ ...options, moonshot: this });
  }
}
