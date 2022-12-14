import type { HexString } from '@polkadot/util/types';
import type { Codec, CodecClass, Registry } from '../types';
import { AbstractArray } from '../abstract/Array';
interface Options<T> {
    definition?: CodecClass<T>;
    setDefinition?: (d: CodecClass<T>) => CodecClass<T>;
}
export declare function decodeVec<T extends Codec>(registry: Registry, result: T[], value: Uint8Array | HexString | unknown[], startAt: number, Type: CodecClass<T>): [number, number];
/**
 * @name Vec
 * @description
 * This manages codec arrays. Internally it keeps track of the length (as decoded) and allows
 * construction with the passed `Type` in the constructor. It is an extension to Array, providing
 * specific encoding/decoding on top of the base type.
 */
export declare class Vec<T extends Codec> extends AbstractArray<T> {
    #private;
    readonly initialU8aLength?: number;
    constructor(registry: Registry, Type: CodecClass<T> | string, value?: Uint8Array | HexString | unknown[], { definition, setDefinition }?: Options<T>);
    static with<O extends Codec>(Type: CodecClass<O> | string): CodecClass<Vec<O>>;
    /**
     * @description The type for the items
     */
    get Type(): string;
    /**
     * @description Finds the index of the value in the array
     */
    indexOf(_other?: unknown): number;
    /**
     * @description Returns the base runtime type name for this instance
     */
    toRawType(): string;
}
export {};
