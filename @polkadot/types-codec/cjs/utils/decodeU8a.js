"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.decodeU8a = decodeU8a;
exports.decodeU8aStruct = decodeU8aStruct;
exports.decodeU8aVec = decodeU8aVec;
var _util = require("@polkadot/util");
// Copyright 2017-2022 @polkadot/types-codec authors & contributors
// SPDX-License-Identifier: Apache-2.0

/** @internal */
function formatFailure(registry, fn, result, _ref, u8a, i, count, Type, key) {
  let {
    message
  } = _ref;
  let type = '';
  try {
    type = `: ${new Type(registry).toRawType()}`;
  } catch {
    // ignore
  }

  // This is extra debugging info (we most-probably want this in in some way, shape or form,
  // but at this point not quite sure how to include and format it (it can be quite massive)
  // console.error(JSON.stringify(result, null, 2));

  return `${fn}: failed at ${(0, _util.u8aToHex)(u8a.subarray(0, 16))}…${key ? ` on ${key}` : ''} (index ${i + 1}/${count})${type}:: ${message}`;
}

/**
 * @internal
 *
 * Given an u8a, and an array of Type constructors, decode the u8a against the
 * types, and return an array of decoded values.
 *
 * @param u8a - The u8a to decode.
 * @param result - The result array (will be returned with values pushed)
 * @param types - The array of CodecClass to decode the U8a against.
 */
function decodeU8a(registry, result, u8a, _ref2) {
  let [Types, keys] = _ref2;
  const count = result.length;
  let offset = 0;
  let i = 0;
  try {
    while (i < count) {
      const value = new Types[i](registry, u8a.subarray(offset));
      offset += value.initialU8aLength || value.encodedLength;
      result[i] = value;
      i++;
    }
  } catch (error) {
    throw new Error(formatFailure(registry, 'decodeU8a', result, error, u8a.subarray(offset), i, count, Types[i], keys[i]));
  }
  return [result, offset];
}

/**
 * @internal
 *
 * Split from decodeU8a since this is specialized to zip returns ... while we duplicate, this
 * is all on the hot-path, so it is not great, however there is (some) method behind the madness
 */
function decodeU8aStruct(registry, result, u8a, _ref3) {
  let [Types, keys] = _ref3;
  const count = result.length;
  let offset = 0;
  let i = 0;
  try {
    while (i < count) {
      const value = new Types[i](registry, u8a.subarray(offset));
      offset += value.initialU8aLength || value.encodedLength;
      result[i] = [keys[i], value];
      i++;
    }
  } catch (error) {
    throw new Error(formatFailure(registry, 'decodeU8aStruct', result, error, u8a.subarray(offset), i, count, Types[i], keys[i]));
  }
  return [result, offset];
}

/**
 * @internal
 *
 * Split from decodeU8a since this is specialized to 1 instance ... while we duplicate, this
 * is all on the hot-path, so it is not great, however there is (some) method behind the madness
 */
function decodeU8aVec(registry, result, u8a, startAt, Type) {
  const count = result.length;
  let offset = startAt;
  let i = 0;
  try {
    while (i < count) {
      const value = new Type(registry, u8a.subarray(offset));
      offset += value.initialU8aLength || value.encodedLength;
      result[i] = value;
      i++;
    }
  } catch (error) {
    throw new Error(formatFailure(registry, 'decodeU8aVec', result, error, u8a.subarray(offset), i, count, Type));
  }
  return [offset, offset - startAt];
}