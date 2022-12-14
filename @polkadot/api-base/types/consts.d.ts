import type { PalletConstantMetadataLatest } from '@polkadot/types/interfaces';
import type { Codec } from '@polkadot/types/types';
import type { ApiTypes } from './base';
export interface AugmentedConst<ApiType extends ApiTypes> {
    meta: PalletConstantMetadataLatest;
}
export interface AugmentedConsts<ApiType extends ApiTypes> {
}
export interface QueryableConsts<ApiType extends ApiTypes> extends AugmentedConsts<ApiType> {
    [key: string]: QueryableModuleConsts;
}
export interface QueryableModuleConsts {
    [key: string]: Codec;
}
