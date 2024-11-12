export default {
  address: 'Br3UKo2Jij17LoaTeA9XbHYeXBKRNeRWiVcJpnXksXTM',
  metadata: {
    name: 'token_launchpad',
    version: '0.1.0',
    spec: '0.1.0',
    description: 'Created with Anchor',
    address: 'Br3UKo2Jij17LoaTeA9XbHYeXBKRNeRWiVcJpnXksXTM',
  },
  instructions: [
    {
      name: 'buy',
      discriminator: [102, 6, 61, 18, 1, 218, 235, 234],
      accounts: [
        {
          name: 'sender',
          writable: true,
          signer: true,
        },
        {
          name: 'sender_token_account',
          writable: true,
        },
        {
          name: 'curve_account',
          writable: true,
        },
        {
          name: 'curve_token_account',
          writable: true,
        },
        {
          name: 'dex_fee',
          writable: true,
        },
        {
          name: 'helio_fee',
          writable: true,
        },
        {
          name: 'mint',
        },
        {
          name: 'config_account',
        },
        {
          name: 'token_program',
        },
        {
          name: 'associated_token_program',
        },
        {
          name: 'system_program',
        },
      ],
      args: [
        {
          name: 'data',
          type: {
            defined: {
              name: 'TradeParams',
            },
          },
        },
      ],
    },
    {
      name: 'config_init',
      discriminator: [13, 236, 164, 173, 106, 253, 164, 185],
      accounts: [
        {
          name: 'config_authority',
          writable: true,
          signer: true,
        },
        {
          name: 'config_account',
          writable: true,
        },
        {
          name: 'system_program',
        },
      ],
      args: [
        {
          name: 'data',
          type: {
            defined: {
              name: 'ConfigParams',
            },
          },
        },
      ],
    },
    {
      name: 'config_update',
      discriminator: [80, 37, 109, 136, 82, 135, 89, 241],
      accounts: [
        {
          name: 'config_authority',
          signer: true,
        },
        {
          name: 'config_account',
          writable: true,
        },
      ],
      args: [
        {
          name: 'data',
          type: {
            defined: {
              name: 'ConfigParams',
            },
          },
        },
      ],
    },
    {
      name: 'migrate_funds',
      discriminator: [42, 229, 10, 231, 189, 62, 193, 174],
      accounts: [
        {
          name: 'backend_authority',
          docs: ['BE Authority'],
          signer: true,
        },
        {
          name: 'migration_authority',
          docs: [
            'Migration Authority',
            'Owner and Payer over Token Accounts, needs to be mutable',
          ],
          writable: true,
          signer: true,
        },
        {
          name: 'curve_account',
          docs: [
            'Curve Account',
            'The account is closed after this instruction',
          ],
          writable: true,
        },
        {
          name: 'curve_token_account',
          docs: [
            'Curve Token Account',
            'The account is closed after this instruction',
          ],
          writable: true,
        },
        {
          name: 'migration_authority_token_account',
          docs: ['Authority token Account', 'Init on demand'],
          writable: true,
        },
        {
          name: 'mint',
          docs: [
            'InterfaceAccount: checks program ownership + deserialize into Mint',
          ],
          writable: true,
        },
        {
          name: 'dex_fee_account',
          writable: true,
        },
        {
          name: 'helio_fee_account',
          writable: true,
        },
        {
          name: 'config_account',
        },
        {
          name: 'system_program',
        },
        {
          name: 'token_program',
        },
        {
          name: 'associated_token_program',
        },
      ],
      args: [],
    },
    {
      name: 'sell',
      discriminator: [51, 230, 133, 164, 1, 127, 131, 173],
      accounts: [
        {
          name: 'sender',
          writable: true,
          signer: true,
        },
        {
          name: 'sender_token_account',
          writable: true,
        },
        {
          name: 'curve_account',
          writable: true,
        },
        {
          name: 'curve_token_account',
          writable: true,
        },
        {
          name: 'dex_fee',
          writable: true,
        },
        {
          name: 'helio_fee',
          writable: true,
        },
        {
          name: 'mint',
        },
        {
          name: 'config_account',
        },
        {
          name: 'token_program',
        },
        {
          name: 'associated_token_program',
        },
        {
          name: 'system_program',
        },
      ],
      args: [
        {
          name: 'data',
          type: {
            defined: {
              name: 'TradeParams',
            },
          },
        },
      ],
    },
    {
      name: 'token_mint',
      discriminator: [3, 44, 164, 184, 123, 13, 245, 179],
      accounts: [
        {
          name: 'sender',
          writable: true,
          signer: true,
        },
        {
          name: 'backend_authority',
          signer: true,
        },
        {
          name: 'curve_account',
          writable: true,
        },
        {
          name: 'mint',
          writable: true,
          signer: true,
        },
        {
          name: 'mint_metadata',
          docs: [
            'Type validating that the account is owned by the System Program = uninitialized',
            'seeds should ensure that the address is correct',
          ],
          writable: true,
        },
        {
          name: 'curve_token_account',
          writable: true,
        },
        {
          name: 'config_account',
        },
        {
          name: 'token_program',
        },
        {
          name: 'associated_token_program',
        },
        {
          name: 'mpl_token_metadata',
        },
        {
          name: 'system_program',
        },
      ],
      args: [
        {
          name: 'mint_params',
          type: {
            defined: {
              name: 'TokenMintParams',
            },
          },
        },
      ],
    },
  ],
  accounts: [
    {
      name: 'ConfigAccount',
      discriminator: [189, 255, 97, 70, 186, 189, 24, 102],
    },
    {
      name: 'CurveAccount',
      discriminator: [8, 91, 83, 28, 132, 216, 248, 22],
    },
  ],
  events: [
    {
      name: 'MigrationEvent',
      discriminator: [255, 202, 76, 147, 91, 231, 73, 22],
    },
    {
      name: 'TradeEvent',
      discriminator: [189, 219, 127, 211, 78, 230, 97, 238],
    },
  ],
  errors: [
    {
      code: 6000,
      name: 'InsufficientBalance',
      msg: 'Insufficient SOL to pay for the transaction.',
    },
    {
      code: 6001,
      name: 'InvalidAmount',
      msg: 'The amount must be available in the curve .',
    },
    {
      code: 6002,
      name: 'InvalidSlippage',
      msg: 'The slippage must be under 100 percent.',
    },
    {
      code: 6003,
      name: 'SlippageOverflow',
      msg: 'The cost amount is not in the allowed slippage interval.',
    },
    {
      code: 6004,
      name: 'ThresholdReached',
      msg: 'Threshold limit exceeded.',
    },
    {
      code: 6005,
      name: 'InvalidTokenAccount',
      msg: 'Trade disabled, market cap threshold reached.',
    },
    {
      code: 6006,
      name: 'InvalidCurveAccount',
      msg: 'Invalid curve account.',
    },
    {
      code: 6007,
      name: 'InvalidFeeAccount',
      msg: 'Invalid fee account address.',
    },
    {
      code: 6008,
      name: 'CurveLimit',
      msg: 'Curve limit exceeded.',
    },
    {
      code: 6009,
      name: 'InvalidCurveType',
      msg: 'Invalid curve type.',
    },
    {
      code: 6010,
      name: 'InvalidCurrency',
      msg: 'Invalid currency.',
    },
    {
      code: 6011,
      name: 'Arithmetics',
      msg: 'Artithmetics error',
    },
    {
      code: 6012,
      name: 'ThresholdNotHit',
      msg: 'Market Cap threshold not hit, cannot migrate funds yet',
    },
    {
      code: 6013,
      name: 'InvalidAuthority',
      msg: 'Invalid Authority provided.',
    },
    {
      code: 6014,
      name: 'TradeAmountTooLow',
      msg: 'Trade amount too low , resulting in 0 costs',
    },
    {
      code: 6015,
      name: 'ConfigFieldMissing',
      msg: 'Config field needs to be present during initialization',
    },
    {
      code: 6016,
      name: 'DifferentCurrencies',
      msg: 'Unsupported different currency types',
    },
    {
      code: 6017,
      name: 'BasisPointTooHigh',
      msg: 'Basis points too high',
    },
    {
      code: 6018,
      name: 'FeeShareTooHigh',
      msg: 'Fee share too High',
    },
    {
      code: 6019,
      name: 'TokenDecimalsOutOfRange',
      msg: 'Token decimals are not within the supported range',
    },
    {
      code: 6020,
      name: 'TokenNameTooLong',
      msg: 'Token Name too long, max supported length is 32 bytes',
    },
    {
      code: 6021,
      name: 'TokenSymbolTooLong',
      msg: 'Token Symbol too long, max supported length is 10 bytes',
    },
    {
      code: 6022,
      name: 'TokenURITooLong',
      msg: 'Token URI too long, max supported length is 200 bytes',
    },
    {
      code: 6023,
      name: 'IncorrectDecimalPlacesBounds',
      msg: 'Minimum Decimal Places cannot be lower than Maximum Decimal Places',
    },
    {
      code: 6024,
      name: 'IncorrectTokenSupplyBounds',
      msg: 'Minimum Token Supply cannot be lower than Maximum Token Supply',
    },
    {
      code: 6025,
      name: 'TotalSupplyOutOfBounds',
      msg: 'Token Total Supply out of bounds',
    },
    {
      code: 6026,
      name: 'FinalCollateralTooLow',
      msg: 'This setup will produce final collateral amount less than the migration fee',
    },
    {
      code: 6027,
      name: 'CoefficientZero',
      msg: 'One of the Coefficients is equal to ZERO',
    },
    {
      code: 6028,
      name: 'MarketCapThresholdTooLow',
      msg: 'Market cap Threshold under the Hard lower bound limits',
    },
    {
      code: 6029,
      name: 'CoefBOutofBounds',
      msg: 'Default coef_b set out of hard limit bounds',
    },
    {
      code: 6030,
      name: 'IncorrectMarketCap',
      msg: 'For Constant Product the Market Cap threshold cannot be higher than 325 SOL',
    },
    {
      code: 6031,
      name: 'IncorrectDecimals',
      msg: 'For Constant Product the Decimal places cannot be other than 9',
    },
    {
      code: 6032,
      name: 'IncorrectMaxSupply',
      msg: 'For Constant Product the Maximal Token Supply cannot be other than 1_000_000_000',
    },
    {
      code: 6033,
      name: 'MarketCapTooHigh',
      msg: 'Market Cap Threshold set too high, will not be hit even if Curve Hard Limit reached',
    },
    {
      code: 6034,
      name: 'InvalidMigrationTarget',
      msg: 'This Migration Target is not supported!',
    },
    {
      code: 6035,
      name: 'General',
      msg: 'General error',
    },
  ],
  types: [
    {
      name: 'ConfigAccount',
      type: {
        kind: 'struct',
        fields: [
          {
            name: 'migration_authority',
            type: 'pubkey',
          },
          {
            name: 'backend_authority',
            type: 'pubkey',
          },
          {
            name: 'config_authority',
            type: 'pubkey',
          },
          {
            name: 'helio_fee',
            type: 'pubkey',
          },
          {
            name: 'dex_fee',
            type: 'pubkey',
          },
          {
            name: 'fee_bps',
            type: 'u16',
          },
          {
            name: 'dex_fee_share',
            type: 'u8',
          },
          {
            name: 'migration_fee',
            type: 'u64',
          },
          {
            name: 'linear_curve_mcap_threshold',
            type: 'u64',
          },
          {
            name: 'marketcap_currency',
            type: {
              defined: {
                name: 'Currency',
              },
            },
          },
          {
            name: 'min_supported_decimal_places',
            type: 'u8',
          },
          {
            name: 'max_supported_decimal_places',
            type: 'u8',
          },
          {
            name: 'min_supported_token_supply',
            type: 'u64',
          },
          {
            name: 'max_supported_token_supply',
            type: 'u64',
          },
          {
            name: 'bump',
            type: 'u8',
          },
          {
            name: 'coef_b',
            type: 'u32',
          },
          {
            name: 'constant_product_v1_mcap_threshold',
            type: 'u64',
          },
          {
            name: 'constant_product_v2_mcap_threshold',
            type: 'u64',
          },
        ],
      },
    },
    {
      name: 'ConfigParams',
      type: {
        kind: 'struct',
        fields: [
          {
            name: 'migration_authority',
            type: {
              option: 'pubkey',
            },
          },
          {
            name: 'backend_authority',
            type: {
              option: 'pubkey',
            },
          },
          {
            name: 'config_authority',
            type: {
              option: 'pubkey',
            },
          },
          {
            name: 'helio_fee',
            type: {
              option: 'pubkey',
            },
          },
          {
            name: 'dex_fee',
            type: {
              option: 'pubkey',
            },
          },
          {
            name: 'fee_bps',
            type: {
              option: 'u16',
            },
          },
          {
            name: 'dex_fee_share',
            type: {
              option: 'u8',
            },
          },
          {
            name: 'migration_fee',
            type: {
              option: 'u64',
            },
          },
          {
            name: 'linear_curve_mcap_threshold',
            type: {
              option: 'u64',
            },
          },
          {
            name: 'marketcap_currency',
            type: {
              option: 'u8',
            },
          },
          {
            name: 'min_supported_decimal_places',
            type: {
              option: 'u8',
            },
          },
          {
            name: 'max_supported_decimal_places',
            type: {
              option: 'u8',
            },
          },
          {
            name: 'min_supported_token_supply',
            type: {
              option: 'u64',
            },
          },
          {
            name: 'max_supported_token_supply',
            type: {
              option: 'u64',
            },
          },
          {
            name: 'coef_b',
            type: {
              option: 'u32',
            },
          },
          {
            name: 'constant_product_v1_mcap_threshold',
            type: {
              option: 'u64',
            },
          },
          {
            name: 'constant_product_v2_mcap_threshold',
            type: {
              option: 'u64',
            },
          },
        ],
      },
    },
    {
      name: 'Currency',
      repr: {
        kind: 'rust',
      },
      type: {
        kind: 'enum',
        variants: [
          {
            name: 'Sol',
          },
        ],
      },
    },
    {
      name: 'CurveAccount',
      type: {
        kind: 'struct',
        fields: [
          {
            name: 'total_supply',
            type: 'u64',
          },
          {
            name: 'curve_amount',
            type: 'u64',
          },
          {
            name: 'mint',
            type: 'pubkey',
          },
          {
            name: 'decimals',
            type: 'u8',
          },
          {
            name: 'collateral_currency',
            type: {
              defined: {
                name: 'Currency',
              },
            },
          },
          {
            name: 'curve_type',
            type: {
              defined: {
                name: 'CurveType',
              },
            },
          },
          {
            name: 'marketcap_threshold',
            type: 'u64',
          },
          {
            name: 'marketcap_currency',
            type: {
              defined: {
                name: 'Currency',
              },
            },
          },
          {
            name: 'migration_fee',
            type: 'u64',
          },
          {
            name: 'coef_b',
            type: 'u32',
          },
          {
            name: 'bump',
            type: 'u8',
          },
          {
            name: 'migration_target',
            type: {
              defined: {
                name: 'MigrationTarget',
              },
            },
          },
          {
            name: 'price_increase',
            type: 'u16',
          },
        ],
      },
    },
    {
      name: 'CurveType',
      repr: {
        kind: 'rust',
      },
      type: {
        kind: 'enum',
        variants: [
          {
            name: 'LinearV1',
          },
          {
            name: 'ConstantProductV1',
          },
          {
            name: 'ConstantProductV2',
          },
          {
            name: 'FlatCurveV1',
          },
        ],
      },
    },
    {
      name: 'MigrationEvent',
      type: {
        kind: 'struct',
        fields: [
          {
            name: 'tokens_migrated',
            type: 'u64',
          },
          {
            name: 'tokens_burned',
            type: 'u64',
          },
          {
            name: 'collateral_migrated',
            type: 'u64',
          },
          {
            name: 'fee',
            type: 'u64',
          },
          {
            name: 'label',
            type: 'string',
          },
        ],
      },
    },
    {
      name: 'MigrationTarget',
      repr: {
        kind: 'rust',
      },
      type: {
        kind: 'enum',
        variants: [
          {
            name: 'Raydium',
          },
          {
            name: 'Meteora',
          },
        ],
      },
    },
    {
      name: 'TokenMintParams',
      type: {
        kind: 'struct',
        fields: [
          {
            name: 'name',
            type: 'string',
          },
          {
            name: 'symbol',
            type: 'string',
          },
          {
            name: 'uri',
            type: 'string',
          },
          {
            name: 'decimals',
            type: 'u8',
          },
          {
            name: 'collateral_currency',
            type: 'u8',
          },
          {
            name: 'amount',
            type: 'u64',
          },
          {
            name: 'curve_type',
            type: 'u8',
          },
          {
            name: 'migration_target',
            type: 'u8',
          },
          {
            name: 'price_increase',
            type: 'u16',
          },
          {
            name: 'collateral_collected',
            type: 'u64',
          },
        ],
      },
    },
    {
      name: 'TradeEvent',
      type: {
        kind: 'struct',
        fields: [
          {
            name: 'amount',
            type: 'u64',
          },
          {
            name: 'collateral_amount',
            type: 'u64',
          },
          {
            name: 'dex_fee',
            type: 'u64',
          },
          {
            name: 'helio_fee',
            type: 'u64',
          },
          {
            name: 'allocation',
            type: 'u64',
          },
          {
            name: 'curve',
            type: 'pubkey',
          },
          {
            name: 'cost_token',
            type: 'pubkey',
          },
          {
            name: 'sender',
            type: 'pubkey',
          },
          {
            name: 'type_',
            type: {
              defined: {
                name: 'TradeType',
              },
            },
          },
          {
            name: 'label',
            type: 'string',
          },
        ],
      },
    },
    {
      name: 'TradeParams',
      type: {
        kind: 'struct',
        fields: [
          {
            name: 'token_amount',
            type: 'u64',
          },
          {
            name: 'collateral_amount',
            type: 'u64',
          },
          {
            name: 'fixed_side',
            type: 'u8',
          },
          {
            name: 'slippage_bps',
            type: 'u64',
          },
        ],
      },
    },
    {
      name: 'TradeType',
      type: {
        kind: 'enum',
        variants: [
          {
            name: 'Buy',
          },
          {
            name: 'Sell',
          },
        ],
      },
    },
  ],
};
