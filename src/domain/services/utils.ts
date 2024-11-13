export const imagePathToBase64 = (filePath: string): Promise<string> => {
  // Check if we're in a Node.js environment
  if (typeof window === 'undefined') {
    // Use dynamic import() to prevent webpack from bundling
    return new Promise((resolve, reject) => {
      import('fs')
        .then((fs) => {
          try {
            const imageBuffer = fs.readFileSync(filePath);
            resolve(imageBuffer.toString('base64'));
          } catch (error) {
            reject(error);
          }
        })
        .catch(reject);
    });
  }
  throw new Error('imagePathToBase64 is only available in Node.js environment');
};
