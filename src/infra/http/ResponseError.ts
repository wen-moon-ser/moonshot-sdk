import { AxiosResponse } from 'axios';

export class ResponseError extends Error {
  public response: AxiosResponse;

  public message: string;

  constructor(response: AxiosResponse, message: string) {
    super(response.statusText);
    this.response = response;
    this.message = message;
    Object.setPrototypeOf(this, ResponseError.prototype);
  }
}
