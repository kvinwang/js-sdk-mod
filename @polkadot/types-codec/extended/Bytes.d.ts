import type { AnyU8a, Inspect, Registry } from '../types';
import { Raw } from '../native/Raw';
/**
 * @name Bytes
 * @description
 * A Bytes wrapper for Vec<u8>. The significant difference between this and a normal Uint8Array
 * is that this version allows for length-encoding. (i.e. it is a variable-item codec, the same
 * as what is found in [[Text]] and [[Vec]])
 */
export declare class Bytes extends Raw {
    constructor(registry: Registry, value?: AnyU8a);
    /**
     * @description The length of the value when encoded as a Uint8Array
     */
    get encodedLength(): number;
    /**
     * @description Returns a breakdown of the hex encoding for this Codec
     */
    inspect(isBare?: boolean): Inspect;
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
