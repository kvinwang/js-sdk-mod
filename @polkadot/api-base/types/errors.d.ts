import type { IsError } from '@polkadot/types/metadata/decorate/types';
import type { ApiTypes } from './base';
export declare type AugmentedError<ApiType extends ApiTypes> = IsError;
export interface AugmentedErrors<ApiType extends ApiTypes> {
}
export interface DecoratedErrors<ApiType extends ApiTypes> extends AugmentedErrors<ApiType> {
    [key: string]: ModuleErrors<ApiType>;
}
export interface ModuleErrors<ApiType extends ApiTypes> {
    [key: string]: AugmentedError<ApiType>;
}
