"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.derive = void 0;
var accounts = _interopRequireWildcard(require("./accounts"));
var alliance = _interopRequireWildcard(require("./alliance"));
var bagsList = _interopRequireWildcard(require("./bagsList"));
var balances = _interopRequireWildcard(require("./balances"));
var bounties = _interopRequireWildcard(require("./bounties"));
var chain = _interopRequireWildcard(require("./chain"));
var contracts = _interopRequireWildcard(require("./contracts"));
var council = _interopRequireWildcard(require("./council"));
var crowdloan = _interopRequireWildcard(require("./crowdloan"));
var democracy = _interopRequireWildcard(require("./democracy"));
var elections = _interopRequireWildcard(require("./elections"));
var imOnline = _interopRequireWildcard(require("./imOnline"));
var membership = _interopRequireWildcard(require("./membership"));
var parachains = _interopRequireWildcard(require("./parachains"));
var session = _interopRequireWildcard(require("./session"));
var society = _interopRequireWildcard(require("./society"));
var staking = _interopRequireWildcard(require("./staking"));
var technicalCommittee = _interopRequireWildcard(require("./technicalCommittee"));
var treasury = _interopRequireWildcard(require("./treasury"));
var tx = _interopRequireWildcard(require("./tx"));
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
// Copyright 2017-2022 @polkadot/api-derive authors & contributors
// SPDX-License-Identifier: Apache-2.0

const derive = {
  accounts,
  alliance,
  bagsList,
  balances,
  bounties,
  chain,
  contracts,
  council,
  crowdloan,
  democracy,
  elections,
  imOnline,
  membership,
  parachains,
  session,
  society,
  staking,
  technicalCommittee,
  treasury,
  tx
};
exports.derive = derive;