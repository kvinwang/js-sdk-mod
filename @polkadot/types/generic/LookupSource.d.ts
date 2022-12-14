/// <reference types="bn.js" />
import type { Inspect, Registry } from '@polkadot/types-codec/types';
import type { BN } from '@polkadot/util';
import type { HexString } from '@polkadot/util/types';
import { AbstractBase } from '@polkadot/types-codec';
import { GenericAccountId } from './AccountId';
import { GenericAccountIndex } from './AccountIndex';
declare type AnyAddress = bigint | BN | GenericLookupSource | GenericAccountId | GenericAccountIndex | number[] | Uint8Array | number | string;
export declare const ACCOUNT_ID_PREFIX: Uint8Array;
/**
 * @name LookupSource
 * @description
 * A wrapper around an AccountId and/or AccountIndex that is encoded with a prefix.
 * Since we are dealing with underlying publicKeys (or shorter encoded addresses),
 * we extend from Base with an AccountId/AccountIndex wrapper. Basically the Address
 * is encoded as `[ <prefix-byte>, ...publicKey/...bytes ]` as per spec
 */
export declare class GenericLookupSource extends AbstractBase<GenericAccountId | GenericAccountIndex> {
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
     * @description Returns a breakdown of the hex encoding for this Codec
     */
    inspect(): Inspect;
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
