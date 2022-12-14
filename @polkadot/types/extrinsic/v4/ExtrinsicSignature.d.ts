import type { HexString } from '@polkadot/util/types';
import type { EcdsaSignature, Ed25519Signature, ExtrinsicEra, ExtrinsicSignature, Sr25519Signature } from '../../interfaces/extrinsics';
import type { Address, Call } from '../../interfaces/runtime';
import type { ExtrinsicPayloadValue, ICompact, IExtrinsicSignature, IKeyringPair, INumber, Registry, SignatureOptions } from '../../types';
import type { ExtrinsicSignatureOptions } from '../types';
import { Struct } from '@polkadot/types-codec';
import { GenericExtrinsicPayloadV4 } from './ExtrinsicPayload';
/**
 * @name GenericExtrinsicSignatureV4
 * @description
 * A container for the [[Signature]] associated with a specific [[Extrinsic]]
 */
export declare class GenericExtrinsicSignatureV4 extends Struct implements IExtrinsicSignature {
    #private;
    constructor(registry: Registry, value?: GenericExtrinsicSignatureV4 | Uint8Array, { isSigned }?: ExtrinsicSignatureOptions);
    /** @internal */
    static decodeExtrinsicSignature(value?: GenericExtrinsicSignatureV4 | Uint8Array, isSigned?: boolean): GenericExtrinsicSignatureV4 | Uint8Array;
    /**
     * @description The length of the value when encoded as a Uint8Array
     */
    get encodedLength(): number;
    /**
     * @description `true` if the signature is valid
     */
    get isSigned(): boolean;
    /**
     * @description The [[ExtrinsicEra]] (mortal or immortal) this signature applies to
     */
    get era(): ExtrinsicEra;
    /**
     * @description The [[Index]] for the signature
     */
    get nonce(): ICompact<INumber>;
    /**
     * @description The actual [[EcdsaSignature]], [[Ed25519Signature]] or [[Sr25519Signature]]
     */
    get signature(): EcdsaSignature | Ed25519Signature | Sr25519Signature;
    /**
     * @description The raw [[ExtrinsicSignature]]
     */
    get multiSignature(): ExtrinsicSignature;
    /**
     * @description The [[Address]] that signed
     */
    get signer(): Address;
    /**
     * @description The [[Balance]] tip
     */
    get tip(): ICompact<INumber>;
    protected _injectSignature(signer: Address, signature: ExtrinsicSignature, payload: GenericExtrinsicPayloadV4): IExtrinsicSignature;
    /**
     * @description Adds a raw signature
     */
    addSignature(signer: Address | Uint8Array | string, signature: Uint8Array | HexString, payload: ExtrinsicPayloadValue | Uint8Array | HexString): IExtrinsicSignature;
    /**
     * @description Creates a payload from the supplied options
     */
    createPayload(method: Call, options: SignatureOptions): GenericExtrinsicPayloadV4;
    /**
     * @description Generate a payload and applies the signature from a keypair
     */
    sign(method: Call, account: IKeyringPair, options: SignatureOptions): IExtrinsicSignature;
    /**
     * @description Generate a payload and applies a fake signature
     */
    signFake(method: Call, address: Address | Uint8Array | string, options: SignatureOptions): IExtrinsicSignature;
    /**
     * @description Encodes the value as a Uint8Array as per the SCALE specifications
     * @param isBare true when the value has none of the type-specific prefixes (internal)
     */
    toU8a(isBare?: boolean): Uint8Array;
}
