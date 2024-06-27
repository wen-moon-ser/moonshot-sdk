import { AxiosRequestConfig } from 'axios';

export abstract class BaseApiClient {
  abstract authedRequest<T>(
    endpoint: string,
    token: string,
    options?: AxiosRequestConfig,
    shouldParseJSON?: boolean,
  ): Promise<T>;

  abstract publicRequest<T>(
    endpoint: string,
    options?: AxiosRequestConfig,
    shouldParseJSON?: boolean,
  ): Promise<T>;
}
