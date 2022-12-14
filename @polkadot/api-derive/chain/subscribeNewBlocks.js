// Copyright 2017-2022 @polkadot/api-derive authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { switchMap } from 'rxjs';
import { memo } from "../util/index.js";

/**
 * @name subscribeNewBlocks
 * @returns The latest block & events for that block
 */
export function subscribeNewBlocks(instanceId, api) {
  return memo(instanceId, () => api.derive.chain.subscribeNewHeads().pipe(switchMap(header => api.derive.chain.getBlock(header.createdAtHash || header.hash))));
}