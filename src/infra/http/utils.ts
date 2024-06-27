import axios, { AxiosHeaders, AxiosRequestConfig, AxiosResponse } from 'axios';
import { NoContent } from './NoContent';
import { ResponseError } from './ResponseError';

type ErrorMessage = {
  message: string;
};

export type FetchOptions = RequestInit & {
  clearContentType?: boolean;
};

const bearerAuth = (token?: string): AxiosHeaders | undefined => {
  return token
    ? new AxiosHeaders().set('Authorization', `Bearer ${token}`)
    : undefined;
};

const enhanceOptions = (
  options: AxiosRequestConfig,
  token?: string,
): AxiosRequestConfig => {
  if (options.headers == null) {
    options.headers = new AxiosHeaders();
  }

  if (!(options.headers as AxiosHeaders).has('Content-Type')) {
    (options.headers as AxiosHeaders).set('Content-Type', 'application/json');
  }
  options.headers = (options.headers as AxiosHeaders).concat(bearerAuth(token));
  return options;
};

const parseJSON = async <T>(response: AxiosResponse): Promise<T> => {
  if (response.status === 204 || response.status === 205) {
    return new NoContent() as T;
  }
  return response.data;
};

const validateStatus = async (response: AxiosResponse): Promise<void> => {
  if (response.status >= 200 && response.status < 300) {
    return;
  }
  const errorResult: ErrorMessage = await response.data;
  console.error(response.data);
  console.error(response.data.message);
  throw new ResponseError(
    response,
    errorResult?.message || response.statusText,
  );
};

export const request = async <T>(
  url: string,
  options?: AxiosRequestConfig,
  shouldParseJSON = true,
): Promise<T> => {
  if (shouldParseJSON) {
    const response = await axios(url, {
      ...options,
      validateStatus: () => true,
    });
    await validateStatus(response);
    return parseJSON(response);
  }
  return axios(url, options);
};

export const authedRequest = async <T>(
  apiBasePath: string,
  endpoint: string,
  token: string,
  options: AxiosRequestConfig = {},
  shouldParseJSON = true,
): Promise<T> => {
  return request<T>(
    `${apiBasePath}${endpoint}`,
    enhanceOptions(options, token),
    shouldParseJSON,
  );
};

export const publicRequest = async <T>(
  apiBasePath: string,
  endpoint: string,
  options: AxiosRequestConfig = {},
  shouldParseJSON = true,
): Promise<T> => {
  return request<T>(
    `${apiBasePath}${endpoint}`,
    enhanceOptions(options),
    shouldParseJSON,
  );
};
