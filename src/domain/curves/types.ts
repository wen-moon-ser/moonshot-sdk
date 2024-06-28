import BigNumber from 'bignumber.js';
import { CurveType, DefaultCurrencies, TradeDirection } from '../constants';

export type CurveDefaults = {
  tokenDecimals: number;
  type: CurveType;
  feeBps: number;
  totalSupply: bigint;
  minAllocationTokenAmount: bigint;
  maxAllocationTokenAmount: bigint;
  marketCapThreshold: bigint;
  address: string;
  coefB: bigint;
};

export enum ContractCurrency {
  SOL = 0,
}

export enum ContractCurveType {
  LINEAR_V1 = 0,
}

export const toContractCurrency = (
  currency: DefaultCurrencies,
): ContractCurrency => {
  switch (currency) {
    case DefaultCurrencies.SOL:
      return ContractCurrency.SOL;
    default:
      throw new Error(`Unknown curve type: ${currency}`);
  }
};

export const toContractCurveType = (
  curveType: CurveType,
): ContractCurveType => {
  switch (curveType) {
    case CurveType.LINEAR_V1:
      return ContractCurveType.LINEAR_V1;
    default:
      throw new Error(`Unknown curve type: ${curveType}`);
  }
};

export interface CalculatePriceOptions {
  coefA: BigNumber;
  coefB: BigNumber;
  nAmount: bigint;
  curvePosition: bigint;
  decimalsNr: number;
  collateralDecimalsNr: number;
}

export interface CalculateTokensOptions {
  coefA: BigNumber;
  coefB: BigNumber;
  collateralAmount: bigint;
  curvePosition: bigint;
  decimalsNr: number;
  collateralDecimalsNr: number;
  tradeDirection?: TradeDirection;
}

export interface GetTokensNrFromCollateralOptions {
  collateralAmount: bigint;
  collateralDecimalsNr: number;
  tokenDecimalsNr: number;
  marketCapDecimalsNr: number;
  totalSupply: bigint;
  marketCapThreshold: bigint;
  curvePosition: bigint;
  coefB: bigint;
  direction?: TradeDirection;
}

export interface GetPriceForCurvePositionOptions {
  collateralDecimalsNr: number;
  tokenDecimalsNr: number;
  marketCapDecimalsNr: number;
  totalSupply: bigint;
  marketCapThreshold: bigint;
  curvePosition: bigint;
  coefB: bigint;
}
