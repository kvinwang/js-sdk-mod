// Copyright 2017-2022 @polkadot/keyring authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { hexToU8a, isHex, stringToU8a } from '@polkadot/util';
import { base64Decode, decodeAddress, ed25519PairFromSeed as ed25519FromSeed, encodeAddress, ethereumEncode, hdEthereum, keyExtractSuri, keyFromPath, mnemonicToLegacySeed, mnemonicToMiniSecret, secp256k1PairFromSeed as secp256k1FromSeed, sr25519PairFromSeed as sr25519FromSeed } from '@polkadot/util-crypto';
import { DEV_PHRASE } from "./defaults.js";
import { createPair } from "./pair/index.js";
import { Pairs } from "./pairs.js";
const PairFromSeed = {
  ecdsa: seed => secp256k1FromSeed(seed),
  ed25519: seed => ed25519FromSeed(seed),
  ethereum: seed => secp256k1FromSeed(seed),
  sr25519: seed => sr25519FromSeed(seed)
};
function pairToPublic({
  publicKey
}) {
  return publicKey;
}

/**
 * # @polkadot/keyring
 *
 * ## Overview
 *
 * @name Keyring
 * @summary Keyring management of user accounts
 * @description Allows generation of keyring pairs from a variety of input combinations, such as
 * json object containing account address or public key, account metadata, and account encoded using
 * `addFromJson`, or by providing those values as arguments separately to `addFromAddress`,
 * or by providing the mnemonic (seed phrase) and account metadata as arguments to `addFromMnemonic`.
 * Stores the keyring pairs in a keyring pair dictionary. Removal of the keyring pairs from the keyring pair
 * dictionary is achieved using `removePair`. Retrieval of all the stored pairs via `getPairs` or perform
 * lookup of a pair for a given account address or public key using `getPair`. JSON metadata associated with
 * an account may be obtained using `toJson` accompanied by the account passphrase.
 */
export class Keyring {
  #pairs;
  #type;
  #ss58;
  decodeAddress = decodeAddress;
  constructor(options = {}) {
    options.type = options.type || 'ed25519';
    if (!['ecdsa', 'ethereum', 'ed25519', 'sr25519'].includes(options.type || 'undefined')) {
      throw new Error(`Expected a keyring type of either 'ed25519', 'sr25519', 'ethereum' or 'ecdsa', found '${options.type || 'unknown'}`);
    }
    this.#pairs = new Pairs();
    this.#ss58 = options.ss58Format;
    this.#type = options.type;
  }

  /**
   * @description retrieve the pairs (alias for getPairs)
   */
  get pairs() {
    return this.getPairs();
  }

  /**
   * @description retrieve the publicKeys (alias for getPublicKeys)
   */
  get publicKeys() {
    return this.getPublicKeys();
  }

  /**
   * @description Returns the type of the keyring, ed25519, sr25519 or ecdsa
   */
  get type() {
    return this.#type;
  }

  /**
   * @name addPair
   * @summary Stores an account, given a keyring pair, as a Key/Value (public key, pair) in Keyring Pair Dictionary
   */
  addPair(pair) {
    return this.#pairs.add(pair);
  }

  /**
   * @name addFromAddress
   * @summary Stores an account, given an account address, as a Key/Value (public key, pair) in Keyring Pair Dictionary
   * @description Allows user to explicitly provide separate inputs including account address or public key, and optionally
   * the associated account metadata, and the default encoded value as arguments (that may be obtained from the json file
   * of an account backup), and then generates a keyring pair from them that it passes to
   * `addPair` to stores in a keyring pair dictionary the public key of the generated pair as a key and the pair as the associated value.
   */
  addFromAddress(address, meta = {}, encoded = null, type = this.type, ignoreChecksum, encType) {
    const publicKey = this.decodeAddress(address, ignoreChecksum);
    return this.addPair(createPair({
      toSS58: this.encodeAddress,
      type
    }, {
      publicKey,
      secretKey: new Uint8Array()
    }, meta, encoded, encType));
  }

