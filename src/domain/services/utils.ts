export const imagePathToBase64 = (input: string | File): Promise<string> => {
  return new Promise((resolve, reject) => {
    if (typeof window !== 'undefined' && input instanceof File) {
      // Browser environment
      const reader = new FileReader();
      // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
      reader.onloadend = () => {
        resolve(reader.result as string);
      };
      reader.onerror = reject;
      reader.readAsDataURL(input);
    } else if (typeof input === 'string') {
      // Node.js environment
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const { readFileSync } = require('fs');
      try {
        const imageBuffer = readFileSync(input);
        resolve(imageBuffer.toString('base64'));
      } catch (error) {
        reject(error);
      }
    } else {
      reject(new Error('Invalid input type'));
    }
  });
};
