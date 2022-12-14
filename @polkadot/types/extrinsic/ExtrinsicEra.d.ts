/// <reference types="bn.js" />
import type { AnyU8a, Registry } from '@polkadot/types-codec/types';
import type { BN } from '@polkadot/util';
import type { IExtrinsicEra, INumber } from '../types';
import { Enum, Raw, Tuple } from '@polkadot/types-codec';
interface MortalMethod {
    current: number;
    period: number;
}
/**
 * @name ImmortalEra
 * @description
 * The ImmortalEra for an extrinsic
 */
export declare class ImmortalEra extends Raw {
    constructor(registry: Registry, value?: AnyU8a);
}
/**
 * @name MortalEra
 * @description
 * The MortalEra for an extrinsic, indicating period and phase
 */
export declare class MortalEra extends Tuple {
    constructor(registry: Registry, value?: MortalMethod | Uint8Array | number[] | string);
    /**
     * @description Encoded length for mortals occupy 2 bytes, different from the actual Tuple since it is encoded. This is a shortcut fro `toU8a().length`
     */
    get encodedLength(): number;
    /**
     * @description The period of this Mortal wraps as a [[U64]]
     */
    get period(): INumber;
    /**
     * @description The phase of this Mortal wraps as a [[U64]]
     */
    get phase(): INumber;
    /**
     * @description Converts the Object to to a human-friendly JSON, with additional fields, expansion and formatting of information
     */
    toHuman(): any;
    /**
     * @description Returns a JSON representation of the actual value
     */
    toJSON(): any;
    /**
     * @description Encodes the value as a Uint8Array as per the parity-codec specifications
     * @param isBare true when the value has none of the type-specific prefixes (internal)
     * Period and phase are encoded:
     *   - The period of validity from the block hash found in the signing material.
     *   - The phase in the period that this transaction's lifetime begins (and, importantly,
     *     implies which block hash is included in the signature material). If the `period` is
     *     greater than 1 << 12, then it will be a factor of the times greater than 1<<12 that
     *     `period` is.
     */
    toU8a(isBare?: boolean): Uint8Array;
    /**
     * @description Get the block number of the start of the era whose properties this object describes that `current` belongs to.
     */
    birth(current: BN | bigint | number | string): number;
    /**
     * @description Get the block number of the first block at which the era has ended.
     */
    death(current: BN | bigint | number | string): number;
}
/**
 * @name GenericExtrinsicEra
 * @description
 * The era for an extrinsic, indicating either a mortal or immortal extrinsic
 */
export declare class GenericExtrinsicEra extends Enum implements IExtrinsicEra {
    constructor(registry: Registry, value?: unknown);
    /**
     * @description Override the encoded length method
     */
    get encodedLength(): number;
    /**
     * @description Returns the item as a [[ImmortalEra]]
     */
    get asImmortalEra(): ImmortalEra;
    /**
     * @description Returns the item as a [[MortalEra]]
     */
    get asMortalEra(): MortalEra;
    /**
     * @description `true` if Immortal
     */
    get isImmortalEra(): boolean;
    /**
     * @description `true` if Mortal
     */
    get isMortalEra(): boolean;
    /**
     * @description Encodes the value as a Uint8Array as per the parity-codec specifications
     * @param isBare true when the value has none of the type-specific prefixes (internal)
     */
    toU8a(isBare?: boolean): Uint8Array;
}
export {};
