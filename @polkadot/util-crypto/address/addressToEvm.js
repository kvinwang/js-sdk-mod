// Copyright 2017-2022 @polkadot/util-crypto authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { decodeAddress } from "./decode.js";

/**
 * @name addressToEvm
 * @summary Converts an SS58 address to its corresponding EVM address.
 */
export function addressToEvm(address, ignoreChecksum) {
  return decodeAddress(address, ignoreChecksum).subarray(0, 20);
}