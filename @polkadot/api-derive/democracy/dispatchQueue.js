// Copyright 2017-2022 @polkadot/api-derive authors & contributors
// SPDX-License-Identifier: Apache-2.0
import { catchError, combineLatest, map, of, switchMap } from 'rxjs';
import { Enum } from '@polkadot/types';
import { isFunction, objectSpread, stringToHex } from '@polkadot/util';
import { memo } from "../util/index.js";
const DEMOCRACY_ID = stringToHex('democrac');

function isMaybeHashed(call) {
  // check for enum
  return call instanceof Enum;
}

function queryQueue(api) {
  return api.query.democracy.dispatchQueue().pipe(switchMap(dispatches => combineLatest([of(dispatches), api.derive.democracy.preimages(dispatches.map(([, hash]) => hash))])), map(([dispatches, images]) => dispatches.map(([at, imageHash, index], dispatchIndex) => ({
    at,
    image: images[dispatchIndex],
    imageHash,
    index
  }))));
}

function schedulerEntries(api) {
  // We don't get entries, but rather we get the keys (triggered via finished referendums) and
  // the subscribe to those keys - this means we pickup when the schedulers actually executes
  // at a block, the entry for that block will become empty
  return api.derive.democracy.referendumsFinished().pipe(switchMap(() => api.query.scheduler.agenda.keys()), switchMap(keys => {
    const blockNumbers = keys.map(({
      args: [blockNumber]
    }) => blockNumber);
    return blockNumbers.length ? combineLatest([of(blockNumbers), // this should simply be api.query.scheduler.agenda.multi,
    // however we have had cases on Darwinia where the indices have moved around after an
    // upgrade, which results in invalid on-chain data
    api.query.scheduler.agenda.multi(blockNumbers).pipe(catchError(() => of(blockNumbers.map(() => []))))]) : of([[], []]);
  }));
}

function queryScheduler(api) {
  return schedulerEntries(api).pipe(switchMap(([blockNumbers, agendas]) => {
    const result = [];
    blockNumbers.forEach((at, index) => {
      (agendas[index] || []).filter(o => o.isSome).forEach(o => {
        const scheduled = o.unwrap();

        if (scheduled.maybeId.isSome) {
          const id = scheduled.maybeId.unwrap().toHex();

          if (id.startsWith(DEMOCRACY_ID)) {
            const imageHash = isMaybeHashed(scheduled.call) ? scheduled.call.isHash ? scheduled.call.asHash : scheduled.call.asValue.args[0] : scheduled.call.args[0];
            result.push({
              at,
              imageHash,
              index: api.registry.createType('(u64, ReferendumIndex)', id)[1]
            });
          }
        }
      });
    });
    return combineLatest([of(result), result.length ? api.derive.democracy.preimages(result.map(({
      imageHash
    }) => imageHash)) : of([])]);
  }), map(([infos, images]) => infos.map((info, index) => objectSpread({
    image: images[index]
  }, info))));
}

export function dispatchQueue(instanceId, api) {
  return memo(instanceId, () => {
    var _api$query$scheduler;

    return isFunction((_api$query$scheduler = api.query.scheduler) === null || _api$query$scheduler === void 0 ? void 0 : _api$query$scheduler.agenda) ? queryScheduler(api) : api.query.democracy.dispatchQueue ? queryQueue(api) : of([]);
  });
}