  /**
   * @name addFromJson
   * @summary Stores an account, given JSON data, as a Key/Value (public key, pair) in Keyring Pair Dictionary
   * @description Allows user to provide a json object argument that contains account information (that may be obtained from the json file
   * of an account backup), and then generates a keyring pair from it that it passes to
   * `addPair` to stores in a keyring pair dictionary the public key of the generated pair as a key and the pair as the associated value.
   */
  addFromJson(json, ignoreChecksum) {
    return this.addPair(this.createFromJson(json, ignoreChecksum));
  }

  /**
   * @name addFromMnemonic
   * @summary Stores an account, given a mnemonic, as a Key/Value (public key, pair) in Keyring Pair Dictionary
   * @description Allows user to provide a mnemonic (seed phrase that is provided when account is originally created)
   * argument and a metadata argument that contains account information (that may be obtained from the json file
   * of an account backup), and then generates a keyring pair from it that it passes to
   * `addPair` to stores in a keyring pair dictionary the public key of the generated pair as a key and the pair as the associated value.
   */
  addFromMnemonic(mnemonic, meta = {}, type = this.type) {
    return this.addFromUri(mnemonic, meta, type);
  }

  /**
   * @name addFromPair
   * @summary Stores an account created from an explicit publicKey/secreteKey combination
   */
  addFromPair(pair, meta = {}, type = this.type) {
    return this.addPair(this.createFromPair(pair, meta, type));
  }

  /**
   * @name addFromSeed
   * @summary Stores an account, given seed data, as a Key/Value (public key, pair) in Keyring Pair Dictionary
   * @description Stores in a keyring pair dictionary the public key of the pair as a key and the pair as the associated value.
   * Allows user to provide the account seed as an argument, and then generates a keyring pair from it that it passes to
   * `addPair` to store in a keyring pair dictionary the public key of the generated pair as a key and the pair as the associated value.
   */
  addFromSeed(seed, meta = {}, type = this.type) {
    return this.addPair(createPair({
      toSS58: this.encodeAddress,
      type
    }, PairFromSeed[type](seed), meta, null));
  }

  /**
   * @name addFromUri
   * @summary Creates an account via an suri
   * @description Extracts the phrase, path and password from a SURI format for specifying secret keys `<secret>/<soft-key>//<hard-key>///<password>` (the `///password` may be omitted, and `/<soft-key>` and `//<hard-key>` maybe repeated and mixed). The secret can be a hex string, mnemonic phrase or a string (to be padded)
   */
  addFromUri(suri, meta = {}, type = this.type) {
    return this.addPair(this.createFromUri(suri, meta, type));
  }

  /**
   * @name createFromJson
   * @description Creates a pair from a JSON keyfile
   */
  createFromJson({
    address,
    encoded,
    encoding: {
      content,
      type,
      version
    },
    meta
  }, ignoreChecksum) {
    if (version === '3' && content[0] !== 'pkcs8') {
      throw new Error(`Unable to decode non-pkcs8 type, [${content.join(',')}] found}`);
    }
    const cryptoType = version === '0' || !Array.isArray(content) ? this.type : content[1];
    const encType = !Array.isArray(type) ? [type] : type;
    if (!['ed25519', 'sr25519', 'ecdsa', 'ethereum'].includes(cryptoType)) {
      throw new Error(`Unknown crypto type ${cryptoType}`);
    }

    // Here the address and publicKey are 32 bytes and isomorphic. This is why the address field needs to be the public key for ethereum type pairs
    const publicKey = isHex(address) ? hexToU8a(address) : this.decodeAddress(address, ignoreChecksum);
    const decoded = isHex(encoded) ? hexToU8a(encoded) : base64Decode(encoded);
    return createPair({
      toSS58: this.encodeAddress,
      type: cryptoType
    }, {
      publicKey,
      secretKey: new Uint8Array()
    }, meta, decoded, encType);
  }

