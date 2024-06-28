export enum CurrencyType {
  FIAT = 'FIAT',
  DIGITAL = 'DIGITAL',
}

export enum DefaultCurrencies {
  SOL = 'SOL',
}

export const toDefaultCurrency = (currency: string): DefaultCurrencies => {
  if (currency === 'SOL') {
    return DefaultCurrencies.SOL;
  }
  throw new Error(`Currency ${currency} is not supported`);
};
