import type { HexString } from '@polkadot/util/types';
import type { AnyJson, Codec, CodecClass, IMap, Inspect, IU8a, Registry } from '../types';
export declare class CodecMap<K extends Codec = Codec, V extends Codec = Codec> extends Map<K, V> implements IMap<K, V> {
    #private;
    readonly registry: Registry;
    createdAtHash?: IU8a;
    readonly initialU8aLength?: number;
    constructor(registry: Registry, keyType: CodecClass<K> | string, valType: CodecClass<V> | string, rawValue: Uint8Array | string | Map<any, any> | undefined, type?: 'BTreeMap' | 'HashMap');
    /**
     * @description The length of the value when encoded as a Uint8Array
     */
    get encodedLength(): number;
    /**
     * @description Returns a hash of the value
     */
    get hash(): IU8a;
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
    toHex(): HexString;
    /**
     * @description Converts the Object to to a human-friendly JSON, with additional fields, expansion and formatting of information
     */
    toHuman(isExtended?: boolean): Record<string, AnyJson>;
    /**
     * @description Converts the Object to JSON, typically used for RPC transfers
     */
    toJSON(): Record<string, AnyJson>;
    /**
     * @description Converts the value in a best-fit primitive form
     */
    toPrimitive(): AnyJson;
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
