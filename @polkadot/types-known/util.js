// Copyright 2017-2022 @polkadot/types-known authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { bnToBn, objectSpread } from '@polkadot/util';
import typesChain from "./chain/index.js";
import typesSpec from "./spec/index.js";
import upgrades from "./upgrades/index.js";

/**
 * @description Perform the callback function using the stringified spec/chain
 * @internal
 * */
function withNames(chainName, specName, fn) {
  return fn(chainName.toString(), specName.toString());
}

/**
 * @descriptionFflatten a VersionedType[] into a Record<string, string>
 * @internal
 * */
function filterVersions(versions = [], specVersion) {
  return versions.filter(({
    minmax: [min, max]
  }) => (min === undefined || min === null || specVersion >= min) && (max === undefined || max === null || specVersion <= max)).reduce((result, {
    types
  }) => objectSpread(result, types), {});
}

/**
 * @description Based on the chain and runtimeVersion, get the applicable signed extensions (ready for registration)
 */
export function getSpecExtensions({
  knownTypes
}, chainName, specName) {
  return withNames(chainName, specName, (c, s) => {
    var _knownTypes$typesBund, _knownTypes$typesBund2, _knownTypes$typesBund3, _knownTypes$typesBund4, _knownTypes$typesBund5, _knownTypes$typesBund6;
    return objectSpread({}, (_knownTypes$typesBund = knownTypes.typesBundle) == null ? void 0 : (_knownTypes$typesBund2 = _knownTypes$typesBund.spec) == null ? void 0 : (_knownTypes$typesBund3 = _knownTypes$typesBund2[s]) == null ? void 0 : _knownTypes$typesBund3.signedExtensions, (_knownTypes$typesBund4 = knownTypes.typesBundle) == null ? void 0 : (_knownTypes$typesBund5 = _knownTypes$typesBund4.chain) == null ? void 0 : (_knownTypes$typesBund6 = _knownTypes$typesBund5[c]) == null ? void 0 : _knownTypes$typesBund6.signedExtensions);
  });
}

/**
 * @description Based on the chain and runtimeVersion, get the applicable types (ready for registration)
 */
export function getSpecTypes({
  knownTypes
}, chainName, specName, specVersion) {
  const _specVersion = bnToBn(specVersion).toNumber();
  return withNames(chainName, specName, (c, s) => {
    var _knownTypes$typesBund7, _knownTypes$typesBund8, _knownTypes$typesBund9, _knownTypes$typesBund10, _knownTypes$typesBund11, _knownTypes$typesBund12, _knownTypes$typesSpec, _knownTypes$typesChai;
    return (
      // The order here is always, based on -
      //   - spec then chain
      //   - typesBundle takes higher precedence
      //   - types is the final catch-all override
      objectSpread({}, filterVersions(typesSpec[s], _specVersion), filterVersions(typesChain[c], _specVersion), filterVersions((_knownTypes$typesBund7 = knownTypes.typesBundle) == null ? void 0 : (_knownTypes$typesBund8 = _knownTypes$typesBund7.spec) == null ? void 0 : (_knownTypes$typesBund9 = _knownTypes$typesBund8[s]) == null ? void 0 : _knownTypes$typesBund9.types, _specVersion), filterVersions((_knownTypes$typesBund10 = knownTypes.typesBundle) == null ? void 0 : (_knownTypes$typesBund11 = _knownTypes$typesBund10.chain) == null ? void 0 : (_knownTypes$typesBund12 = _knownTypes$typesBund11[c]) == null ? void 0 : _knownTypes$typesBund12.types, _specVersion), (_knownTypes$typesSpec = knownTypes.typesSpec) == null ? void 0 : _knownTypes$typesSpec[s], (_knownTypes$typesChai = knownTypes.typesChain) == null ? void 0 : _knownTypes$typesChai[c], knownTypes.types)
    );
  });
}

/**
 * @description Based on the chain or spec, return the hasher used
 */
export function getSpecHasher({
  knownTypes
}, chainName, specName) {
  return withNames(chainName, specName, (c, s) => {
    var _knownTypes$typesBund13, _knownTypes$typesBund14, _knownTypes$typesBund15, _knownTypes$typesBund16, _knownTypes$typesBund17, _knownTypes$typesBund18;
    return knownTypes.hasher || ((_knownTypes$typesBund13 = knownTypes.typesBundle) == null ? void 0 : (_knownTypes$typesBund14 = _knownTypes$typesBund13.chain) == null ? void 0 : (_knownTypes$typesBund15 = _knownTypes$typesBund14[c]) == null ? void 0 : _knownTypes$typesBund15.hasher) || ((_knownTypes$typesBund16 = knownTypes.typesBundle) == null ? void 0 : (_knownTypes$typesBund17 = _knownTypes$typesBund16.spec) == null ? void 0 : (_knownTypes$typesBund18 = _knownTypes$typesBund17[s]) == null ? void 0 : _knownTypes$typesBund18.hasher) || null;
  });
}

