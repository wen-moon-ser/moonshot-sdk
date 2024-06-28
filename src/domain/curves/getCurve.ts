import { CurveType } from '../constants';
import { BaseCurve } from './BaseCurve';
import { LinearCurveV1 } from './LinearCurveV1';

export const getCurve = (curveType: CurveType): BaseCurve => {
  if (curveType === CurveType.LINEAR_V1) {
    return new LinearCurveV1();
  }
  throw new Error('Curve type not supported');
};
