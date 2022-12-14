import { ScClient } from "./types.js";
/**
 * Configuration that can be passed to {createScClient}.
 */
export interface Config {
    /**
     * The client prints logs in the console. By default, only log levels 1, 2, and 3 (corresponding
     * respectively to ERROR, WARN, and INFO) are printed.
     *
     * In order to more easily debug problems, you can pass 4 (DEBUG) or more.
     *
     * This setting is only taken into account between the moment when you use this chain to add a
     * chain for the first time, and the moment when all the chains that you have added have been
     * removed.
     *
     * If {createScClient} is called multiple times with multiple different log levels, the highest
     * value will be used.
     */
    maxLogLevel?: number;
}
/**
 * Returns a {ScClient} that connects to chains by executing a light client directly
 * from JavaScript.
 *
 * This is quite expensive in terms of CPU, but it is the only choice when the substrate-connect
 * extension is not installed.
 */
export declare const createScClient: (config?: Config) => ScClient;
