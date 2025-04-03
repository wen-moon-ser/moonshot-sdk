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
import { PrepareMintTxOptions } from '../../domain/model/moonshot/PrepareMintTxOptions';
import { extractLinks } from '../../solana/utils/extractSocialLinks';

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
    prepareBuyDto: PrepareMintTxOptions,
  ): Promise<CreateMintResponse> {
    const links = extractLinks(prepareBuyDto.links);
    const data: CreateMintWithMetadataDto = {
      name: prepareBuyDto.name,
      symbol: prepareBuyDto.symbol,
      curveType: prepareBuyDto.curveType,
      migrationDex: prepareBuyDto.migrationDex,
      icon: prepareBuyDto.icon,
      description: prepareBuyDto.description,
      banner: prepareBuyDto.banner,
      affiliate: prepareBuyDto.affiliate,
      x: links.x,
      discord: links.discord,
      telegram: links.telegram,
      website: links.website,
    };

    return this.apiClient.authedRequest(
      `/mint/create/metadata/sdk`,
      this.token,
      {
        method: 'POST',
        data,
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
