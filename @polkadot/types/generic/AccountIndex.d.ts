/// <reference types="bn.js" />
import type { AnyNumber, Registry } from '@polkadot/types-codec/types';
import { u32 } from '@polkadot/types-codec';
import { BN } from '@polkadot/util';
/**
 * @name GenericAccountIndex
 * @description
 * A wrapper around an AccountIndex, which is a shortened, variable-length encoding
 * for an Account. We extends from [[U32]] to provide the number-like properties.
 */
export declare class GenericAccountIndex extends u32 {
    constructor(registry: Registry, value?: AnyNumber);
    static calcLength(_value: BN | number): number;
    static readLength(input: Uint8Array): [number, number];
    static writeLength(input: Uint8Array): Uint8Array;
    /**
     * @description Compares the value of the input to see if there is a match
     */
    eq(other?: unknown): boolean;
    /**
     * @description Converts the Object to to a human-friendly JSON, with additional fields, expansion and formatting of information
     */
    toHuman(): string;
    /**
     * @description Converts the Object to JSON, typically used for RPC transfers
     */
    toJSON(): string;
    /**
     * @description Converts the value in a best-fit primitive form
     */
    toPrimitive(): string;
    /**
     * @description Returns the string representation of the value
     */
    toString(): string;
    /**
     * @description Returns the base runtime type name for this instance
     */
    toRawType(): string;
}
