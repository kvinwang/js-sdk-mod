import type { Compact } from '@polkadot/types';
import type { BlockNumber } from '@polkadot/types/interfaces';
declare type CompatHeader = {
    number: Compact<BlockNumber> | BlockNumber;
};
export declare function unwrapBlockNumber(hdr: CompatHeader): BlockNumber;
export {};
