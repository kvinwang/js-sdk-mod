import type { AnyJson, AnyTuple, AnyU8a, ArgsDef, Codec, IMethod, Registry } from '@polkadot/types-codec/types';
import type { FunctionMetadataLatest } from '../interfaces/metadata';
import type { CallBase } from '../types';
import { Struct, U8aFixed } from '@polkadot/types-codec';
/**
 * @name GenericCallIndex
 * @description
 * A wrapper around the `[sectionIndex, methodIndex]` value that uniquely identifies a method
 */
export declare class GenericCallIndex extends U8aFixed {
    constructor(registry: Registry, value?: AnyU8a);
    /**
     * @description Converts the value in a best-fit primitive form
     */
    toPrimitive(): string;
}
/**
 * @name GenericCall
 * @description
 * Extrinsic function descriptor
 */
export declare class GenericCall<A extends AnyTuple = AnyTuple> extends Struct implements CallBase<A> {
    protected _meta: FunctionMetadataLatest;
    constructor(registry: Registry, value: unknown, meta?: FunctionMetadataLatest);
    /**
     * @description The arguments for the function call
     */
    get args(): A;
    /**
     * @description The argument definitions
     */
    get argsDef(): ArgsDef;
    /**
     * @description The argument entries
     */
    get argsEntries(): [string, Codec][];
    /**
     * @description The encoded `[sectionIndex, methodIndex]` identifier
     */
    get callIndex(): Uint8Array;
    /**
     * @description The encoded data
     */
    get data(): Uint8Array;
    /**
     * @description The [[FunctionMetadata]]
     */
    get meta(): FunctionMetadataLatest;
    /**
     * @description Returns the name of the method
     */
    get method(): string;
    /**
     * @description Returns the module containing the method
     */
    get section(): string;
    /**
     * @description Checks if the source matches this in type
     */
    is(other: IMethod<AnyTuple>): other is IMethod<A>;
    /**
     * @description Converts the Object to to a human-friendly JSON, with additional fields, expansion and formatting of information
     */
    toHuman(isExpanded?: boolean): Record<string, AnyJson>;
    /**
     * @description Returns the base runtime type name for this instance
     */
    toRawType(): string;
}
