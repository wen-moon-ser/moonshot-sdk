import { ContractCurrency, ContractCurveType } from '@heliofi/launchpad-common';
import { CurveAccount } from '../../domain';

export function convertContractEnums(curveAccount: CurveAccount): CurveAccount {
  if (!curveAccount || !curveAccount.marketcapCurrency) {
    throw new Error('Invalid curve account');
  }

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

  keys = Object.keys(curveAccount.curveType);
  if (keys.length === 0) {
    throw new Error(`Curve type is missing`);
  }

  switch (keys[0].toLowerCase()) {
    case 'linearv1':
      curveAccount.curveType = ContractCurveType.LINEAR_V1;
      break;
    case 'constantproductv1':
      curveAccount.curveType = ContractCurveType.CONSTANT_PRODUCT_V1;
      break;
    case 'constantproductv2':
      curveAccount.curveType = ContractCurveType.CONSTANT_PRODUCT_V2;
      break;
    case 'flatcurvev1':
      curveAccount.curveType = ContractCurveType.FLAT_V1;
      break;
    default:
      throw new Error(`Unknown curve type: ${curveAccount.curveType}`);
  }

  return curveAccount;
}
