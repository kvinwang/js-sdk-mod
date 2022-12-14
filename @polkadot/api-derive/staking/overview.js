// Copyright 2017-2022 @polkadot/api-derive authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { combineLatest, map } from 'rxjs';
import { objectSpread } from '@polkadot/util';
import { memo } from "../util/index.js";

/**
 * @description Retrieve the staking overview, including elected and points earned
 */
export function overview(instanceId, api) {
  return memo(instanceId, () => combineLatest([api.derive.session.indexes(), api.derive.staking.validators()]).pipe(map(([indexes, {
    nextElected,
    validators
  }]) => objectSpread({}, indexes, {
    nextElected,
    validators
  }))));
}