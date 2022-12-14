// Copyright 2017-2022 @polkadot/api-derive authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { extractAuthor } from "./util.js";
function mapExtrinsics(extrinsics, records) {
  return extrinsics.map((extrinsic, index) => {
    let dispatchError;
    let dispatchInfo;
    const events = records.filter(({
      phase
    }) => phase.isApplyExtrinsic && phase.asApplyExtrinsic.eq(index)).map(({
      event
    }) => {
      if (event.section === 'system') {
        if (event.method === 'ExtrinsicSuccess') {
          dispatchInfo = event.data[0];
        } else if (event.method === 'ExtrinsicFailed') {
          dispatchError = event.data[0];
          dispatchInfo = event.data[1];
        }
      }
      return event;
    });
    return {
      dispatchError,
      dispatchInfo,
      events,
      extrinsic
    };
  });
}
export function createSignedBlockExtended(registry, block, events, validators, author) {
  // an instance of the base extrinsic for us to extend
  const SignedBlockBase = registry.createClass('SignedBlock');
  class Implementation extends SignedBlockBase {
    #author;
    #events;
    #extrinsics;
    constructor(registry, block, events, validators, author) {
      super(registry, block);
      this.#author = author || extractAuthor(this.block.header.digest, validators || []);
      this.#events = events || [];
      this.#extrinsics = mapExtrinsics(this.block.extrinsics, this.#events);
      this.createdAtHash = block == null ? void 0 : block.createdAtHash;
    }

    /**
     * @description Convenience method, returns the author for the block
     */
    get author() {
      return this.#author;
    }

    /**
     * @description Convenience method, returns the events associated with the block
     */
    get events() {
      return this.#events;
    }

    /**
     * @description Returns the extrinsics and their events, mapped
     */
    get extrinsics() {
      return this.#extrinsics;
    }
  }
  return new Implementation(registry, block, events, validators, author);
}