"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.MetadataVersioned = void 0;
var _typesCodec = require("@polkadot/types-codec");
var _toV = require("./v9/toV10");
var _toV2 = require("./v10/toV11");
var _toV3 = require("./v11/toV12");
var _toV4 = require("./v12/toV13");
var _toV5 = require("./v13/toV14");
var _toLatest = require("./v14/toLatest");
var _MagicNumber = require("./MagicNumber");
var _util = require("./util");
// Copyright 2017-2022 @polkadot/types authors & contributors
// SPDX-License-Identifier: Apache-2.0

// Use these to generate all the Meta* types below via template keys
// NOTE: Keep from latest -> earliest, see the LATEST_VERSION 0 index
const KNOWN_VERSIONS = [14, 13, 12, 11, 10, 9];
const LATEST_VERSION = KNOWN_VERSIONS[0];
/**
 * @name MetadataVersioned
 * @description
 * The versioned runtime metadata as a decoded structure
 */
class MetadataVersioned extends _typesCodec.Struct {
  #converted = new Map();
  constructor(registry, value) {
    // const timeStart = performance.now()

    super(registry, {
      magicNumber: _MagicNumber.MagicNumber,
      metadata: 'MetadataAll'
    }, value);

    // console.log('MetadataVersioned', `${(performance.now() - timeStart).toFixed(2)}ms`)
  }

  #assertVersion = version => {
    if (this.version > version) {
      throw new Error(`Cannot convert metadata from version ${this.version} to ${version}`);
    }
    return this.version === version;
  };
  #getVersion = (version, fromPrev) => {
    const asCurr = `asV${version}`;
    const asPrev = version === 'latest' ? `asV${LATEST_VERSION}` : `asV${version - 1}`;
    if (version !== 'latest' && this.#assertVersion(version)) {
      return this.#metadata()[asCurr];
    }
    if (!this.#converted.has(version)) {
      this.#converted.set(version, fromPrev(this.registry, this[asPrev], this.version));
    }
    return this.#converted.get(version);
  };

  /**
   * @description the metadata wrapped
   */
  #metadata = () => {
    return this.getT('metadata');
  };

  /**
   * @description Returns the wrapped metadata as a limited calls-only (latest) version
   */
  get asCallsOnly() {
    return new MetadataVersioned(this.registry, {
      magicNumber: this.magicNumber,
      metadata: this.registry.createTypeUnsafe('MetadataAll', [(0, _util.toCallsOnly)(this.registry, this.asLatest), LATEST_VERSION])
    });
  }

  /**
   * @description Returns the wrapped metadata as a V9 object
   */
  get asV9() {
    this.#assertVersion(9);
    return this.#metadata().asV9;
  }

  /**
   * @description Returns the wrapped values as a V10 object
   */
  get asV10() {
    return this.#getVersion(10, _toV.toV10);
  }

  /**
   * @description Returns the wrapped values as a V11 object
   */
  get asV11() {
    return this.#getVersion(11, _toV2.toV11);
  }

  /**
   * @description Returns the wrapped values as a V12 object
   */
  get asV12() {
    return this.#getVersion(12, _toV3.toV12);
  }

  /**
   * @description Returns the wrapped values as a V13 object
   */
  get asV13() {
    return this.#getVersion(13, _toV4.toV13);
  }

  /**
   * @description Returns the wrapped values as a V14 object
   */
  get asV14() {
    return this.#getVersion(14, _toV5.toV14);
  }

  /**
   * @description Returns the wrapped values as a latest version object
   */
  get asLatest() {
    return this.#getVersion('latest', _toLatest.toLatest);
  }

  /**
   * @description The magicNumber for the Metadata (known constant)
   */
  get magicNumber() {
    return this.getT('magicNumber');
  }

  /**
   * @description the metadata version this structure represents
   */
  get version() {
    return this.#metadata().index;
  }
  getUniqTypes(throwError) {
    return (0, _util.getUniqTypes)(this.registry, this.asLatest, throwError);
  }

  /**
   * @description Converts the Object to JSON, typically used for RPC transfers
   */
  toJSON() {
    // HACK(y): ensure that we apply the aliases if we have not done so already, this is
    // needed to ensure we have the correct overrides (which is only applied in toLatest)
    // eslint-disable-next-line no-unused-expressions
    this.asLatest;
    return super.toJSON();
  }
}
exports.MetadataVersioned = MetadataVersioned;