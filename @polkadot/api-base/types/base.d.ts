import type { Observable } from 'rxjs';
import type { AnyFunction, Callback, Codec } from '@polkadot/types/types';
export declare type Push<T extends readonly unknown[], V> = [...T, V];
export declare type DropLast<T extends readonly unknown[]> = T extends readonly [...infer U, any?] ? U : [...T];
export declare type ApiTypes = 'promise' | 'rxjs';
export declare type ObsInnerType<O extends Observable<any>> = O extends Observable<infer U> ? U : never;
export declare type VoidFn = () => void;
export declare type UnsubscribePromise = Promise<VoidFn>;
export declare type PromiseOrObs<ApiType extends ApiTypes, T> = ApiType extends 'rxjs' ? Observable<T> : Promise<T>;
export declare type MethodResult<ApiType extends ApiTypes, F extends AnyFunction> = ApiType extends 'rxjs' ? RxResult<F> : PromiseResult<F>;
export interface RxResult<F extends AnyFunction> {
    (...args: Parameters<F>): Observable<ObsInnerType<ReturnType<F>>>;
    <T>(...args: Parameters<F>): Observable<T>;
}
export interface PromiseResult<F extends AnyFunction> {
    (...args: Parameters<F>): Promise<ObsInnerType<ReturnType<F>>>;
    (...args: Push<Parameters<F>, Callback<ObsInnerType<ReturnType<F>>>>): UnsubscribePromise;
    <T extends Codec | Codec[]>(...args: Parameters<F>): Promise<T>;
    <T extends Codec | Codec[]>(...args: Push<Parameters<F>, Callback<T>>): UnsubscribePromise;
}
export interface DecorateMethodOptions {
    methodName?: string;
    overrideNoSub?: (...args: unknown[]) => Observable<Codec>;
}
export declare type DecorateFn<T extends Codec> = (...args: any[]) => Observable<T>;
export interface PaginationOptions<A = unknown> {
    args: A[];
    pageSize: number;
    startKey?: string;
}
export declare type DecorateMethod<ApiType extends ApiTypes, T = any> = <M extends (...args: any[]) => Observable<any>>(method: M, options?: DecorateMethodOptions) => T;
declare type AsCodec<R extends Codec | any> = R extends Codec ? R : Codec;
export declare type ReturnCodec<F extends AnyFunction> = AsCodec<ObsInnerType<ReturnType<F>>>;
export {};
