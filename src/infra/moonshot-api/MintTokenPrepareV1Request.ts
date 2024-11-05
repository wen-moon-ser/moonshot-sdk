import { CurveType, MigrationDex } from '@heliofi/launchpad-common';

/**
 * Request interface for preparing token minting
 */
export interface MintTokenPrepareV1Request {
  /**
   * DEX Screener chain ID, for example: `solana`
   */
  chainId: 'solana';

  /**
   * Public key
   */
  creatorId: string;

  /**
   * Token name (immutable)
   * @maxLength 32
   */
  name: string;

  /**
   * Token symbol (immutable)
   * @maxLength 32
   */
  symbol: string;

  /**
   * Type of curve to use for token pricing
   * Currently only CONSTANT_PRODUCT_V1 is supported
   */
  curveType: CurveType.CONSTANT_PRODUCT_V1;

  /**
   * DEX to use for token migration
   */
  migrationDex: MigrationDex.RAYDIUM | MigrationDex.METEORA;

  /**
   * Token icon encoded in base64 format
   * @maxLength 2097152 (2MB)
   */
  icon: string;

  /**
   * Token description
   * @maxLength 2000
   * @optional
   */
  description?: string;

  /**
   * Token amount that will be initially bought. Maximum 80% of total supply. In atomic units.
   * @example "1000000000"
   * @optional
   */
  tokenAmount?: string;

  /**
   * Optional array of links associated with the token
   * @optional
   */
  links?: { url: string; label: string }[];

  /**
   * Token banner encoded in base64 format
   * @maxLength 5242880 (5MB)
   * @optional
   */
  banner?: string;

  affiliate?: {
    wallet: string; // Base58 wallet public key of affiliate
  };
}
