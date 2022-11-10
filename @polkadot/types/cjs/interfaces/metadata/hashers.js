"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.AllHashers = void 0;
// Copyright 2017-2022 @polkadot/types authors & contributors
// SPDX-License-Identifier: Apache-2.0

// order important in structs... :)
/* eslint-disable sort-keys */

const AllHashers = {
  Blake2_128: null,
  // eslint-disable-line camelcase
  Blake2_256: null,
  // eslint-disable-line camelcase
  Blake2_128Concat: null,
  // eslint-disable-line camelcase
  Twox128: null,
  Twox256: null,
  Twox64Concat: null,
  // new in v11
  Identity: null
};
exports.AllHashers = AllHashers;