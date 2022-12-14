"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
var _exportNames = {
  assets: true,
  authorship: true,
  aura: true,
  babe: true,
  balances: true,
  beefy: true,
  benchmark: true,
  blockbuilder: true,
  collective: true,
  consensus: true,
  contracts: true,
  democracy: true,
  dev: true,
  discovery: true,
  elections: true,
  engine: true,
  evm: true,
  extrinsics: true,
  genericAsset: true,
  gilt: true,
  grandpa: true,
  identity: true,
  imOnline: true,
  lottery: true,
  mmr: true,
  nompools: true,
  offences: true,
  pow: true,
  proxy: true,
  recovery: true,
  scheduler: true,
  session: true,
  society: true,
  staking: true,
  support: true,
  syncstate: true,
  system: true,
  treasury: true,
  txpayment: true,
  txqueue: true,
  uniques: true,
  utility: true,
  vesting: true,
  attestations: true,
  bridges: true,
  claims: true,
  crowdloan: true,
  cumulus: true,
  finality: true,
  parachains: true,
  poll: true,
  purchase: true,
  xcm: true,
  contractsAbi: true,
  eth: true,
  nimbus: true,
  ormlOracle: true,
  ormlTokens: true,
  rpc: true,
  author: true,
  chain: true,
  childstate: true,
  offchain: true,
  payment: true,
  state: true
};
Object.defineProperty(exports, "assets", {
  enumerable: true,
  get: function () {
    return _definitions.default;
  }
});
Object.defineProperty(exports, "attestations", {
  enumerable: true,
  get: function () {
    return _definitions44.default;
  }
});
Object.defineProperty(exports, "aura", {
  enumerable: true,
  get: function () {
    return _definitions3.default;
  }
});
Object.defineProperty(exports, "author", {
  enumerable: true,
  get: function () {
    return _definitions60.default;
  }
});
Object.defineProperty(exports, "authorship", {
  enumerable: true,
  get: function () {
    return _definitions2.default;
  }
});
Object.defineProperty(exports, "babe", {
  enumerable: true,
  get: function () {
    return _definitions4.default;
  }
});
Object.defineProperty(exports, "balances", {
  enumerable: true,
  get: function () {
    return _definitions5.default;
  }
});
Object.defineProperty(exports, "beefy", {
  enumerable: true,
  get: function () {
    return _definitions6.default;
  }
});
Object.defineProperty(exports, "benchmark", {
  enumerable: true,
  get: function () {
    return _definitions7.default;
  }
});
Object.defineProperty(exports, "blockbuilder", {
  enumerable: true,
  get: function () {
    return _definitions8.default;
  }
});
Object.defineProperty(exports, "bridges", {
  enumerable: true,
  get: function () {
    return _definitions45.default;
  }
});
Object.defineProperty(exports, "chain", {
  enumerable: true,
  get: function () {
    return _definitions61.default;
  }
});
Object.defineProperty(exports, "childstate", {
  enumerable: true,
  get: function () {
    return _definitions62.default;
  }
});
Object.defineProperty(exports, "claims", {
  enumerable: true,
  get: function () {
    return _definitions46.default;
  }
});
Object.defineProperty(exports, "collective", {
  enumerable: true,
  get: function () {
    return _definitions9.default;
  }
});
Object.defineProperty(exports, "consensus", {
  enumerable: true,
  get: function () {
    return _definitions10.default;
  }
});
Object.defineProperty(exports, "contracts", {
  enumerable: true,
  get: function () {
    return _definitions11.default;
  }
});
Object.defineProperty(exports, "contractsAbi", {
  enumerable: true,
  get: function () {
    return _definitions54.default;
  }
});
Object.defineProperty(exports, "crowdloan", {
  enumerable: true,
  get: function () {
    return _definitions47.default;
  }
});
Object.defineProperty(exports, "cumulus", {
  enumerable: true,
  get: function () {
    return _definitions48.default;
  }
});
Object.defineProperty(exports, "democracy", {
  enumerable: true,
  get: function () {
    return _definitions12.default;
  }
});
Object.defineProperty(exports, "dev", {
  enumerable: true,
  get: function () {
    return _definitions13.default;
  }
});
Object.defineProperty(exports, "discovery", {
  enumerable: true,
  get: function () {
    return _definitions14.default;
  }
});
Object.defineProperty(exports, "elections", {
  enumerable: true,
  get: function () {
    return _definitions15.default;
  }
});
Object.defineProperty(exports, "engine", {
  enumerable: true,
  get: function () {
    return _definitions16.default;
  }
});
Object.defineProperty(exports, "eth", {
  enumerable: true,
  get: function () {
    return _definitions55.default;
  }
});
Object.defineProperty(exports, "evm", {
  enumerable: true,
  get: function () {
    return _definitions17.default;
  }
});
Object.defineProperty(exports, "extrinsics", {
  enumerable: true,
  get: function () {
    return _definitions18.default;
  }
});
Object.defineProperty(exports, "finality", {
  enumerable: true,
  get: function () {
    return _definitions49.default;
  }
});
Object.defineProperty(exports, "genericAsset", {
  enumerable: true,
  get: function () {
    return _definitions19.default;
  }
});
Object.defineProperty(exports, "gilt", {
  enumerable: true,
  get: function () {
    return _definitions20.default;
  }
});
Object.defineProperty(exports, "grandpa", {
  enumerable: true,
  get: function () {
    return _definitions21.default;
  }
});
Object.defineProperty(exports, "identity", {
  enumerable: true,
  get: function () {
    return _definitions22.default;
  }
});
Object.defineProperty(exports, "imOnline", {
  enumerable: true,
  get: function () {
    return _definitions23.default;
  }
});
Object.defineProperty(exports, "lottery", {
  enumerable: true,
  get: function () {
    return _definitions24.default;
  }
});
Object.defineProperty(exports, "mmr", {
  enumerable: true,
  get: function () {
    return _definitions25.default;
  }
});
Object.defineProperty(exports, "nimbus", {
  enumerable: true,
  get: function () {
    return _definitions56.default;
  }
});
Object.defineProperty(exports, "nompools", {
  enumerable: true,
  get: function () {
    return _definitions26.default;
  }
});
Object.defineProperty(exports, "offchain", {
  enumerable: true,
  get: function () {
    return _definitions63.default;
  }
});
Object.defineProperty(exports, "offences", {
  enumerable: true,
  get: function () {
    return _definitions27.default;
  }
});
Object.defineProperty(exports, "ormlOracle", {
  enumerable: true,
  get: function () {
    return _definitions57.default;
  }
});
Object.defineProperty(exports, "ormlTokens", {
  enumerable: true,
  get: function () {
    return _definitions58.default;
  }
});
Object.defineProperty(exports, "parachains", {
  enumerable: true,
  get: function () {
    return _definitions50.default;
  }
});
Object.defineProperty(exports, "payment", {
  enumerable: true,
  get: function () {
    return _definitions64.default;
  }
});
Object.defineProperty(exports, "poll", {
  enumerable: true,
  get: function () {
    return _definitions51.default;
  }
});
Object.defineProperty(exports, "pow", {
  enumerable: true,
  get: function () {
    return _definitions28.default;
  }
});
Object.defineProperty(exports, "proxy", {
  enumerable: true,
  get: function () {
    return _definitions29.default;
  }
});
Object.defineProperty(exports, "purchase", {
  enumerable: true,
  get: function () {
    return _definitions52.default;
  }
});
Object.defineProperty(exports, "recovery", {
  enumerable: true,
  get: function () {
    return _definitions30.default;
  }
});
Object.defineProperty(exports, "rpc", {
  enumerable: true,
  get: function () {
    return _definitions59.default;
  }
});
Object.defineProperty(exports, "scheduler", {
  enumerable: true,
  get: function () {
    return _definitions31.default;
  }
});
Object.defineProperty(exports, "session", {
  enumerable: true,
  get: function () {
    return _definitions32.default;
  }
});
Object.defineProperty(exports, "society", {
  enumerable: true,
  get: function () {
    return _definitions33.default;
  }
});
Object.defineProperty(exports, "staking", {
  enumerable: true,
  get: function () {
    return _definitions34.default;
  }
});
Object.defineProperty(exports, "state", {
  enumerable: true,
  get: function () {
    return _definitions65.default;
  }
});
Object.defineProperty(exports, "support", {
  enumerable: true,
  get: function () {
    return _definitions35.default;
  }
});
Object.defineProperty(exports, "syncstate", {
  enumerable: true,
  get: function () {
    return _definitions36.default;
  }
});
Object.defineProperty(exports, "system", {
  enumerable: true,
  get: function () {
    return _definitions37.default;
  }
});
Object.defineProperty(exports, "treasury", {
  enumerable: true,
  get: function () {
    return _definitions38.default;
  }
});
Object.defineProperty(exports, "txpayment", {
  enumerable: true,
  get: function () {
    return _definitions39.default;
  }
});
Object.defineProperty(exports, "txqueue", {
  enumerable: true,
  get: function () {
    return _definitions40.default;
  }
});
Object.defineProperty(exports, "uniques", {
  enumerable: true,
  get: function () {
    return _definitions41.default;
  }
});
Object.defineProperty(exports, "utility", {
  enumerable: true,
  get: function () {
    return _definitions42.default;
  }
});
Object.defineProperty(exports, "vesting", {
  enumerable: true,
  get: function () {
    return _definitions43.default;
  }
});
Object.defineProperty(exports, "xcm", {
  enumerable: true,
  get: function () {
    return _definitions53.default;
  }
});
var _essentials = require("./essentials");
Object.keys(_essentials).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _essentials[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _essentials[key];
    }
  });
});
var _definitions = _interopRequireDefault(require("./assets/definitions"));
var _definitions2 = _interopRequireDefault(require("./authorship/definitions"));
var _definitions3 = _interopRequireDefault(require("./aura/definitions"));
var _definitions4 = _interopRequireDefault(require("./babe/definitions"));
var _definitions5 = _interopRequireDefault(require("./balances/definitions"));
var _definitions6 = _interopRequireDefault(require("./beefy/definitions"));
var _definitions7 = _interopRequireDefault(require("./benchmark/definitions"));
var _definitions8 = _interopRequireDefault(require("./blockbuilder/definitions"));
var _definitions9 = _interopRequireDefault(require("./collective/definitions"));
var _definitions10 = _interopRequireDefault(require("./consensus/definitions"));
var _definitions11 = _interopRequireDefault(require("./contracts/definitions"));
var _definitions12 = _interopRequireDefault(require("./democracy/definitions"));
var _definitions13 = _interopRequireDefault(require("./dev/definitions"));
var _definitions14 = _interopRequireDefault(require("./discovery/definitions"));
var _definitions15 = _interopRequireDefault(require("./elections/definitions"));
var _definitions16 = _interopRequireDefault(require("./engine/definitions"));
var _definitions17 = _interopRequireDefault(require("./evm/definitions"));
var _definitions18 = _interopRequireDefault(require("./extrinsics/definitions"));
var _definitions19 = _interopRequireDefault(require("./genericAsset/definitions"));
var _definitions20 = _interopRequireDefault(require("./gilt/definitions"));
var _definitions21 = _interopRequireDefault(require("./grandpa/definitions"));
var _definitions22 = _interopRequireDefault(require("./identity/definitions"));
var _definitions23 = _interopRequireDefault(require("./imOnline/definitions"));
var _definitions24 = _interopRequireDefault(require("./lottery/definitions"));
var _definitions25 = _interopRequireDefault(require("./mmr/definitions"));
var _definitions26 = _interopRequireDefault(require("./nompools/definitions"));
var _definitions27 = _interopRequireDefault(require("./offences/definitions"));
var _definitions28 = _interopRequireDefault(require("./pow/definitions"));
var _definitions29 = _interopRequireDefault(require("./proxy/definitions"));
var _definitions30 = _interopRequireDefault(require("./recovery/definitions"));
var _definitions31 = _interopRequireDefault(require("./scheduler/definitions"));
var _definitions32 = _interopRequireDefault(require("./session/definitions"));
var _definitions33 = _interopRequireDefault(require("./society/definitions"));
var _definitions34 = _interopRequireDefault(require("./staking/definitions"));
var _definitions35 = _interopRequireDefault(require("./support/definitions"));
var _definitions36 = _interopRequireDefault(require("./syncstate/definitions"));
var _definitions37 = _interopRequireDefault(require("./system/definitions"));
var _definitions38 = _interopRequireDefault(require("./treasury/definitions"));
var _definitions39 = _interopRequireDefault(require("./txpayment/definitions"));
var _definitions40 = _interopRequireDefault(require("./txqueue/definitions"));
var _definitions41 = _interopRequireDefault(require("./uniques/definitions"));
var _definitions42 = _interopRequireDefault(require("./utility/definitions"));
var _definitions43 = _interopRequireDefault(require("./vesting/definitions"));
var _definitions44 = _interopRequireDefault(require("./attestations/definitions"));
var _definitions45 = _interopRequireDefault(require("./bridges/definitions"));
var _definitions46 = _interopRequireDefault(require("./claims/definitions"));
var _definitions47 = _interopRequireDefault(require("./crowdloan/definitions"));
var _definitions48 = _interopRequireDefault(require("./cumulus/definitions"));
var _definitions49 = _interopRequireDefault(require("./finality/definitions"));
var _definitions50 = _interopRequireDefault(require("./parachains/definitions"));
var _definitions51 = _interopRequireDefault(require("./poll/definitions"));
var _definitions52 = _interopRequireDefault(require("./purchase/definitions"));
var _definitions53 = _interopRequireDefault(require("./xcm/definitions"));
var _definitions54 = _interopRequireDefault(require("./contractsAbi/definitions"));
var _definitions55 = _interopRequireDefault(require("./eth/definitions"));
var _definitions56 = _interopRequireDefault(require("./nimbus/definitions"));
var _definitions57 = _interopRequireDefault(require("./ormlOracle/definitions"));
var _definitions58 = _interopRequireDefault(require("./ormlTokens/definitions"));
var _definitions59 = _interopRequireDefault(require("./rpc/definitions"));
var _definitions60 = _interopRequireDefault(require("./author/definitions"));
var _definitions61 = _interopRequireDefault(require("./chain/definitions"));
var _definitions62 = _interopRequireDefault(require("./childstate/definitions"));
var _definitions63 = _interopRequireDefault(require("./offchain/definitions"));
var _definitions64 = _interopRequireDefault(require("./payment/definitions"));
var _definitions65 = _interopRequireDefault(require("./state/definitions"));