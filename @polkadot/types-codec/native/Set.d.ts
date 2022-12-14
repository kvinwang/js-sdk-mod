/// <reference types="bn.js" />
import type { HexString } from '@polkadot/util/types';
import type { CodecClass, Inspect, ISet, IU8a, Registry } from '../types';
import { BN } from '@polkadot/util';
declare type SetValues = Record<string, number | BN>;
/**
 * @name Set
 * @description
 * An Set is an array of string values, represented an an encoded type by
 * a bitwise representation of the values.
 */
export declare class CodecSet extends Set<string> implements ISet<string> {
    #private;
    readonly registry: Registry;
    createdAtHash?: IU8a;
    constructor(registry: Registry, setValues: SetValues, value?: string[] | Set<string> | Uint8Array | BN | number | string, bitLength?: number);
    static with(values: SetValues, bitLength?: number): CodecClass<CodecSet>;
    /**
     * @description The length of the value when encoded as a Uint8Array
     */
    get encodedLength(): number;
    /**
     * @description returns a hash of the contents
     */
    get hash(): IU8a;
    /**
     * @description true is the Set contains no values
     */
    get isEmpty(): boolean;
    /**
     * @description The actual set values as a string[]
     */
    get strings(): string[];
    /**
     * @description The encoded value for the set members
     */
    get valueEncoded(): BN;
    /**
     * @description adds a value to the Set (extended to allow for validity checking)
     */
    add: (key: string) => this;
    /**
     * @description Compares the value of the input to see if there is a match
     */
    eq(other?: unknown): boolean;
    /**
     * @description Returns a breakdown of the hex encoding for this Codec
     */
    inspect(): Inspect;
    /**
     * @description Returns a hex string representation of the value
     */
    toHex(): HexString;
    /**
     * @description Converts the Object to to a human-friendly JSON, with additional fields, expansion and formatting of information
     */
    toHuman(): string[];
    /**
     * @description Converts the Object to JSON, typically used for RPC transfers
     */
    toJSON(): string[];
    /**
     * @description The encoded value for the set members
     */
    toNumber(): number;
    /**
     * @description Converts the value in a best-fit primitive form
     */
    toPrimitive(): string[];
    /**
     * @description Returns the base runtime type name for this instance
     */
    toRawType(): string;
    /**
     * @description Returns the string representation of the value
     */
    toString(): string;
    /**
     * @description Encodes the value as a Uint8Array as per the SCALE specifications
     * @param isBare true when the value has none of the type-specific prefixes (internal)
     */
    toU8a(isBare?: boolean): Uint8Array;
}
export {};