/**
 * @description Based on the chain and runtimeVersion, get the applicable rpc definitions (ready for registration)
 */
export function getSpecRpc({
  knownTypes
}, chainName, specName) {
  return withNames(chainName, specName, (c, s) => {
    var _knownTypes$typesBund19, _knownTypes$typesBund20, _knownTypes$typesBund21, _knownTypes$typesBund22, _knownTypes$typesBund23, _knownTypes$typesBund24;
    return objectSpread({}, (_knownTypes$typesBund19 = knownTypes.typesBundle) == null ? void 0 : (_knownTypes$typesBund20 = _knownTypes$typesBund19.spec) == null ? void 0 : (_knownTypes$typesBund21 = _knownTypes$typesBund20[s]) == null ? void 0 : _knownTypes$typesBund21.rpc, (_knownTypes$typesBund22 = knownTypes.typesBundle) == null ? void 0 : (_knownTypes$typesBund23 = _knownTypes$typesBund22.chain) == null ? void 0 : (_knownTypes$typesBund24 = _knownTypes$typesBund23[c]) == null ? void 0 : _knownTypes$typesBund24.rpc);
  });
}

/**
 * @description Based on the chain and runtimeVersion, get the applicable runtime definitions (ready for registration)
 */
export function getSpecRuntime({
  knownTypes
}, chainName, specName) {
  return withNames(chainName, specName, (c, s) => {
    var _knownTypes$typesBund25, _knownTypes$typesBund26, _knownTypes$typesBund27, _knownTypes$typesBund28, _knownTypes$typesBund29, _knownTypes$typesBund30;
    return objectSpread({}, (_knownTypes$typesBund25 = knownTypes.typesBundle) == null ? void 0 : (_knownTypes$typesBund26 = _knownTypes$typesBund25.spec) == null ? void 0 : (_knownTypes$typesBund27 = _knownTypes$typesBund26[s]) == null ? void 0 : _knownTypes$typesBund27.runtime, (_knownTypes$typesBund28 = knownTypes.typesBundle) == null ? void 0 : (_knownTypes$typesBund29 = _knownTypes$typesBund28.chain) == null ? void 0 : (_knownTypes$typesBund30 = _knownTypes$typesBund29[c]) == null ? void 0 : _knownTypes$typesBund30.runtime);
  });
}

/**
 * @description Based on the chain and runtimeVersion, get the applicable alias definitions (ready for registration)
 */
export function getSpecAlias({
  knownTypes
}, chainName, specName) {
  return withNames(chainName, specName, (c, s) => {
    var _knownTypes$typesBund31, _knownTypes$typesBund32, _knownTypes$typesBund33, _knownTypes$typesBund34, _knownTypes$typesBund35, _knownTypes$typesBund36;
    return (
      // as per versions, first spec, then chain then finally non-versioned
      objectSpread({}, (_knownTypes$typesBund31 = knownTypes.typesBundle) == null ? void 0 : (_knownTypes$typesBund32 = _knownTypes$typesBund31.spec) == null ? void 0 : (_knownTypes$typesBund33 = _knownTypes$typesBund32[s]) == null ? void 0 : _knownTypes$typesBund33.alias, (_knownTypes$typesBund34 = knownTypes.typesBundle) == null ? void 0 : (_knownTypes$typesBund35 = _knownTypes$typesBund34.chain) == null ? void 0 : (_knownTypes$typesBund36 = _knownTypes$typesBund35[c]) == null ? void 0 : _knownTypes$typesBund36.alias, knownTypes.typesAlias)
    );
  });
}

/**
 * @description Returns a version record for known chains where upgrades are being tracked
 */
export function getUpgradeVersion(genesisHash, blockNumber) {
  const known = upgrades.find(u => genesisHash.eq(u.genesisHash));
  return known ? [known.versions.reduce((last, version) => {
    return blockNumber.gt(version.blockNumber) ? version : last;
  }, undefined), known.versions.find(version => blockNumber.lte(version.blockNumber))] : [undefined, undefined];
}