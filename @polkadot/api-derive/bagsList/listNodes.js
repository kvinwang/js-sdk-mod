// Copyright 2017-2022 @polkadot/api-derive authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { BehaviorSubject, map, of, switchMap, tap, toArray } from 'rxjs';
import { nextTick } from '@polkadot/util';
import { memo } from "../util/index.js";
import { getQueryInterface } from "./util.js";
function traverseLinks(api, head) {
  const subject = new BehaviorSubject(head);
  const query = getQueryInterface(api);
  return subject.pipe(switchMap(account => query.listNodes(account)), tap(node => {
    nextTick(() => {
      node.isSome && node.value.next.isSome ? subject.next(node.unwrap().next.unwrap()) : subject.complete();
    });
  }), toArray(),
  // toArray since we want to startSubject to be completed
  map(all => all.map(o => o.unwrap())));
}
export function listNodes(instanceId, api) {
  return memo(instanceId, bag => bag && bag.head.isSome ? traverseLinks(api, bag.head.unwrap()) : of([]));
}