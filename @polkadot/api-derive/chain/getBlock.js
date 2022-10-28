// Copyright 2017-2022 @polkadot/api-derive authors & contributors
// SPDX-License-Identifier: Apache-2.0
import { combineLatest, map, of, switchMap } from 'rxjs';
import { createSignedBlockExtended } from "../type/index.js";
import { memo } from "../util/index.js";
import { getAuthorDetails } from "./util.js";
/**
 * @name getBlock
 * @param {( Uint8Array | string )} hash - A block hash as U8 array or string.
 * @description Get a specific block (e.g. rpc.chain.getBlock) and extend it with the author
 * @example
 * <BR>
 *
 * ```javascript
 * const { author, block } = await api.derive.chain.getBlock('0x123...456');
 *
 * console.log(`block #${block.header.number} was authored by ${author}`);
 * ```
 */

export function getBlock(instanceId, api) {
  return memo(instanceId, blockHash => combineLatest([api.rpc.chain.getBlock(blockHash), api.queryAt(blockHash)]).pipe(switchMap(([signedBlock, queryAt]) => combineLatest([of(signedBlock), queryAt.system.events(), getAuthorDetails(signedBlock.block.header, queryAt)])), map(([signedBlock, events, [, validators, author]]) => createSignedBlockExtended(events.registry, signedBlock, events, validators, author))));
}