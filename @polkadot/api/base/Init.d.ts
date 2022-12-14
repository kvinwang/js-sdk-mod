import type { RuntimeVersion } from '@polkadot/types/interfaces';
import type { ApiDecoration, ApiOptions, ApiTypes, DecorateMethod } from '../types';
import type { VersionedRegistry } from './types';
import { Decorate } from './Decorate';
export declare abstract class Init<ApiType extends ApiTypes> extends Decorate<ApiType> {
    #private;
    constructor(options: ApiOptions, type: ApiTypes, decorateMethod: DecorateMethod<ApiType>);
    /**
     * @description Decorates a registry based on the runtime version
     */
    private _initRegistry;
    /**
     * @description Returns the default versioned registry
     */
    private _getDefaultRegistry;
    /**
     * @description Returns a decorated API instance at a specific point in time
     */
    at(blockHash: Uint8Array | string, knownVersion?: RuntimeVersion): Promise<ApiDecoration<ApiType>>;
    private _createBlockRegistry;
    private _cacheBlockRegistryProgress;
    private _getBlockRegistryViaVersion;
    private _getBlockRegistryViaHash;
    /**
     * @description Sets up a registry based on the block hash defined
     */
    getBlockRegistry(blockHash: Uint8Array, knownVersion?: RuntimeVersion): Promise<VersionedRegistry<ApiType>>;
    protected _loadMeta(): Promise<boolean>;
    private _metaFromSource;
    private _subscribeUpdates;
    private _metaFromChain;
    private _initFromMeta;
    private _subscribeHealth;
    private _unsubscribeHealth;
    private _unsubscribeUpdates;
    protected _unsubscribe(): void;
}
