// Copyright 2017-2022 @polkadot/types authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { lazyMethod } from '@polkadot/util';
export function lazyVariants(lookup, {
  type
}, getName, creator) {
  const result = {};
  const variants = lookup.getSiType(type).def.asVariant.variants;
  for (let i = 0; i < variants.length; i++) {
    lazyMethod(result, variants[i], creator, getName, i);
  }
  return result;
}