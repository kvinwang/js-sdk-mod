import type { DeriveCustom } from '@polkadot/api-base/types';
import type { ExactDerive } from './derive';
import type { DeriveApi } from './types';
import { lazyDeriveSection } from './util';
export * from './derive';
export * from './type';
export { lazyDeriveSection };
/** @internal */
export declare function getAvailableDerives(instanceId: string, api: DeriveApi, custom?: DeriveCustom): ExactDerive;
