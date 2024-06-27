import { InitMoonshotOptions } from './InitMoonshotOptions';
import { Connection } from '@solana/web3.js';
import { Environment } from '../environment';
import { InitTokenOptions, Token } from '../token';
import { LaunchpadApiAdapter } from '../../../infra';

export class Moonshot {
  private connection: Connection;

  private environment: Environment;

  apiAdapter: LaunchpadApiAdapter;

  constructor(options: InitMoonshotOptions) {
    this.connection = new Connection(options.rpcUrl);
    this.environment = options.environment;
    this.apiAdapter = new LaunchpadApiAdapter(options.authToken);
  }

  Token(options: Omit<InitTokenOptions, 'moonshot'>): Token {
    return new Token({ ...options, moonshot: this });
  }
}
