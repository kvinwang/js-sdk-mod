// Copyright 2017-2022 @polkadot/api-derive authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { combineLatest, map, of } from 'rxjs';
import { BN_ONE, BN_ZERO } from '@polkadot/util';
import { memo } from "../util/index.js";
export function erasHistoric(instanceId, api) {
  return memo(instanceId, withActive => combineLatest([api.query.staking.activeEra(), api.consts.staking.historyDepth ? of(api.consts.staking.historyDepth) : api.query.staking.historyDepth()]).pipe(map(([activeEraOpt, historyDepth]) => {
    const result = [];
    const max = historyDepth.toNumber();
    const activeEra = activeEraOpt.unwrapOrDefault().index;
    let lastEra = activeEra;
    while (lastEra.gte(BN_ZERO) && result.length < max) {
      if (lastEra !== activeEra || withActive === true) {
        result.push(api.registry.createType('EraIndex', lastEra));
      }
      lastEra = lastEra.sub(BN_ONE);
    }

    // go from oldest to newest
    return result.reverse();
  })));
}