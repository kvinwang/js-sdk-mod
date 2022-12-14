/// <reference types="bn.js" />
import type { ExtDef } from '@polkadot/types/extrinsic/signedExtensions/types';
import type { Hash } from '@polkadot/types/interfaces';
import type { ChainUpgradeVersion, CodecHasher, DefinitionRpc, DefinitionRpcSub, DefinitionsCall, OverrideModuleType, Registry, RegistryTypes } from '@polkadot/types/types';
import type { Text } from '@polkadot/types-codec';
import type { BN } from '@polkadot/util';
/**
 * @description Based on the chain and runtimeVersion, get the applicable signed extensions (ready for registration)
 */
export declare function getSpecExtensions({ knownTypes }: Registry, chainName: Text | string, specName: Text | string): ExtDef;
/**
 * @description Based on the chain and runtimeVersion, get the applicable types (ready for registration)
 */
export declare function getSpecTypes({ knownTypes }: Registry, chainName: Text | string, specName: Text | string, specVersion: bigint | BN | number): RegistryTypes;
/**
 * @description Based on the chain or spec, return the hasher used
 */
export declare function getSpecHasher({ knownTypes }: Registry, chainName: Text | string, specName: Text | string): CodecHasher | null;
/**
 * @description Based on the chain and runtimeVersion, get the applicable rpc definitions (ready for registration)
 */
export declare function getSpecRpc({ knownTypes }: Registry, chainName: Text | string, specName: Text | string): Record<string, Record<string, DefinitionRpc | DefinitionRpcSub>>;
/**
 * @description Based on the chain and runtimeVersion, get the applicable runtime definitions (ready for registration)
 */
export declare function getSpecRuntime({ knownTypes }: Registry, chainName: Text | string, specName: Text | string): DefinitionsCall;
/**
 * @description Based on the chain and runtimeVersion, get the applicable alias definitions (ready for registration)
 */
export declare function getSpecAlias({ knownTypes }: Registry, chainName: Text | string, specName: Text | string): Record<string, OverrideModuleType>;
/**
 * @description Returns a version record for known chains where upgrades are being tracked
 */
export declare function getUpgradeVersion(genesisHash: Hash, blockNumber: BN): [ChainUpgradeVersion | undefined, ChainUpgradeVersion | undefined];
