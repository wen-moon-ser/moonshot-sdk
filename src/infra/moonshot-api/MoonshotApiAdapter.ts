import { Environment } from '../../domain';
import { ApiClient } from '../http';
import { MintTokenPrepareV1Request } from './MintTokenPrepareV1Request';
import { MintTokenPrepareV1Response } from './MintTokenPrepareV1Response';
import { MintTokenSubmitV1Request } from './MintTokenSubmitV1Request';
import { MintTokenSubmitV1Response } from './MintTokenSubmitV1Response';
import { MoonshotApiChainId } from './MoonshotApiChainId';

export class MoonshotApiAdapter {
  private apiClient: ApiClient;

  constructor(
    private token: string,
    private env: Environment,
  ) {
    const apiBasePath =
      env === Environment.MAINNET
        ? 'https://api.moonshot.cc'
        : 'https://api-devnet.moonshot.cc';
    this.apiClient = new ApiClient({ apiBasePath });
  }

  async prepareMint(
    prepareBuyDto: Omit<MintTokenPrepareV1Request, 'chainId'>,
  ): Promise<MintTokenPrepareV1Response> {
    return this.apiClient.authedRequest(`/tokens/v1`, this.token, {
      method: 'POST',
      data: {
        ...prepareBuyDto,
        chainId:
          this.env === Environment.MAINNET
            ? MoonshotApiChainId.SOLANA_MAINNET
            : MoonshotApiChainId.SOLANA_DEVNET,
      },
    });
  }

  submitMint(
    draftTokenId: string,
    submitDto: MintTokenSubmitV1Request,
  ): Promise<MintTokenSubmitV1Response> {
    return this.apiClient.authedRequest(
      `/tokens/v1/${draftTokenId}/submit`,
      this.token,
      {
        method: 'POST',
        data: submitDto,
      },
    );
  }
}
