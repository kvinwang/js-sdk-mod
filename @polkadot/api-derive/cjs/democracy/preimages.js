"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.preimage = void 0;
exports.preimages = preimages;

var _rxjs = require("rxjs");

var _util = require("@polkadot/util");

var _util2 = require("../util");

// Copyright 2017-2022 @polkadot/api-derive authors & contributors
// SPDX-License-Identifier: Apache-2.0
function isDemocracyPreimage(api, imageOpt) {
  return !!imageOpt && !api.query.democracy.dispatchQueue;
}

function constructProposal(api, _ref) {
  let [bytes, proposer, balance, at] = _ref;
  let proposal;

  try {
    proposal = api.registry.createType('Proposal', bytes.toU8a(true));
  } catch (error) {
    console.error(error);
  }

  return {
    at,
    balance,
    proposal,
    proposer
  };
}

function parseDemocracy(api, imageOpt) {
  if (imageOpt.isNone) {
    return;
  }

  if (isDemocracyPreimage(api, imageOpt)) {
    const status = imageOpt.unwrap();

    if (status.isMissing) {
      return;
    }

    const {
      data,
      deposit,
      provider,
      since
    } = status.asAvailable;
    return constructProposal(api, [data, provider, deposit, since]);
  }

  return constructProposal(api, imageOpt.unwrap());
}

function getDemocracyImages(api, hashes) {
  return api.query.democracy.preimages.multi(hashes).pipe((0, _rxjs.map)(images => images.map(imageOpt => parseDemocracy(api, imageOpt))));
}

function preimages(instanceId, api) {
  return (0, _util2.memo)(instanceId, hashes => hashes.length ? (0, _util.isFunction)(api.query.democracy.preimages) ? getDemocracyImages(api, hashes) : (0, _rxjs.of)([]) : (0, _rxjs.of)([]));
}

const preimage = (0, _util2.firstMemo)((api, hash) => api.derive.democracy.preimages([hash]));
exports.preimage = preimage;