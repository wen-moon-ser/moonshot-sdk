export function calculateCurvePosition(
  totalSupply: bigint,
  curveAmount: bigint,
  optionsCurvePosition?: bigint,
): bigint {
  return optionsCurvePosition != null
    ? BigInt(optionsCurvePosition)
    : totalSupply - curveAmount;
}
