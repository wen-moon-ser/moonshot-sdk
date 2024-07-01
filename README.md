# moonshot-sdk

## Initial spec

```typescript
import { Moonshot } from '@wen-moon-ser/moonshot-sdk';

const rpcUrl = 'https://api.mainnet-beta.solana.com';
const minimalPrice = 10n;

const moonshot = new Moonshot({
    rpcUrl,
    authToken: 'YOUR_AUTH_TOKEN',
    environment: Environment.MAINNET,
});

const token = moonshot.Token({
    mintAddress: 'AhaAKM3dUKAeYoZCTXF8fqqbjcvugbgEmst6557jkZ9h',
});

const curvePos = await token.getCurvePosition();
```
