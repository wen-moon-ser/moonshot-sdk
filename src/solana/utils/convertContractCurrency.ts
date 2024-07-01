import { ContractCurrency } from '@heliofi/launchpad-common';
import { CurveAccount } from '../../domain/model/curve/CurveAccount';

export function convertContractCurrency(
  curveAccount: CurveAccount,
): CurveAccount {
  if (!curveAccount || !curveAccount.marketcapCurrency) {
    throw new Error('Invalid curve account');
  }

  // TODO: refactor
  let keys = Object.keys(curveAccount.marketcapCurrency);
  if (keys.length > 0 && keys[0].toLowerCase() === 'sol') {
    curveAccount.marketcapCurrency = ContractCurrency.SOL;
  } else {
    throw new Error(
      `Unknown marketcap currency: ${curveAccount.marketcapCurrency}`,
    );
  }

  keys = Object.keys(curveAccount.collateralCurrency);
  if (keys.length > 0 && keys[0].toLowerCase() === 'sol') {
    curveAccount.collateralCurrency = ContractCurrency.SOL;
  } else {
    throw new Error(
      `Unknown collateral currency: ${curveAccount.marketcapCurrency}`,
    );
  }

  return curveAccount;
}
