import { MalformedJsonRpcError, QueueFullError, } from "@substrate/smoldot-light";
import { getSpec } from "./specs/index.js";
import { AlreadyDestroyedError, CrashError, JsonRpcDisabledError, } from "./types.js";
let startPromise = null;
const getStart = () => {
    if (startPromise)
        return startPromise;
    startPromise = import("@substrate/smoldot-light").then((sm) => sm.start);
    return startPromise;
};
const clientReferences = []; // Note that this can't be a set, as the same config is added/removed multiple times
let clientPromise = null;
let clientReferencesMaxLogLevel = 3;
const getClientAndIncRef = (config) => {
    if (config.maxLogLevel && config.maxLogLevel > clientReferencesMaxLogLevel)
        clientReferencesMaxLogLevel = config.maxLogLevel;
    if (clientPromise) {
        clientReferences.push(config);
        if (clientPromise instanceof Promise)
            return clientPromise;
        else
            return Promise.resolve(clientPromise);
    }
    const newClientPromise = getStart().then((start) => start({
        forbidTcp: true,
        forbidNonLocalWs: true,
        maxLogLevel: 9999999,
        cpuRateLimit: 0.5,
        logCallback: (level, target, message) => {
            if (level > clientReferencesMaxLogLevel)
                return;
            // The first parameter of the methods of `console` has some printf-like substitution
            // capabilities. We don't really need to use this, but not using it means that the logs
            // might not get printed correctly if they contain `%`.
            if (level <= 1) {
                console.error("[%s] %s", target, message);
            }
            else if (level === 2) {
                console.warn("[%s] %s", target, message);
            }
            else if (level === 3) {
                console.info("[%s] %s", target, message);
            }
            else if (level === 4) {
                console.debug("[%s] %s", target, message);
            }
            else {
                console.trace("[%s] %s", target, message);
            }
        },
    }));
    clientPromise = newClientPromise;
    newClientPromise.then((client) => {
        // Make sure that the client we have just created is still desired
        if (clientPromise === newClientPromise)
            clientPromise = client;
        else
            client.terminate();
        // Note that if clientPromise != newClientPromise we know for sure that the client that we
        // return isn't going to be used. We would rather not return a terminated client, but this
        // isn't possible for type check reasons.
        return client;
    });
    clientReferences.push(config);
    return clientPromise;
};
// Must be passed the exact same object as was passed to {getClientAndIncRef}
const decRef = (config) => {
    const idx = clientReferences.indexOf(config);
    if (idx === -1)
        throw new Error("Internal error within smoldot-light");
    clientReferences.splice(idx, 1);
    // Update `clientReferencesMaxLogLevel`
    // Note how it is set back to 3 if there is no reference anymore
    clientReferencesMaxLogLevel = 3;
    for (const cfg of clientReferences.values()) {
        if (cfg.maxLogLevel && cfg.maxLogLevel > clientReferencesMaxLogLevel)
            clientReferencesMaxLogLevel = cfg.maxLogLevel;
    }
    if (clientReferences.length === 0) {
        if (clientPromise && !(clientPromise instanceof Promise))
            clientPromise.terminate();
        clientPromise = null;
    }
};
const transformErrors = (thunk) => {
    try {
        thunk();
    }
    catch (e) {
        const error = e;
        if ((error === null || error === void 0 ? void 0 : error.name) === "JsonRpcDisabledError")
            throw new JsonRpcDisabledError();
        if ((error === null || error === void 0 ? void 0 : error.name) === "CrashError")
            throw new CrashError(error.message);
        if ((error === null || error === void 0 ? void 0 : error.name) === "AlreadyDestroyedError")
            throw new AlreadyDestroyedError();
        throw new CrashError(e instanceof Error ? e.message : `Unexpected error ${e}`);
    }
};
/**
 * Returns a {ScClient} that connects to chains by executing a light client directly
 * from JavaScript.
 *
 * This is quite expensive in terms of CPU, but it is the only choice when the substrate-connect
 * extension is not installed.
 */
export const createScClient = (config) => {
    const configOrDefault = config || { maxLogLevel: 3 };
    const chains = new Map();
    const addChain = async (chainSpec, jsonRpcCallback) => {
        const client = await getClientAndIncRef(configOrDefault);
        try {
            const internalChain = await client.addChain({
                chainSpec,
                potentialRelayChains: [...chains.values()],
                disableJsonRpc: jsonRpcCallback === undefined,
            });
            (async () => {
                while (true) {
                    let jsonRpcResponse;
                    try {
                        jsonRpcResponse = await internalChain.nextJsonRpcResponse();
                    }
                    catch (_) {
                        break;
                    }
                    // `nextJsonRpcResponse` throws an exception if we pass `disableJsonRpc: true` in the
                    // config. We pass `disableJsonRpc: true` if `jsonRpcCallback` is undefined. Therefore,
                    // this code is never reachable if `jsonRpcCallback` is undefined.
                    try {
                        jsonRpcCallback(jsonRpcResponse);
                    }
                    catch (error) {
                        console.error("JSON-RPC callback has thrown an exception:", error);
                    }
                }
            })();
            const chain = {
                sendJsonRpc: (rpc) => {
                    transformErrors(() => {
                        try {
                            internalChain.sendJsonRpc(rpc);
                        }
                        catch (error) {
                            if (error instanceof MalformedJsonRpcError) {
                                // In order to expose the same behavior as the extension client, we silently
                                // discard malformed JSON-RPC requests.
                                return;
                            }
                            else if (error instanceof QueueFullError) {
                                // If the queue is full, we immediately send back a JSON-RPC response indicating
                                // the error.
                                try {
                                    const parsedRq = JSON.parse(rpc);
                                    jsonRpcCallback(JSON.stringify({
                                        jsonrpc: "v2",
                                        id: parsedRq.id,
                                        error: {
                                            code: -32000,
                                            message: "JSON-RPC server is too busy",
                                        },
                                    }));
                                }
                                catch (_error) {
                                    // An error here counts as a malformed JSON-RPC request, which are ignored.
                                }
                            }
                            else {
                                throw error;
                            }
                        }
                    });
                },
                remove: () => {
                    try {
                        transformErrors(() => {
                            internalChain.remove();
                        });
                    }
                    finally {
                        chains.delete(chain);
                        decRef(configOrDefault);
                    }
                },
            };
            chains.set(chain, internalChain);
            return chain;
        }
        catch (error) {
            decRef(configOrDefault);
            throw error;
        }
    };
    const addWellKnownChain = async (supposedChain, jsonRpcCallback) => {
        // the following line ensures that the http request for the dynamic import
        // of smoldot-light and the request for the dynamic import of the spec
        // happen in parallel
        getClientAndIncRef(configOrDefault);
        try {
            const spec = await getSpec(supposedChain);
            return await addChain(spec, jsonRpcCallback);
        }
        finally {
            decRef(configOrDefault);
        }
    };
    return { addChain, addWellKnownChain };
};
//# sourceMappingURL=smoldot-light.js.map