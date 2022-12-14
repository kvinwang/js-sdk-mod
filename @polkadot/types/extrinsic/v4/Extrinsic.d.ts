import type { HexString } from '@polkadot/util/types';
import type { ExtrinsicSignatureV4 } from '../../interfaces/extrinsics';
import type { Address, Call } from '../../interfaces/runtime';
import type { ExtrinsicPayloadValue, IExtrinsicImpl, IKeyringPair, Registry, SignatureOptions } from '../../types';
import type { ExtrinsicOptions } from '../types';
import { Struct } from '@polkadot/types-codec';
export declare const EXTRINSIC_VERSION = 4;
export interface ExtrinsicValueV4 {
    method?: Call;
    signature?: ExtrinsicSignatureV4;
}
/**
 * @name GenericExtrinsicV4
 * @description
 * The third generation of compact extrinsics
 */
export declare class GenericExtrinsicV4 extends Struct implements IExtrinsicImpl {
    constructor(registry: Registry, value?: Uint8Array | ExtrinsicValueV4 | Call, { isSigned }?: Partial<ExtrinsicOptions>);
    /** @internal */
    static decodeExtrinsic(registry: Registry, value?: Call | Uint8Array | ExtrinsicValueV4, isSigned?: boolean): ExtrinsicValueV4;
    /**
     * @description The length of the value when encoded as a Uint8Array
     */
    get encodedLength(): number;
    /**
     * @description The [[Call]] this extrinsic wraps
     */
    get method(): Call;
    /**
     * @description The [[ExtrinsicSignatureV4]]
     */
    get signature(): ExtrinsicSignatureV4;
    /**
     * @description The version for the signature
     */
    get version(): number;
    /**
     * @description Add an [[ExtrinsicSignatureV4]] to the extrinsic (already generated)
     */
    addSignature(signer: Address | Uint8Array | string, signature: Uint8Array | HexString, payload: ExtrinsicPayloadValue | Uint8Array | HexString): GenericExtrinsicV4;
    /**
     * @description Sign the extrinsic with a specific keypair
     */
    sign(account: IKeyringPair, options: SignatureOptions): GenericExtrinsicV4;
    /**
     * @describe Adds a fake signature to the extrinsic
     */
    signFake(signer: Address | Uint8Array | string, options: SignatureOptions): GenericExtrinsicV4;
}
