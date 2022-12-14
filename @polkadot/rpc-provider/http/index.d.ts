import type { ProviderInterface, ProviderInterfaceCallback, ProviderInterfaceEmitCb, ProviderInterfaceEmitted, ProviderStats } from '../types';
/**
 * # @polkadot/rpc-provider
 *
 * @name HttpProvider
 *
 * @description The HTTP Provider allows sending requests using HTTP to a HTTP RPC server TCP port. It does not support subscriptions so you won't be able to listen to events such as new blocks or balance changes. It is usually preferable using the [[WsProvider]].
 *
 * @example
 * <BR>
 *
 * ```javascript
 * import Api from '@polkadot/api/promise';
 * import { HttpProvider } from '@polkadot/rpc-provider';
 *
 * const provider = new HttpProvider('http://127.0.0.1:9933');
 * const api = new Api(provider);
 * ```
 *
 * @see [[WsProvider]]
 */
export declare class HttpProvider implements ProviderInterface {
    #private;
    /**
     * @param {string} endpoint The endpoint url starting with http://
     */
    constructor(endpoint?: string, headers?: Record<string, string>);
    /**
     * @summary `true` when this provider supports subscriptions
     */
    get hasSubscriptions(): boolean;
    /**
     * @description Returns a clone of the object
     */
    clone(): HttpProvider;
    /**
     * @description Manually connect from the connection
     */
    connect(): Promise<void>;
    /**
     * @description Manually disconnect from the connection
     */
    disconnect(): Promise<void>;
    /**
     * @description Returns the connection stats
     */
    get stats(): ProviderStats;
    /**
     * @summary `true` when this provider supports clone()
     */
    get isClonable(): boolean;
    /**
     * @summary Whether the node is connected or not.
     * @return {boolean} true if connected
     */
    get isConnected(): boolean;
    /**
     * @summary Events are not supported with the HttpProvider, see [[WsProvider]].
     * @description HTTP Provider does not have 'on' emitters. WebSockets should be used instead.
     */
    on(type: ProviderInterfaceEmitted, sub: ProviderInterfaceEmitCb): () => void;
    /**
     * @summary Send HTTP POST Request with Body to configured HTTP Endpoint.
     */
    send<T>(method: string, params: unknown[], isCacheable?: boolean): Promise<T>;
    /**
     * @summary Subscriptions are not supported with the HttpProvider, see [[WsProvider]].
     */
    subscribe(types: string, method: string, params: unknown[], cb: ProviderInterfaceCallback): Promise<number>;
    /**
     * @summary Subscriptions are not supported with the HttpProvider, see [[WsProvider]].
     */
    unsubscribe(type: string, method: string, id: number): Promise<boolean>;
}
