import { Environment } from '../environment';
import { ConfirmOptions } from '@solana/web3.js';

export interface InitMoonshotOptions {
  rpcUrl: string;
  authToken?: string;
  chainOptions?: {
    solana: {
      confirmOptions?: ConfirmOptions;
    };
  };
  environment: Environment;
}
