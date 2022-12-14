import type { Codec, CodecClass, IResult, Registry } from '../types';
import { Enum } from './Enum';
/**
 * @name Result
 * @description
 * A Result maps to the Rust Result type, that can either wrap a success or error value
 */
export declare class Result<O extends Codec, E extends Codec> extends Enum implements IResult<O, E> {
    constructor(registry: Registry, Ok: CodecClass<O> | string, Err: CodecClass<E> | string, value?: unknown);
    static with<O extends Codec, E extends Codec>(Types: {
        Ok: CodecClass<O> | string;
        Err: CodecClass<E> | string;
    }): CodecClass<Result<O, E>>;
    /**
     * @description Returns the wrapper Err value (if isErr)
     */
    get asErr(): E;
    /**
     * @description Returns the wrapper Ok value (if isOk)
     */
    get asOk(): O;
    /**
     * @description Checks if the Result has no value
     */
    get isEmpty(): boolean;
    /**
     * @description Checks if the Result wraps an Err value
     */
    get isErr(): boolean;
    /**
     * @description Checks if the Result wraps an Ok value
     */
    get isOk(): boolean;
    /**
     * @description Returns the base runtime type name for this instance
     */
    toRawType(): string;
}
