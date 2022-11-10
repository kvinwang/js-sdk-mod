"use strict";
// Copyright 2017-2020 @polkadot/apps-config authors & contributors
// SPDX-License-Identifier: Apache-2.0
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.typesBundle = exports.versionedKhala = exports.khalaDev = exports.khala = exports.phalaDev = exports.typesChain = void 0;
var phala_dev_1 = __importDefault(require("./phala-dev"));
exports.phalaDev = phala_dev_1.default;
var khala_1 = __importDefault(require("./khala"));
exports.khala = khala_1.default;
var khala_dev_1 = __importDefault(require("./khala-dev"));
exports.khalaDev = khala_dev_1.default;
var versioned_khala_1 = __importDefault(require("./versioned-khala"));
exports.versionedKhala = versioned_khala_1.default;
// alphabetical
exports.typesChain = {
    'Khala': khala_1.default,
    'Khala Testnet': khala_dev_1.default,
    'Khala Local Testnet': khala_dev_1.default,
    'Phala PoC-Next': phala_dev_1.default,
    'Phala Local Testnet': phala_dev_1.default,
    'Phala Integration Test': phala_dev_1.default,
    'Phala Staging Testnet': phala_dev_1.default,
    'Phala Development': phala_dev_1.default,
};
exports.typesBundle = { alias: {}, rpc: {}, types: versioned_khala_1.default };
//# sourceMappingURL=index.js.map