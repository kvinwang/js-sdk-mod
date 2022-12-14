import type { HexString } from '@polkadot/util/types';
import type { AnyJson, Codec, CodecClass, IEnum, Inspect, IU8a, Registry } from '../types';
export interface EnumCodecClass<T = Codec> {
    new (registry: Registry, value?: any, index?: number): T;
}
interface Definition {
    def: TypesDef;
    isBasic: boolean;
    isIndexed: boolean;
}
interface EntryDef {
    Type: CodecClass;
    index: number;
}
declare type TypesDef = Record<string, EntryDef>;
interface Options {
    definition?: Definition;
    setDefinition?: (d: Definition) => Definition;
}
/**
 * @name Enum
 * @description
 * This implements an enum, that based on the value wraps a different type. It is effectively
 * an extension to enum where the value type is determined by the actual index.
 */
export declare class Enum implements IEnum {
    #private;
    readonly registry: Registry;
    createdAtHash?: IU8a;
    readonly initialU8aLength?: number;
    constructor(registry: Registry, Types: Record<string, string | CodecClass> | Record<string, number> | string[], value?: unknown, index?: number, { definition, setDefinition }?: Options);
    static with(Types: Record<string, string | CodecClass> | Record<string, number> | string[]): EnumCodecClass<Enum>;
    /**
     * @description The length of the value when encoded as a Uint8Array
     */
    get encodedLength(): number;
    /**
     * @description returns a hash of the contents
     */
    get hash(): IU8a;
    /**
     * @description The index of the enum value
     */
    get index(): number;
    /**
     * @description The value of the enum
     */
    get inner(): Codec;
    /**
     * @description true if this is a basic enum (no values)
     */
    get isBasic(): boolean;
    /**
     * @description Checks if the value is an empty value
     */
    get isEmpty(): boolean;
    /**
     * @description Checks if the Enum points to a [[Null]] type
     */
    get isNone(): boolean;
    /**
     * @description The available keys for this enum
     */
    get defIndexes(): number[];
    /**
     * @description The available keys for this enum
     */
    get defKeys(): string[];
    /**
     * @description The name of the type this enum value represents
     */
    get type(): string;
    /**
     * @description The value of the enum
     */
    get value(): Codec;
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
     * @description Returns the number representation for the value
     */
    toNumber(): number;
    /**
     * @description Converts the value in a best-fit primitive form
     */
    toPrimitive(): AnyJson;
    /**
     * @description Returns a raw struct representation of the enum types
     */
    protected _toRawStruct(): string[] | Record<string, string | number>;
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
