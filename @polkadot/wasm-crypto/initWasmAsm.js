// Copyright 2019-2022 @polkadot/wasm-crypto authors & contributors
// SPDX-License-Identifier: Apache-2.0
import { createWasm } from '@polkadot/wasm-crypto-init/both';
import { initBridge } from "./init.js";
/**
 * @name initWasm
 * @description
 * For historic purposes and for tighter control on init, specifically performing
 * a WASM initialization with ASM and an ASM.js fallback
 *
 * Generally should not be used unless you want explicit control over which
 * interfaces are initialized.
 */

export async function initWasm() {
  await initBridge(createWasm);
}
initWasm().catch(() => {// cannot happen, initWasm doesn't throw
});