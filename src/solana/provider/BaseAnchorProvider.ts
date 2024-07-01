import { ConfirmOptions, Connection, Keypair } from '@solana/web3.js';
import * as anchor from '@coral-xyz/anchor';
import { AnchorProvider as Provider, Program, Wallet } from '@coral-xyz/anchor';

export abstract class BaseAnchorProvider<T extends anchor.Idl> {
  private txOpts: ConfirmOptions = {
    skipPreflight: false,
    commitment: 'confirmed',
    maxRetries: 5,
  };

  private readonly _program: Program<T>;

  private readonly _connection: Connection;

  protected constructor(
    protected connectionStr: string,
    protected IDL: T,
    protected PROGRAM_ID: anchor.web3.PublicKey,
  ) {
    this._connection = new Connection(connectionStr);
    this.setProvider();
    this._program = new Program<T>(this.IDL, this.PROGRAM_ID);
  }

  get program(): Program<T> {
    return this._program;
  }

  get connection(): Connection {
    return this._connection;
  }

  abstract get version(): string;

  private setProvider(): void {
    const keypair = new Keypair();
    const wallet = new Wallet(keypair);
    const provider = new Provider(this._connection, wallet, this.txOpts);
    anchor.setProvider(provider);
  }
}
