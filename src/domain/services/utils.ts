import { readFileSync } from 'fs';

export const imagePathToBase64 = (filePath: string): string => {
  const imageBuffer = readFileSync(filePath);

  return imageBuffer.toString('base64');
};
