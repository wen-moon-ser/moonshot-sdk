import {
  MessageV0,
  VersionedMessage,
  VersionedTransaction,
} from '@solana/web3.js';

export class SolanaSerializationService {
  static serializeVersionedTransaction(
    transaction: VersionedTransaction,
  ): string {
    return Buffer.from(transaction.serialize()).toString('base64');
  }

  static deserializeVersionedTransaction(
    serializedTransaction: string,
  ): VersionedTransaction | undefined {
    try {
      return VersionedTransaction.deserialize(
        Buffer.from(serializedTransaction, 'base64'),
      );
    } catch (e) {
      return undefined;
    }
  }

  static serializeVersionedMessage(message: VersionedMessage): string {
    return JSON.stringify(Array.from(message.serialize()));
  }

  static deserializeVersionedMessage(messageStr: string): MessageV0 {
    const array = JSON.parse(messageStr);
    return MessageV0.deserialize(new Uint8Array(array));
  }
}
