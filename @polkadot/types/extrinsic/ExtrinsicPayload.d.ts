import type { AnyJson, BareOpts, Registry } from '@polkadot/types-codec/types';
import type { HexString } from '@polkadot/util/types';
import type { ExtrinsicPayloadV4 } from '../interfaces/extrinsics';
import type { Hash } from '../interfaces/runtime';
import type { ExtrinsicPayloadValue, ICompact, IKeyringPair, INumber } from '../types';
import { AbstractBase, Raw } from '@polkadot/types-codec';
import { GenericExtrinsicEra } from './ExtrinsicEra';
interface ExtrinsicPayloadOptions {
    version?: number;
}
declare type ExtrinsicPayloadVx = ExtrinsicPayloadV4;
/**
 * @name GenericExtrinsicPayload
 * @description
 * A signing payload for an [[Extrinsic]]. For the final encoding, it is variable length based
 * on the contents included
 */
export declare class GenericExtrinsicPayload extends AbstractBase<ExtrinsicPayloadVx> {
    constructor(registry: Registry, value?: Partial<ExtrinsicPayloadValue> | Uint8Array | string, { version }?: ExtrinsicPayloadOptions);
    /**
     * @description The block [[Hash]] the signature applies to (mortal/immortal)
     */
    get blockHash(): Hash;
    /**
     * @description The [[ExtrinsicEra]]
     */
    get era(): GenericExtrinsicEra;
    /**
     * @description The genesis block [[Hash]] the signature applies to
     */
    get genesisHash(): Hash;
    /**
     * @description The [[Raw]] contained in the payload
     */
    get method(): Raw;
    /**
     * @description The [[Index]]
     */
    get nonce(): ICompact<INumber>;
    /**
     * @description The specVersion as a [[u32]] for this payload
     */
    get specVersion(): INumber;
    /**
     * @description The [[Balance]]
     */
    get tip(): ICompact<INumber>;
    /**
     * @description The transaction version as a [[u32]] for this payload
     */
    get transactionVersion(): INumber;
    /**
     * @description Compares the value of the input to see if there is a match
     */
    eq(other?: unknown): boolean;
    /**
     * @description Sign the payload with the keypair
     */
    sign(signerPair: IKeyringPair): {
        signature: HexString;
    };
    /**
     * @description Converts the Object to to a human-friendly JSON, with additional fields, expansion and formatting of information
     */
    toHuman(isExtended?: boolean): AnyJson;
    /**
     * @description Converts the Object to JSON, typically used for RPC transfers
     */
    toJSON(): any;
    /**
     * @description Returns the string representation of the value
     */
    toString(): string;
    /**
     * @description Returns a serialized u8a form
     */
    toU8a(isBare?: BareOpts): Uint8Array;
}
export {};
