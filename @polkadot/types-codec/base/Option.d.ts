import type { HexString } from '@polkadot/util/types';
import type { AnyJson, Codec, CodecClass, Inspect, IOption, IU8a, Registry } from '../types';
interface Options<T> {
    definition?: CodecClass<T>;
    setDefinition?: (d: CodecClass<T>) => CodecClass<T>;
}
/**
 * @name Option
 * @description
 * An Option is an optional field. Basically the first byte indicates that there is
 * is value to follow. If the byte is `1` there is an actual value. So the Option
 * implements that - decodes, checks for optionality and wraps the required structure
 * with a value if/as required/found.
 */
export declare class Option<T extends Codec> implements IOption<T> {
    #private;
    readonly registry: Registry;
    createdAtHash?: IU8a;
    initialU8aLength?: number;
    constructor(registry: Registry, typeName: CodecClass<T> | string, value?: unknown, { definition, setDefinition }?: Options<T>);
    static with<O extends Codec>(Type: CodecClass<O> | string): CodecClass<Option<O>>;
    /**
     * @description The length of the value when encoded as a Uint8Array
     */
    get encodedLength(): number;
    /**
     * @description returns a hash of the contents
     */
    get hash(): IU8a;
    /**
     * @description Checks if the Option has no value
     */
    get isEmpty(): boolean;
    /**
     * @description Checks if the Option has no value
     */
    get isNone(): boolean;
    /**
     * @description Checks if the Option has a value
     */
    get isSome(): boolean;
    /**
     * @description The actual value for the Option
     */
    get value(): T;
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
     * @description Returns the base runtime type name for this instance
     */
    toRawType(isBare?: boolean): string;
    /**
     * @description Returns the string representation of the value
     */
    toString(): string;
    /**
     * @description Encodes the value as a Uint8Array as per the SCALE specifications
     * @param isBare true when the value has none of the type-specific prefixes (internal)
     */
    toU8a(isBare?: boolean): Uint8Array;
    /**
     * @description Returns the value that the Option represents (if available), throws if null
     */
    unwrap(): T;
    /**
     * @description Returns the value that the Option represents (if available) or defaultValue if none
     * @param defaultValue The value to return if the option isNone
     */
    unwrapOr<O>(defaultValue: O): T | O;
    /**
     * @description Returns the value that the Option represents (if available) or defaultValue if none
     * @param defaultValue The value to return if the option isNone
     */
    unwrapOrDefault(): T;
}
export {};
