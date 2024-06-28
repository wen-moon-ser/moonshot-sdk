/* eslint-disable @typescript-eslint/no-explicit-any */
import { BN } from '@coral-xyz/anchor';

export function convertBNtoBigInt(obj: any): any {
  const newObj = {} as any;
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      if (obj[key] instanceof BN) {
        newObj[key] = BigInt(obj[key].toString());
      } else {
        newObj[key] = obj[key];
      }
    }
  }

  return newObj;
}