  /**
   * @name createFromPair
   * @summary Creates a pair from an explicit publicKey/secreteKey combination
   */
  createFromPair(pair, meta = {}, type = this.type) {
    return createPair({
      toSS58: this.encodeAddress,
      type
    }, pair, meta, null);
  }

  /**
   * @name createFromUri
   * @summary Creates a Keypair from an suri
   * @description This creates a pair from the suri, but does not add it to the keyring
   */
  createFromUri(_suri, meta = {}, type = this.type) {
    // here we only aut-add the dev phrase if we have a hard-derived path
    const suri = _suri.startsWith('//') ? `${DEV_PHRASE}${_suri}` : _suri;
    const {
      derivePath,
      password,
      path,
      phrase
    } = keyExtractSuri(suri);
    let seed;
    const isPhraseHex = isHex(phrase, 256);
    if (isPhraseHex) {
      seed = hexToU8a(phrase);
    } else {
      const parts = phrase.split(' ');
      if ([12, 15, 18, 21, 24].includes(parts.length)) {
        seed = type === 'ethereum' ? mnemonicToLegacySeed(phrase, '', false, 64) : mnemonicToMiniSecret(phrase, password);
      } else {
        if (phrase.length > 32) {
          throw new Error('specified phrase is not a valid mnemonic and is invalid as a raw seed at > 32 bytes');
        }
        seed = stringToU8a(phrase.padEnd(32));
      }
    }
    const derived = type === 'ethereum' ? isPhraseHex ? PairFromSeed[type](seed) // for eth, if the private key is provided as suri, it must be derived only once
    : hdEthereum(seed, derivePath.substring(1)) : keyFromPath(PairFromSeed[type](seed), path, type);
    return createPair({
      toSS58: this.encodeAddress,
      type
    }, derived, meta, null);
  }

  /**
   * @name encodeAddress
   * @description Encodes the input into an ss58 representation
   */
  encodeAddress = (address, ss58Format) => {
    return this.type === 'ethereum' ? ethereumEncode(address) : encodeAddress(address, ss58Format === undefined ? this.#ss58 : ss58Format);
  };

  /**
   * @name getPair
   * @summary Retrieves an account keyring pair from the Keyring Pair Dictionary, given an account address
   * @description Returns a keyring pair value from the keyring pair dictionary by performing
   * a key lookup using the provided account address or public key (after decoding it).
   */
  getPair(address) {
    return this.#pairs.get(address);
  }

  /**
   * @name getPairs
   * @summary Retrieves all account keyring pairs from the Keyring Pair Dictionary
   * @description Returns an array list of all the keyring pair values that are stored in the keyring pair dictionary.
   */
  getPairs() {
    return this.#pairs.all();
  }

  /**
   * @name getPublicKeys
   * @summary Retrieves Public Keys of all Keyring Pairs stored in the Keyring Pair Dictionary
   * @description Returns an array list of all the public keys associated with each of the keyring pair values that are stored in the keyring pair dictionary.
   */
  getPublicKeys() {
    return this.#pairs.all().map(pairToPublic);
  }

  /**
   * @name removePair
   * @description Deletes the provided input address or public key from the stored Keyring Pair Dictionary.
   */
  removePair(address) {
    this.#pairs.remove(address);
  }

  /**
   * @name setSS58Format;
   * @description Sets the ss58 format for the keyring
   */
  setSS58Format(ss58) {
    this.#ss58 = ss58;
  }

  /**
   * @name toJson
   * @summary Returns a JSON object associated with the input argument that contains metadata assocated with an account
   * @description Returns a JSON object containing the metadata associated with an account
   * when valid address or public key and when the account passphrase is provided if the account secret
   * is not already unlocked and available in memory. Note that in [Polkadot-JS Apps](https://github.com/polkadot-js/apps) the user
   * may backup their account to a JSON file that contains this information.
   */
  toJson(address, passphrase) {
    return this.#pairs.get(address).toJson(passphrase);
  }
}