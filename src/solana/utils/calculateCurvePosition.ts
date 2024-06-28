export function calculateCurvePosition(
  totalSupply: bigint,
  curveAmount: bigint,
  optionsCurvePosition?: bigint,
): bigint {
  return optionsCurvePosition
    ? BigInt(optionsCurvePosition)
    : totalSupply - curveAmount;
}
