// Copyright 2017-2022 @polkadot/api-derive authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { switchMap } from 'rxjs';
import { memo } from "../util/index.js";

/**
 * @name subscribeFinalizedBlocks
 * @returns The finalized block & events for that block
 */
export function subscribeFinalizedBlocks(instanceId, api) {
  return memo(instanceId, () => api.derive.chain.subscribeFinalizedHeads().pipe(switchMap(header => api.derive.chain.getBlock(header.createdAtHash || header.hash))));
}