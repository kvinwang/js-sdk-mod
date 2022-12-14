"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.decodeLatestMeta = decodeLatestMeta;
exports.defaultValues = defaultValues;
exports.testMeta = testMeta;
exports.toLatest = toLatest;
var _fs = _interopRequireDefault(require("fs"));
var _path = _interopRequireDefault(require("path"));
var _util = require("@polkadot/util");
var _create = require("../../create");
var _StorageKey = require("../../primitive/StorageKey");
var _Metadata = require("../Metadata");
var _getUniqTypes = require("./getUniqTypes");
// Copyright 2017-2022 @polkadot/types authors & contributors
// SPDX-License-Identifier: Apache-2.0

function writeJson(json, version, type, sub) {
  _fs.default.writeFileSync(_path.default.join(process.cwd(), `packages/types-support/src/metadata/v${version}/${type}-${sub}.json`), (0, _util.stringify)(json, 2), {
    flag: 'w'
  });
}

/** @internal */
function decodeLatestMeta(registry, type, version, _ref) {
  let {
    compare,
    data,
    types
  } = _ref;
  const metadata = new _Metadata.Metadata(registry, data);
  registry.setMetadata(metadata);
  it('decodes latest substrate properly', () => {
    const json = metadata.toJSON();
    delete json.metadata[`v${metadata.version}`].lookup;
    expect(metadata.version).toBe(version);
    try {
      expect(json).toEqual(compare);
    } catch (error) {
      if (process.env.GITHUB_REPOSITORY) {
        console.error((0, _util.stringify)(json));
        throw error;
      }
      writeJson(json, version, type, 'json');
    }
  });
  it('decodes latest types correctly', () => {
    if (types) {
      const json = metadata.asLatest.lookup.types.toJSON();
      try {
        expect(json).toEqual(types);
      } catch (error) {
        if (process.env.GITHUB_REPOSITORY) {
          console.error((0, _util.stringify)(metadata.toJSON()));
          throw error;
        }
        writeJson(json, version, type, 'types');
      }
    }
  });
}

/** @internal */
function toLatest(registry, version, _ref2) {
  let {
    data
  } = _ref2;
  let withThrow = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : true;
  it(`converts v${version} to latest`, () => {
    const metadata = new _Metadata.Metadata(registry, data);
    registry.setMetadata(metadata);
    const latest = metadata.asLatest;
    if (metadata.version < 14) {
      (0, _getUniqTypes.getUniqTypes)(registry, latest, withThrow);
    }
  });
}

/** @internal */
function defaultValues(registry, _ref3) {
  let {
    data,
    fails = []
  } = _ref3;
  let withThrow = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;
  let withFallbackCheck = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
  describe('storage with default values', () => {
    const metadata = new _Metadata.Metadata(registry, data);
    const {
      pallets
    } = metadata.asLatest;
    pallets.filter(_ref4 => {
      let {
        storage
      } = _ref4;
      return storage.isSome;
    }).forEach(_ref5 => {
      let {
        name,
        storage
      } = _ref5;
      const sectionName = (0, _util.stringCamelCase)(name);
      storage.unwrap().items.forEach(_ref6 => {
        let {
          fallback,
          modifier,
          name,
          type
        } = _ref6;
        const inner = (0, _StorageKey.unwrapStorageType)(registry, type, modifier.isOptional);
        const location = `${sectionName}.${(0, _util.stringCamelCase)(name)}: ${inner}`;
        it(location, () => {
          expect(() => {
            try {
              const instance = registry.createTypeUnsafe(registry.createLookupType((0, _StorageKey.unwrapStorageSi)(type)), [(0, _util.hexToU8a)(fallback.toHex())], {
                isOptional: modifier.isOptional
              });
              if (withFallbackCheck) {
                const [hexType, hexOrig] = [(0, _util.u8aToHex)(instance.toU8a()), (0, _util.u8aToHex)(fallback.toU8a(true))];
                if (hexType !== hexOrig) {
                  throw new Error(`Fallback does not match (${(hexOrig.length - 2) / 2 - (hexType.length - 2) / 2} bytes missing): ${hexType} !== ${hexOrig}`);
                }
              }
            } catch (error) {
              const message = `${location}:: ${error.message}`;
              if (withThrow && !fails.some(f => location.includes(f))) {
                throw new Error(message);
              } else {
                console.warn(message);
              }
            }
          }).not.toThrow();
        });
      });
    });
  });
}
function serialize(registry, _ref7) {
  let {
    data
  } = _ref7;
  const metadata = new _Metadata.Metadata(registry, data);
  it('serializes to hex in the same form as retrieved', () => {
    expect(metadata.toHex()).toEqual(data);
  });

  // NOTE Assuming the first passes this is actually something that doesn't test
  // anything new. If the first line in this function passed and the above values
  // are equivalent, this would be as well.
  it.skip('can construct from a re-serialized form', () => {
    expect(() => new _Metadata.Metadata(registry, metadata.toHex())).not.toThrow();
  });

  // as used in the extension
  it('can construct from asCallsOnly.toHex()', () => {
    expect(() => new _Metadata.Metadata(registry, metadata.asCallsOnly.toHex())).not.toThrow();
  });
}
function testMeta(version, matchers) {
  let withFallback = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;
  describe(`MetadataV${version}`, () => {
    describe.each(Object.keys(matchers))('%s', type => {
      const matcher = matchers[type];
      const registry = new _create.TypeRegistry();
      serialize(registry, matcher);
      decodeLatestMeta(registry, type, version, matcher);
      toLatest(registry, version, matcher);
      defaultValues(registry, matcher, true, withFallback);
    });
  });
}