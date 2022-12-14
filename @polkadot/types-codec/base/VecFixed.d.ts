import type { HexString } from '@polkadot/util/types';
import type { Codec, CodecClass, Inspect, Registry } from '../types';
import { AbstractArray } from '../abstract/Array';
interface Options<T> {
    definition?: CodecClass<T>;
    setDefinition?: (d: CodecClass<T>) => CodecClass<T>;
}
/**
 * @name VecFixed
 * @description
 * This manages codec arrays of a fixed length
 */
export declare class VecFixed<T extends Codec> extends AbstractArray<T> {
    #private;
    readonly initialU8aLength?: number;
    constructor(registry: Registry, Type: CodecClass<T> | string, length: number, value?: Uint8Array | HexString | unknown[], { definition, setDefinition }?: Options<T>);
    static with<O extends Codec>(Type: CodecClass<O> | string, length: number): CodecClass<VecFixed<O>>;
    /**
     * @description The type for the items
     */
    get Type(): string;
    /**
     * @description The length of the value when encoded as a Uint8Array
     */
    get encodedLength(): number;
    /**
     * @description Returns a breakdown of the hex encoding for this Codec
     */
    inspect(): Inspect;
    toU8a(): Uint8Array;
    /**
     * @description Returns the base runtime type name for this instance
     */
    toRawType(): string;
}
export {};
