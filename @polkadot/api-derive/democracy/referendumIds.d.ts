/// <reference types="bn.js" />
import type { Observable } from 'rxjs';
import type { BN } from '@polkadot/util';
import type { DeriveApi } from '../types';
export declare function referendumIds(instanceId: string, api: DeriveApi): () => Observable<BN[]>;
