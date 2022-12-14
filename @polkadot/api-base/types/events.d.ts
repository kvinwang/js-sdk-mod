import type { IsEvent } from '@polkadot/types/metadata/decorate/types';
import type { AnyTuple } from '@polkadot/types/types';
import type { ApiTypes } from './base';
export declare type AugmentedEvent<ApiType extends ApiTypes, T extends AnyTuple = AnyTuple, N = unknown> = IsEvent<T, N>;
export interface AugmentedEvents<ApiType extends ApiTypes> {
}
export interface DecoratedEvents<ApiType extends ApiTypes> extends AugmentedEvents<ApiType> {
    [key: string]: ModuleEvents<ApiType>;
}
export interface ModuleEvents<ApiType extends ApiTypes> {
    [key: string]: AugmentedEvent<ApiType>;
}
