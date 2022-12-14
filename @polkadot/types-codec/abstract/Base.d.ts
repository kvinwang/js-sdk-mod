import type { HexString } from '@polkadot/util/types';
import type { AnyJson, BareOpts, Codec, Inspect, IU8a, Registry } from '../types';
/**
 * @name Base
 * @description A type extends the Base class, when it holds a value
 */
export declare abstract class AbstractBase<T extends Codec> implements Codec {
    #private;
    createdAtHash?: IU8a;
    readonly initialU8aLength?: number;
    readonly registry: Registry;
    protected constructor(registry: Registry, value: T, initialU8aLength?: number);
    /**
     * @description The length of the value when encoded as a Uint8Array
     */
    get encodedLength(): number;
    /**
     * @description returns a hash of the contents
     */
    get hash(): IU8a;
    get inner(): T;
    /**
     * @description Checks if the value is an empty value
     */
    get isEmpty(): boolean;
    /**
     * @description Compares the value of the input to see if there is a match
     */
    eq(other?: unknown): boolean;
    /**
     * @description Returns a breakdown of the hex encoding for this Codec
     */
    inspect(): Inspect;
    /**
     * @description Returns a hex string representation of the value. isLe returns a LE (number-only) representation
     */
    toHex(isLe?: boolean): HexString;
    /**
     * @description Converts the Object to to a human-friendly JSON, with additional fields, expansion and formatting of information
     */
    toHuman(isExtended?: boolean): AnyJson;
    /**
     * @description Converts the Object to JSON, typically used for RPC transfers
     */
    toJSON(): AnyJson;
    /**
     * @description Converts the value in a best-fit primitive form
     */
    toPrimitive(): AnyJson;
    /**
     * @description Returns the string representation of the value
     */
    toString(): string;
    /**
     * @description Encodes the value as a Uint8Array as per the SCALE specifications
     * @param isBare true when the value has none of the type-specific prefixes (internal)
     */
    toU8a(isBare?: BareOpts): Uint8Array;
    /**
     * @description Returns the base runtime type name for this instance
     */
    toRawType(): string;
    unwrap(): T;
}
