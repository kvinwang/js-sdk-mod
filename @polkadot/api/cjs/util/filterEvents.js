"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.filterEvents = filterEvents;
var _logging = require("./logging");
// Copyright 2017-2022 @polkadot/api authors & contributors
// SPDX-License-Identifier: Apache-2.0

function filterEvents(txHash, _ref, allEvents, status) {
  let {
    block: {
      extrinsics,
      header
    }
  } = _ref;
  // extrinsics to hashes
  for (const [txIndex, x] of extrinsics.entries()) {
    if (x.hash.eq(txHash)) {
      return {
        events: allEvents.filter(_ref2 => {
          let {
            phase
          } = _ref2;
          return phase.isApplyExtrinsic && phase.asApplyExtrinsic.eqn(txIndex);
        }),
        txIndex
      };
    }
  }

  // if we do get the block after finalized, it _should_ be there
  // only warn on filtering with isInBlock (finalization finalizes after)
  if (status.isInBlock) {
    const allHashes = extrinsics.map(x => x.hash.toHex());
    _logging.l.warn(`block ${header.hash.toHex()}: Unable to find extrinsic ${txHash.toHex()} inside ${allHashes.join(', ')}`);
  }
  return {};
}