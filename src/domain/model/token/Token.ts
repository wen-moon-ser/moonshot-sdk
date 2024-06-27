import { InitTokenOptions } from './InitTokenOptions';
import { Moonshot } from '../moonshot';

export class Token {
  private moonshot: Moonshot;

  private mintAddress: string;

  constructor(options: InitTokenOptions) {
    this.moonshot = options.moonshot;
    this.mintAddress = options.mintAddress;
  }
}
