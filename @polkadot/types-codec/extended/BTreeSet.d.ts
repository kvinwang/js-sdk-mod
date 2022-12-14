import type { HexString } from '@polkadot/util/types';
import type { AnyJson, Codec, CodecClass, Inspect, ISet, IU8a, Registry } from '../types';
export declare class BTreeSet<V extends Codec = Codec> extends Set<V> implements ISet<V> {
    #private;
    readonly registry: Registry;
    createdAtHash?: IU8a;
    readonly initialU8aLength?: number;
    constructor(registry: Registry, valType: CodecClass<V> | string, rawValue?: Uint8Array | string | string[] | Set<any>);
    static with<V extends Codec>(valType: CodecClass<V> | string): CodecClass<BTreeSet<V>>;
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
     * @description The actual set values as a string[]
     */
    get strings(): string[];
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
    toHuman(isExtended?: boolean): AnyJson;
    /**
     * @description Converts the Object to JSON, typically used for RPC transfers
     */
    toJSON(): AnyJson;
    /**
     * @description Returns the base runtime type name for this instance
     */
    toRawType(): string;
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
    toU8a(isBare?: boolean): Uint8Array;
}
