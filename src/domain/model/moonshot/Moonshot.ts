import { InitMoonshotOptions } from './InitMoonshotOptions';
import { Environment } from '../environment';
import { InitTokenOptions, Token } from '../token';
import {
  TokenLaunchpadIdl,
  AnchorProviderV1,
  BaseAnchorProvider,
} from '../../../solana';
import { MoonshotApiAdapter } from '../../../infra';
import { PrepareMintTxOptions } from './PrepareMintTxOptions';
import { PrepareMintTxResponse } from './PrepareMintTxResponse';
import { SubmitMintTxOptions } from './SubmitMintTxOptions';
import { SubmitMintTxResponse } from './SubmitMintTxResponse';

export class Moonshot {
  private environment: Environment;

  private apiAdapter: MoonshotApiAdapter;

  provider: BaseAnchorProvider<TokenLaunchpadIdl>;

  constructor(options: InitMoonshotOptions) {
    this.provider = new AnchorProviderV1(
      options.rpcUrl,
      options.chainOptions?.solana?.confirmOptions,
    );
    this.environment = options.environment;
    this.apiAdapter = new MoonshotApiAdapter(
      options.authToken ?? '',
      this.environment,
    );
  }

  Token(options: Omit<InitTokenOptions, 'moonshot'>): Token {
    return new Token({ ...options, moonshot: this });
  }

  async prepareMintTx(
    options: PrepareMintTxOptions,
  ): Promise<PrepareMintTxResponse> {
    const createMintRes = await this.apiAdapter.createMint({
      ...options,
    });

    const res = await this.apiAdapter.prepareMint(createMintRes.pairId, {
      amount: options.tokenAmount,
      creatorPK: options.creator,
    });

    return {
      token: res.token,
      tokenId: createMintRes.pairId,
      transaction: res.transaction,
    };
  }

  async submitMintTx(
    options: SubmitMintTxOptions,
  ): Promise<SubmitMintTxResponse> {
    const res = await this.apiAdapter.submitMint(options);
    return {
      txSignature: res.transactionSignature,
      status: res.status,
    };
  }
}
