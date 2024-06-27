import { AxiosRequestConfig } from 'axios';
import { BaseApiClient } from './BaseApiClient';
import { authedRequest, publicRequest } from './utils';

export class ApiClient extends BaseApiClient {
  protected readonly apiBasePath: string;

  constructor(options: { apiBasePath: string }) {
    super();
    this.apiBasePath = options.apiBasePath;
  }

  public authedRequest = <T>(
    endpoint: string,
    token: string,
    options: AxiosRequestConfig = {},
    shouldParseJSON = true,
  ): Promise<T> =>
    authedRequest<T>(
      this.apiBasePath,
      endpoint,
      token,
      options,
      shouldParseJSON,
    );

  public publicRequest = <T>(
    endpoint: string,
    options: AxiosRequestConfig = {},
    shouldParseJSON = true,
  ): Promise<T> =>
    publicRequest<T>(this.apiBasePath, endpoint, options, shouldParseJSON);
}
