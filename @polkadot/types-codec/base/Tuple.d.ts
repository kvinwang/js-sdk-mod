import type { AnyTupleValue, Codec, CodecClass, Inspect, ITuple, Registry } from '../types';
import { AbstractArray } from '../abstract/Array';
declare type TupleType = (CodecClass | string);
declare type TupleTypes = TupleType[] | {
    [index: string]: CodecClass | string;
};
declare type Definition = [CodecClass[], string[]];
interface Options {
    definition?: Definition;
    setDefinition?: (d: Definition) => Definition;
}
/**
 * @name Tuple
 * @description
 * A Tuple defines an anonymous fixed-length array, where each element has its
 * own type. It extends the base JS `Array` object.
 */
export declare class Tuple extends AbstractArray<Codec> implements ITuple<Codec[]> {
    #private;
    readonly initialU8aLength?: number;
    constructor(registry: Registry, Types: TupleTypes | TupleType, value?: AnyTupleValue, { definition, setDefinition }?: Options);
    static with(Types: TupleTypes | TupleType): CodecClass<Tuple>;
    /**
     * @description The length of the value when encoded as a Uint8Array
     */
    get encodedLength(): number;
    /**
     * @description The types definition of the tuple
     */
    get Types(): string[];
    /**
     * @description Returns a breakdown of the hex encoding for this Codec
     */
    inspect(): Inspect;
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
