// Copyright 2017-2022 @polkadot/api-derive authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { combineLatest, map, of, switchMap } from 'rxjs';
import { objectSpread } from '@polkadot/util';
import { memo } from "../util/index.js";
export function referendums(instanceId, api) {
  return memo(instanceId, () => api.derive.democracy.referendumsActive().pipe(switchMap(referendums => referendums.length ? combineLatest([of(referendums), api.derive.democracy._referendumsVotes(referendums)]) : of([[], []])), map(([referendums, votes]) => referendums.map((referendum, index) => objectSpread({}, referendum, votes[index])))));
}