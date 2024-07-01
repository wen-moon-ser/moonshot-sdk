import { ContractCurrency } from '@heliofi/launchpad-common';

export type CurrencyDecimals = {
  [key in ContractCurrency]: number;
};

export const currencyDecimals: CurrencyDecimals = {
  [ContractCurrency.SOL]: 9,
};
