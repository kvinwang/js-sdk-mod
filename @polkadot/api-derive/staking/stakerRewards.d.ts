import type { Observable } from 'rxjs';
import type { EraIndex } from '@polkadot/types/interfaces';
import type { DeriveApi, DeriveEraPoints, DeriveEraPrefs, DeriveEraRewards, DeriveStakerReward } from '../types';
declare type ErasResult = [DeriveEraPoints[], DeriveEraPrefs[], DeriveEraRewards[]];
export declare function _stakerRewardsEras(instanceId: string, api: DeriveApi): (eras: EraIndex[], withActive?: boolean) => Observable<ErasResult>;
export declare function _stakerRewards(instanceId: string, api: DeriveApi): (accountIds: (Uint8Array | string)[], eras: EraIndex[], withActive?: boolean) => Observable<DeriveStakerReward[][]>;
export declare const stakerRewards: (instanceId: string, api: DeriveApi) => (accountId: string | Uint8Array, withActive?: boolean | undefined) => Observable<DeriveStakerReward[]>;
export declare function stakerRewardsMultiEras(instanceId: string, api: DeriveApi): (accountIds: (Uint8Array | string)[], eras: EraIndex[]) => Observable<DeriveStakerReward[][]>;
export declare function stakerRewardsMulti(instanceId: string, api: DeriveApi): (accountIds: (Uint8Array | string)[], withActive?: boolean) => Observable<DeriveStakerReward[][]>;
export {};
