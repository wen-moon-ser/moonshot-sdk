import { Environment } from '../../domain';
import { ApiClient } from '../http';
import {
  BuyTxPrepareDto,
  BuyTxPrepareResponse,
  SellTxPrepareDto,
  SellTxPrepareResponse,
} from '@heliofi/launchpad-common';

export class LaunchpadApiAdapter {
  private apiClient: ApiClient;

  constructor(
    private token: string,
    env?: Environment,
  ) {
    const apiBasePath =
      env === Environment.MAINNET
        ? 'https://bot-api.moonshot.cc/v1/'
        : 'https://bot-api-dev.moonshot.cc/v1/';
    this.apiClient = new ApiClient({ apiBasePath });
  }

  async prepareBuy(
    mintAddress: string,
    prepareBuyDto: BuyTxPrepareDto,
  ): Promise<BuyTxPrepareResponse> {
    return this.apiClient.authedRequest(
      `buy/tx/prepare/${mintAddress}`,
      this.token,
      {
        method: 'POST',
        data: prepareBuyDto,
      },
    );
  }

  prepareSell(
    mintAddress: string,
    prepareSellDto: SellTxPrepareDto,
  ): Promise<SellTxPrepareResponse> {
    return this.apiClient.authedRequest(
      `sell/tx/prepare/${mintAddress}`,
      this.token,
      {
        method: 'POST',
        data: prepareSellDto,
      },
    );
  }
}
