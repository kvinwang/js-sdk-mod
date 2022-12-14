/// <reference types="bn.js" />
import type { Registry } from '@polkadot/types-codec/types';
import type { BN } from '@polkadot/util';
import type { HexString } from '@polkadot/util/types';
import { AbstractBase } from '@polkadot/types-codec';
import { GenericAccountIndex } from '../generic/AccountIndex';
import { GenericEthereumAccountId } from './AccountId';
declare type AnyAddress = bigint | BN | GenericEthereumLookupSource | GenericEthereumAccountId | GenericAccountIndex | number[] | Uint8Array | number | string;
export declare const ACCOUNT_ID_PREFIX: Uint8Array;
/**
 * @name GenericEthereumLookupSource
 * @description
 * A wrapper around an EthereumAccountId and/or AccountIndex that is encoded with a prefix.
 * Since we are dealing with underlying publicKeys (or shorter encoded addresses),
 * we extend from Base with an AccountId/AccountIndex wrapper. Basically the Address
 * is encoded as `[ <prefix-byte>, ...publicKey/...bytes ]` as per spec
 */
export declare class GenericEthereumLookupSource extends AbstractBase<GenericEthereumAccountId | GenericAccountIndex> {
    constructor(registry: Registry, value?: AnyAddress);
    /**
     * @description The length of the value when encoded as a Uint8Array
     */
    get encodedLength(): number;
    /**
     * @description The length of the raw value, either AccountIndex or AccountId
     */
    protected get _rawLength(): number;
    /**
     * @description Returns a hex string representation of the value
     */
    toHex(): HexString;
    /**
     * @description Returns the base runtime type name for this instance
     */
    toRawType(): string;
    /**
     * @description Encodes the value as a Uint8Array as per the SCALE specifications
     * @param isBare true when the value has none of the type-specific prefixes (internal)
     */
    toU8a(isBare?: boolean): Uint8Array;
}
export {};
