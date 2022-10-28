// Copyright 2017-2022 @polkadot/types-known authors & contributors
// SPDX-License-Identifier: Apache-2.0

/* eslint-disable sort-keys */
import { mapXcmTypes } from '@polkadot/types-create';
import { objectSpread } from '@polkadot/util';
const sharedTypes = {
  DispatchErrorModule: 'DispatchErrorModuleU8',
  TAssetBalance: 'u128',
  ProxyType: {
    _enum: ['Any', 'NonTransfer', 'CancelProxy', 'Assets', 'AssetOwner', 'AssetManager', 'Staking']
  },
  Weight: 'u64'
}; // these are override types for Statemine, Statemint, Westmint

const versioned = [{
  minmax: [0, 3],
  types: objectSpread({
    // Enum was modified mid-flight -
    // https://github.com/paritytech/substrate/pull/10382/files#diff-e4e016b33a82268b6208dc974eea841bad47597865a749fee2f937eb6fdf67b4R498
    DispatchError: 'DispatchErrorPre6First'
  }, sharedTypes, mapXcmTypes('V0'))
}, {
  minmax: [4, 5],
  types: objectSpread({}, sharedTypes, mapXcmTypes('V1'))
}, {
  // metadata V14
  minmax: [500, undefined],
  types: {}
}];
export default versioned;