import { Environment } from '../../domain';
import { ApiClient } from '../http';
import {
  CreateMintResponse,
  CreateMintWithMetadataDto,
  MintTxPrepareDto,
  MintTxPrepareResponse,
  MintTxSubmitDto,
  MintTxSubmitResponse,
} from '@heliofi/launchpad-common';

export class MoonshotApiAdapter {
  private apiClient: ApiClient;

  constructor(
    private token: string,
    private env: Environment,
  ) {
    const apiBasePath =
      env === Environment.MAINNET
        ? 'https://api.mintlp.io/v1'
        : 'http://localhost:8080/v1';
    this.apiClient = new ApiClient({ apiBasePath });
  }

  async createMint(
    prepareBuyDto: CreateMintWithMetadataDto,
  ): Promise<CreateMintResponse> {
    return this.apiClient.authedRequest(
      `/mint/create/metadata/sdk`,
      this.token,
      {
        method: 'POST',
        data: prepareBuyDto,
      },
    );
  }

  async prepareMint(
    pairId: string,
    prepareBuyDto: MintTxPrepareDto,
  ): Promise<MintTxPrepareResponse> {
    return this.apiClient.authedRequest(
      `/mint/tx/prepare/${pairId}/sdk`,
      this.token,
      {
        method: 'POST',
        data: prepareBuyDto,
      },
    );
  }

  submitMint(submitDto: MintTxSubmitDto): Promise<MintTxSubmitResponse> {
    return this.apiClient.authedRequest(`/mint/tx/submit/sdk`, this.token, {
      method: 'POST',
      data: submitDto,
    });
  }
}
