import type { Enum } from '@polkadot/types-codec';
/** @name NpApiError */
export interface NpApiError extends Enum {
    readonly isMemberNotFound: boolean;
    readonly isOverflowInPendingRewards: boolean;
    readonly type: 'MemberNotFound' | 'OverflowInPendingRewards';
}
export declare type PHANTOM_NOMPOOLS = 'nompools';
