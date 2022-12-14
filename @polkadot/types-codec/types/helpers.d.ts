/// <reference types="bn.js" />
import type { BN } from '@polkadot/util';
import type { Codec } from './codec';
export declare type AnyJson = string | number | boolean | null | undefined | AnyJson[] | {
    [index: string]: AnyJson;
};
export declare type AnyFunction = (...args: any[]) => any;
export declare type AnyNumber = BN | bigint | Uint8Array | number | string;
export declare type AnyFloat = Number | number | Uint8Array | string;
export declare type AnyString = String | string;
export declare type AnyBool = Boolean | boolean;
export declare type AnyTuple = Codec[];
export declare type AnyU8a = Uint8Array | number[] | string;
export declare type UIntBitLength = 8 | 16 | 32 | 64 | 128 | 256;
export declare type U8aBitLength = 8 | 16 | 32 | 64 | 128 | 160 | 256 | 264 | 512 | 520 | 1024 | 2048;
export declare type AnyTupleValue = AnyU8a | (Codec | AnyU8a | AnyNumber | AnyString | undefined | null)[];
