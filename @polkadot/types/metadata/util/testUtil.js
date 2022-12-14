// Copyright 2017-2022 @polkadot/types authors & contributors
// SPDX-License-Identifier: Apache-2.0

import fs from 'fs';
import path from 'path';
import { hexToU8a, stringCamelCase, stringify, u8aToHex } from '@polkadot/util';
import { TypeRegistry } from "../../create/index.js";
import { unwrapStorageSi, unwrapStorageType } from "../../primitive/StorageKey.js";
import { Metadata } from "../Metadata.js";
import { getUniqTypes } from "./getUniqTypes.js";
function writeJson(json, version, type, sub) {
  fs.writeFileSync(path.join(process.cwd(), `packages/types-support/src/metadata/v${version}/${type}-${sub}.json`), stringify(json, 2), {
    flag: 'w'
  });
}

/** @internal */
export function decodeLatestMeta(registry, type, version, {
  compare,
  data,
  types
}) {
  const metadata = new Metadata(registry, data);
  registry.setMetadata(metadata);
  it('decodes latest substrate properly', () => {
    const json = metadata.toJSON();
    delete json.metadata[`v${metadata.version}`].lookup;
    expect(metadata.version).toBe(version);
    try {
      expect(json).toEqual(compare);
    } catch (error) {
      if (process.env.GITHUB_REPOSITORY) {
        console.error(stringify(json));
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
          console.error(stringify(metadata.toJSON()));
          throw error;
        }
        writeJson(json, version, type, 'types');
      }
    }
  });
}

/** @internal */
export function toLatest(registry, version, {
  data
}, withThrow = true) {
  it(`converts v${version} to latest`, () => {
    const metadata = new Metadata(registry, data);
    registry.setMetadata(metadata);
    const latest = metadata.asLatest;
    if (metadata.version < 14) {
      getUniqTypes(registry, latest, withThrow);
    }
  });
}

/** @internal */
export function defaultValues(registry, {
  data,
  fails = []
}, withThrow = true, withFallbackCheck = false) {
  describe('storage with default values', () => {
    const metadata = new Metadata(registry, data);
    const {
      pallets
    } = metadata.asLatest;
    pallets.filter(({
      storage
    }) => storage.isSome).forEach(({
      name,
      storage
    }) => {
      const sectionName = stringCamelCase(name);
      storage.unwrap().items.forEach(({
        fallback,
        modifier,
        name,
        type
      }) => {
        const inner = unwrapStorageType(registry, type, modifier.isOptional);
        const location = `${sectionName}.${stringCamelCase(name)}: ${inner}`;
        it(location, () => {
          expect(() => {
            try {
              const instance = registry.createTypeUnsafe(registry.createLookupType(unwrapStorageSi(type)), [hexToU8a(fallback.toHex())], {
                isOptional: modifier.isOptional
              });
              if (withFallbackCheck) {
                const [hexType, hexOrig] = [u8aToHex(instance.toU8a()), u8aToHex(fallback.toU8a(true))];
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
function serialize(registry, {
  data
}) {
  const metadata = new Metadata(registry, data);
  it('serializes to hex in the same form as retrieved', () => {
    expect(metadata.toHex()).toEqual(data);
  });

  // NOTE Assuming the first passes this is actually something that doesn't test
  // anything new. If the first line in this function passed and the above values
  // are equivalent, this would be as well.
  it.skip('can construct from a re-serialized form', () => {
    expect(() => new Metadata(registry, metadata.toHex())).not.toThrow();
  });

  // as used in the extension
  it('can construct from asCallsOnly.toHex()', () => {
    expect(() => new Metadata(registry, metadata.asCallsOnly.toHex())).not.toThrow();
  });
}
export function testMeta(version, matchers, withFallback = true) {
  describe(`MetadataV${version}`, () => {
    describe.each(Object.keys(matchers))('%s', type => {
      const matcher = matchers[type];
      const registry = new TypeRegistry();
      serialize(registry, matcher);
      decodeLatestMeta(registry, type, version, matcher);
      toLatest(registry, version, matcher);
      defaultValues(registry, matcher, true, withFallback);
    });
  });
}