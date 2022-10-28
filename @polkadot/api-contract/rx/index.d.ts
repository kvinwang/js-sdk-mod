/// <reference types="node" />
import type { AccountId, Hash } from '@polkadot/types/interfaces';
import { ApiRx } from '@polkadot/api';
import { Abi } from '../Abi';
import { Blueprint, Code, Contract } from '../base';
export declare class BlueprintRx extends Blueprint<'rxjs'> {
    constructor(api: ApiRx, abi: string | Record<string, unknown> | Abi, codeHash: string | Hash);
}
export declare class CodeRx extends Code<'rxjs'> {
    constructor(api: ApiRx, abi: string | Record<string, unknown> | Abi, wasm: Uint8Array | string | Buffer | null | undefined);
}
export declare class ContractRx extends Contract<'rxjs'> {
    constructor(api: ApiRx, abi: string | Record<string, unknown> | Abi, address: string | AccountId);
}
