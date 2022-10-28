import { ConnectionConfig, Connection } from './bindings-smoldot-light.js';
import { SmoldotWasmInstance } from './bindings.js';
export { ConnectionConfig, ConnectionError, Connection } from './bindings-smoldot-light.js';
export interface Config {
    /**
     * Closure to call when the Wasm instance panics.
     *
     * This callback will always be invoked from within a binding called the Wasm instance.
     *
     * After this callback has been called, it is forbidden to invoke any function from the Wasm
     * VM.
     *
     * If this callback is called while invoking a function from the Wasm VM, this function will
     * throw a dummy exception.
     */
    onWasmPanic: (message: string) => void;
    logCallback: (level: number, target: string, message: string) => void;
    jsonRpcCallback: (response: string, chainId: number) => void;
    databaseContentCallback: (data: string, chainId: number) => void;
    currentTaskCallback?: (taskName: string | null) => void;
    cpuRateLimit: number;
}
/**
 * Contains functions that the client will use when it needs to leverage the platform.
 */
export interface PlatformBindings {
    /**
     * Base64-decode the given buffer then decompress its content using the inflate algorithm
     * with zlib header.
     *
     * The input is considered trusted. In other words, the implementation doesn't have to
     * resist malicious input.
     *
     * This function is asynchronous because implementations might use the compression streams
     * Web API, which for whatever reason is asynchronous.
     */
    trustedBase64DecodeAndZlibInflate: (input: string) => Promise<Uint8Array>;
    /**
     * Returns the number of milliseconds since an arbitrary epoch.
     */
    performanceNow: () => number;
    /**
     * Fills the given buffer with randomly-generated bytes.
     */
    getRandomValues: (buffer: Uint8Array) => void;
    /**
     * Tries to open a new connection using the given configuration.
     *
     * @see Connection
     * @throws ConnectionError If the multiaddress couldn't be parsed or contains an invalid protocol.
     */
    connect(config: ConnectionConfig): Connection;
}
export declare function startInstance(config: Config, platformBindings: PlatformBindings): Promise<SmoldotWasmInstance>;
