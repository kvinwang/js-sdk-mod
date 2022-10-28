export interface JsonRpcObject {
    id: number;
    jsonrpc: '2.0';
}
export interface JsonRpcRequest extends JsonRpcObject {
    method: string;
    params: unknown[];
}
export interface JsonRpcResponseBaseError {
    code: number;
    data?: number | string;
    message: string;
}
export interface RpcErrorInterface<Data> {
    code: number;
    data?: Data;
    message: string;
    stack: string;
}
interface JsonRpcResponseSingle {
    error?: JsonRpcResponseBaseError;
    result?: unknown;
}
interface JsonRpcResponseSubscription {
    method?: string;
    params: {
        error?: JsonRpcResponseBaseError;
        result: unknown;
        subscription: number | string;
    };
}
export declare type JsonRpcResponseBase = JsonRpcResponseSingle & JsonRpcResponseSubscription;
export declare type JsonRpcResponse = JsonRpcObject & JsonRpcResponseBase;
export declare type ProviderInterfaceCallback = (error: Error | null, result: any) => void;
export declare type ProviderInterfaceEmitted = 'connected' | 'disconnected' | 'error';
export declare type ProviderInterfaceEmitCb = (value?: any) => any;
export interface ProviderInterface {
    readonly hasSubscriptions: boolean;
    readonly isConnected: boolean;
    readonly stats?: ProviderStats;
    clone(): ProviderInterface;
    connect(): Promise<void>;
    disconnect(): Promise<void>;
    on(type: ProviderInterfaceEmitted, sub: ProviderInterfaceEmitCb): () => void;
    send<T = any>(method: string, params: unknown[], isCacheable?: boolean): Promise<T>;
    subscribe(type: string, method: string, params: unknown[], cb: ProviderInterfaceCallback): Promise<number | string>;
    unsubscribe(type: string, method: string, id: number | string): Promise<boolean>;
}
export interface ProviderStats {
    active: {
        requests: number;
        subscriptions: number;
    };
    total: {
        bytesRecv: number;
        bytesSent: number;
        cached: number;
        errors: number;
        requests: number;
        subscriptions: number;
        timeout: number;
    };
}
export {};