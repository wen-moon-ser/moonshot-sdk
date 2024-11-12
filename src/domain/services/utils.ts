export const imagePathToBase64 = (input: string): string => {
  return Buffer.from(input).toString('base64'); // TODO: check how to do file without fs so it is browser compatible
};
