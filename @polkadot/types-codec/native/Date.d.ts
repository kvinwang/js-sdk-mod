/// <reference types="bn.js" />
import type { HexString } from '@polkadot/util/types';
import type { AnyNumber, Inspect, INumber, IU8a, Registry, UIntBitLength } from '../types';
import { BN } from '@polkadot/util';
/**
 * @name Date
 * @description
 * A wrapper around seconds/timestamps. Internally the representation only has
 * second precicion (aligning with Rust), so any numbers passed an/out are always
 * per-second. For any encoding/decoding the 1000 multiplier would be applied to
 * get it in line with JavaScript formats. It extends the base JS `Date` object
 * and has all the methods available that are applicable to any `Date`
 * @noInheritDoc
 */
export declare class CodecDate extends Date implements INumber {
    readonly registry: Registry;
    createdAtHash?: IU8a;
    constructor(registry: Registry, value?: CodecDate | Date | AnyNumber);
    /**
     * @description The length of the value when encoded as a Uint8Array
     */
    get encodedLength(): number;
    /**
     * @description returns a hash of the contents
     */
    get hash(): IU8a;
    /**
     * @description Checks if the value is an empty value
     */
    get isEmpty(): boolean;
    /**
     * @description Returns the number of bits in the value
     */
    bitLength(): UIntBitLength;
    /**
     * @description Compares the value of the input to see if there is a match
     */
    eq(other?: unknown): boolean;
    /**
     * @description Returns a breakdown of the hex encoding for this Codec
     */
    inspect(): Inspect;
    /**
     * @description Returns a BigInt representation of the number
     */
    toBigInt(): bigint;
    /**
     * @description Returns the BN representation of the timestamp
     */
    toBn(): BN;
    /**
     * @description Returns a hex string representation of the value
     */
    toHex(isLe?: boolean): HexString;
    /**
     * @description Converts the Object to to a human-friendly JSON, with additional fields, expansion and formatting of information
     */
    toHuman(): string;
    /**
     * @description Converts the Object to JSON, typically used for RPC transfers
     */
    toJSON(): any;
    /**
     * @description Returns the number representation for the timestamp
     */
    toNumber(): number;
    /**
     * @description Converts the value in a best-fit primitive form
     */
    toPrimitive(): number;
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
