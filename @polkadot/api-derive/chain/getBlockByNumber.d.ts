import type { Observable } from 'rxjs';
import type { AnyNumber } from '@polkadot/types/types';
import type { SignedBlockExtended } from '../type/types';
import type { DeriveApi } from '../types';
export declare function getBlockByNumber(instanceId: string, api: DeriveApi): (blockNumber: AnyNumber) => Observable<SignedBlockExtended>;
