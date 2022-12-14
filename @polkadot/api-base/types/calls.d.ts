import type { Observable } from 'rxjs';
import type { AnyFunction, Codec, DefinitionCallNamed } from '@polkadot/types/types';
import type { ApiTypes, ReturnCodec } from './base';
export declare type DecoratedCallBase<ApiType extends ApiTypes, F extends AnyFunction = (...args: any[]) => Observable<Codec>> = ApiType extends 'rxjs' ? <T extends Codec | any = ReturnCodec<F>>(...args: Parameters<F>) => Observable<T> : <T extends Codec | any = ReturnCodec<F>>(...args: Parameters<F>) => Promise<T>;
export declare type AugmentedCall<ApiType extends ApiTypes, F extends AnyFunction = (...args: any[]) => Observable<Codec>> = DecoratedCallBase<ApiType, F> & {
    /** The metadata/description/definition for this method */
    meta: DefinitionCallNamed;
};
export interface AugmentedCalls<ApiType extends ApiTypes> {
}
export interface QueryableCalls<ApiType extends ApiTypes> extends AugmentedCalls<ApiType> {
    [key: string]: QueryableModuleCalls<ApiType>;
}
export interface QueryableModuleCalls<ApiType extends ApiTypes> {
    [key: string]: DecoratedCallBase<ApiType>;
}
