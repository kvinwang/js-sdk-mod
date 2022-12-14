import type { HexString } from '@polkadot/util/types';
import type { AnyJson, Codec, CodecClass, Inspect, IU8a, Registry } from '../types';
/**
 * @name DoNotConstruct
 * @description
 * An unknown type that fails on construction with the type info
 */
export declare class DoNotConstruct implements Codec {
    #private;
    readonly registry: Registry;
    createdAtHash?: IU8a;
    constructor(registry: Registry, typeName?: string);
    static with(typeName?: string): CodecClass;
    /**
     * @description The length of the value when encoded as a Uint8Array
     */
    get encodedLength(): number;
    /**
     * @description returns a hash of the contents
     */
    get hash(): IU8a;
    /**
     * @description Checks if the value is an empty value (always true)
     */
    get isEmpty(): boolean;
    eq(): boolean;
    inspect(): Inspect;
    toHex(): HexString;
    toHuman(): AnyJson;
    toJSON(): AnyJson;
    toPrimitive(): AnyJson;
    toRawType(): string;
    toString(): string;
    toU8a(): Uint8Array;
}
