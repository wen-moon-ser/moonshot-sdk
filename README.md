# moonshot-sdk

## Initial spec

```typescript
import { Moonshot } from '@wen-moon-ser/moonshot-sdk';

const rpcUrl = 'https://api.mainnet-beta.solana.com';

const moonshot = new Moonshot({
  rpcUrl,
  authToken: 'YOUR_AUTH_TOKEN',
  environment: Environment.MAINNET,
});

const token = moonshot.Token({
  mintAddress: 'HLzCwHi19PkUGmasU1naAYMuigsbTsHcj4egDdhd24s1',
});

const curvePos = await token.getCurvePosition();
console.log(curvePos); // Prints the current curve position
```
