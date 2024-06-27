import { BaseApiClient } from '../http';
import {
  BuyTxPrepareDto,
  BuyTxPrepareResponse,
  SellTxPrepareDto,
  SellTxPrepareResponse,
} from '@heliofi/launchpad-common';

export class LaunchpadApiAdapter {
  constructor(
    private apiClient: BaseApiClient,
    private token: string,
  ) {}

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
