import type { ProviderInterface, ProviderInterfaceCallback, ProviderInterfaceEmitCb, ProviderInterfaceEmitted, ProviderStats } from '../types';
interface SubscriptionHandler {
    callback: ProviderInterfaceCallback;
    type: string;
}
/**
 * # @polkadot/rpc-provider/ws
 *
 * @name WsProvider
 *
 * @description The WebSocket Provider allows sending requests using WebSocket to a WebSocket RPC server TCP port. Unlike the [[HttpProvider]], it does support subscriptions and allows listening to events such as new blocks or balance changes.
 *
 * @example
 * <BR>
 *
 * ```javascript
 * import Api from '@polkadot/api/promise';
 * import { WsProvider } from '@polkadot/rpc-provider/ws';
 *
 * const provider = new WsProvider('ws://127.0.0.1:9944');
 * const api = new Api(provider);
 * ```
 *
 * @see [[HttpProvider]]
 */
export declare class WsProvider implements ProviderInterface {
    #private;
    /**
     * @param {string | string[]}  endpoint    The endpoint url. Usually `ws://ip:9944` or `wss://ip:9944`, may provide an array of endpoint strings.
     * @param {boolean} autoConnect Whether to connect automatically or not.
     * @param {number} [timeout] Custom timeout value
     */
    constructor(endpoint?: string | string[], autoConnectMs?: number | false, headers?: Record<string, string>, timeout?: number);
    /**
     * @summary `true` when this provider supports subscriptions
     */
    get hasSubscriptions(): boolean;
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
     * @description Promise that resolves the first time we are connected and loaded
     */
    get isReady(): Promise<WsProvider>;
    /**
     * @description Returns a clone of the object
     */
    clone(): WsProvider;
    /**
     * @summary Manually connect
     * @description The [[WsProvider]] connects automatically by default, however if you decided otherwise, you may
     * connect manually using this method.
     */
    connect(): Promise<void>;
    /**
     * @description Connect, never throwing an error, but rather forcing a retry
     */
    connectWithRetry(): Promise<void>;
    /**
     * @description Manually disconnect from the connection, clearing auto-connect logic
     */
    disconnect(): Promise<void>;
    /**
     * @description Returns the connection stats
     */
    get stats(): ProviderStats;
    /**
     * @summary Listens on events after having subscribed using the [[subscribe]] function.
     * @param  {ProviderInterfaceEmitted} type Event
     * @param  {ProviderInterfaceEmitCb}  sub  Callback
     * @return unsubscribe function
     */
    on(type: ProviderInterfaceEmitted, sub: ProviderInterfaceEmitCb): () => void;
    /**
     * @summary Send JSON data using WebSockets to configured HTTP Endpoint or queue.
     * @param method The RPC methods to execute
     * @param params Encoded parameters as applicable for the method
     * @param subscription Subscription details (internally used)
     */
    send<T = any>(method: string, params: unknown[], isCacheable?: boolean, subscription?: SubscriptionHandler): Promise<T>;
    /**
     * @name subscribe
     * @summary Allows subscribing to a specific event.
     *
     * @example
     * <BR>
     *
     * ```javascript
     * const provider = new WsProvider('ws://127.0.0.1:9944');
     * const rpc = new Rpc(provider);
     *
     * rpc.state.subscribeStorage([[storage.system.account, <Address>]], (_, values) => {
     *   console.log(values)
     * }).then((subscriptionId) => {
     *   console.log('balance changes subscription id: ', subscriptionId)
     * })
     * ```
     */
    subscribe(type: string, method: string, params: unknown[], callback: ProviderInterfaceCallback): Promise<number | string>;
    /**
     * @summary Allows unsubscribing to subscriptions made with [[subscribe]].
     */
    unsubscribe(type: string, method: string, id: number | string): Promise<boolean>;
}
export {};
