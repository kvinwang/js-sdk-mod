import type { HexString } from '@polkadot/util/types';
import type { AnyJson, Codec, Inspect, IU8a, Registry } from '../types';
/**
 * @name Json
 * @description
 * Wraps the a JSON structure retrieve via RPC. It extends the standard JS Map with. While it
 * implements a Codec, it is limited in that it can only be used with input objects via RPC,
 * i.e. no hex decoding. Unlike a struct, this waps a JSON object with unknown keys
 * @noInheritDoc
 */
export declare class Json extends Map<string, any> implements Codec {
    readonly registry: Registry;
    createdAtHash?: IU8a;
    constructor(registry: Registry, value?: Record<string, unknown> | null);
    /**
     * @description Always 0, never encodes as a Uint8Array
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
     * @description Compares the value of the input to see if there is a match
     */
    eq(other?: unknown): boolean;
    /**
     * @description Returns a typed value from the internal map
     */
    getT<T>(key: string): T;
    /**
     * @description Unimplemented, will throw
     */
    inspect(): Inspect;
    /**
     * @description Unimplemented, will throw
     */
    toHex(): HexString;
    /**
     * @description Converts the Object to to a human-friendly JSON, with additional fields, expansion and formatting of information
     */
    toHuman(): Record<string, AnyJson>;
    /**
     * @description Converts the Object to JSON, typically used for RPC transfers
     */
    toJSON(): Record<string, AnyJson>;
    /**
     * @description Converts the value in a best-fit primitive form
     */
    toPrimitive(): Record<string, AnyJson>;
    /**
     * @description Returns the base runtime type name for this instance
     */
    toRawType(): string;
    /**
     * @description Returns the string representation of the value
     */
    toString(): string;
    /**
     * @description Unimplemented, will throw
     */
    toU8a(isBare?: boolean): Uint8Array;
}
