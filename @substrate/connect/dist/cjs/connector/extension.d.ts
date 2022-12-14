import { ScClient } from "./types.js";
/**
 * Returns a {@link ScClient} that connects to chains by asking the substrate-connect extension
 * to do so.
 *
 * This function assumes that the extension is installed and available. It is out of scope of this
 * function to detect whether this is the case.
 * If you try to add a chain without the extension installed, nothing will happen and the
 * `Promise`s will never resolve.
 */
export declare const createScClient: () => ScClient;
