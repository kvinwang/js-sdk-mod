import type { AnyJson, AnyTuple, AnyU8a, ArgsDef, IMethod, Inspect } from '@polkadot/types-codec/types';
import type { HexString } from '@polkadot/util/types';
import type { EcdsaSignature, Ed25519Signature, ExtrinsicUnknown, ExtrinsicV4, Sr25519Signature } from '../interfaces/extrinsics';
import type { FunctionMetadataLatest } from '../interfaces/metadata';
import type { Address, Call, CodecHash } from '../interfaces/runtime';
import type { CallBase, ExtrinsicPayloadValue, ICompact, IExtrinsic, IKeyringPair, INumber, Registry, SignatureOptions } from '../types';
import type { GenericExtrinsicEra } from './ExtrinsicEra';
import type { ExtrinsicValueV4 } from './v4/Extrinsic';
import { AbstractBase } from '@polkadot/types-codec';
import { EXTRINSIC_VERSION as LATEST_EXTRINSIC_VERSION } from './v4/Extrinsic';
interface CreateOptions {
    version?: number;
}
declare type ExtrinsicVx = ExtrinsicV4;
declare type ExtrinsicValue = ExtrinsicValueV4;
export { LATEST_EXTRINSIC_VERSION };
declare abstract class ExtrinsicBase<A extends AnyTuple> extends AbstractBase<ExtrinsicVx | ExtrinsicUnknown> {
    constructor(registry: Registry, value: ExtrinsicV4 | ExtrinsicUnknown, initialU8aLength?: number);
    /**
     * @description The arguments passed to for the call, exposes args so it is compatible with [[Call]]
     */
    get args(): A;
    /**
     * @description The argument definitions, compatible with [[Call]]
     */
    get argsDef(): ArgsDef;
    /**
     * @description The actual `[sectionIndex, methodIndex]` as used in the Call
     */
    get callIndex(): Uint8Array;
    /**
     * @description The actual data for the Call
     */
    get data(): Uint8Array;
    /**
     * @description The era for this extrinsic
     */
    get era(): GenericExtrinsicEra;
    /**
     * @description The length of the value when encoded as a Uint8Array
     */
    get encodedLength(): number;
    /**
     * @description `true` id the extrinsic is signed
     */
    get isSigned(): boolean;
    /**
     * @description The length of the actual data, excluding prefix
     */
    get length(): number;
    /**
     * @description The [[FunctionMetadataLatest]] that describes the extrinsic
     */
    get meta(): FunctionMetadataLatest;
    /**
     * @description The [[Call]] this extrinsic wraps
     */
    get method(): CallBase<A>;
    /**
     * @description The nonce for this extrinsic
     */
    get nonce(): ICompact<INumber>;
    /**
     * @description The actual [[EcdsaSignature]], [[Ed25519Signature]] or [[Sr25519Signature]]
     */
    get signature(): EcdsaSignature | Ed25519Signature | Sr25519Signature;
    /**
     * @description The [[Address]] that signed
     */
    get signer(): Address;
    /**
     * @description Forwards compat
     */
    get tip(): ICompact<INumber>;
    /**
     * @description Returns the raw transaction version (not flagged with signing information)
    */
    get type(): number;
    get inner(): ExtrinsicVx;
    /**
     * @description Returns the encoded version flag
    */
    get version(): number;
    /**
     * @description Checks if the source matches this in type
     */
    is(other: IMethod<AnyTuple>): other is IMethod<A>;
    unwrap(): ExtrinsicVx;
}
/**
 * @name GenericExtrinsic
 * @description
 * Representation of an Extrinsic in the system. It contains the actual call,
 * (optional) signature and encodes with an actual length prefix
 *
 * {@link https://github.com/paritytech/wiki/blob/master/Extrinsic.md#the-extrinsic-format-for-node}.
 *
 * Can be:
 * - signed, to create a transaction
 * - left as is, to create an inherent
 */
export declare class GenericExtrinsic<A extends AnyTuple = AnyTuple> extends ExtrinsicBase<A> implements IExtrinsic<A> {
    #private;
    static LATEST_EXTRINSIC_VERSION: number;
    constructor(registry: Registry, value?: GenericExtrinsic | ExtrinsicValue | AnyU8a | Call, { version }?: CreateOptions);
    /**
     * @description returns a hash of the contents
     */
    get hash(): CodecHash;
    /**
     * @description Injects an already-generated signature into the extrinsic
     */
    addSignature(signer: Address | Uint8Array | string, signature: Uint8Array | HexString, payload: ExtrinsicPayloadValue | Uint8Array | HexString): GenericExtrinsic<A>;
    /**
     * @description Returns a breakdown of the hex encoding for this Codec
     */
    inspect(): Inspect;
    /**
     * @description Sign the extrinsic with a specific keypair
     */
    sign(account: IKeyringPair, options: SignatureOptions): GenericExtrinsic<A>;
    /**
     * @describe Adds a fake signature to the extrinsic
     */
    signFake(signer: Address | Uint8Array | string, options: SignatureOptions): GenericExtrinsic<A>;
    /**
     * @description Returns a hex string representation of the value
     */
    toHex(isBare?: boolean): HexString;
    /**
     * @description Converts the Object to to a human-friendly JSON, with additional fields, expansion and formatting of information
     */
    toHuman(isExpanded?: boolean): AnyJson;
    /**
     * @description Converts the Object to JSON, typically used for RPC transfers
     */
    toJSON(): string;
    /**
     * @description Returns the base runtime type name for this instance
     */
    toRawType(): string;
    /**
     * @description Encodes the value as a Uint8Array as per the SCALE specifications
     * @param isBare true when the value is not length-prefixed
     */
    toU8a(isBare?: boolean): Uint8Array;
    toU8aInner(): Uint8Array[];
}
