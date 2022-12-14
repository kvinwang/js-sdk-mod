import { Config as EmbeddedNodeConfig } from "./smoldot-light.js";
export * from "./types.js";
export { EmbeddedNodeConfig };
/**
 * `true` if the substrate-connect extension is installed and available.
 *
 * Always `false` when outside of a browser environment.
 *
 * We detect this based on the presence of a DOM element with a specific `id`. See
 * `connect-extension-protocol`.
 *
 * Note that the value is determined at initialization and will not change even if the user
 * enables, disables, installs, or uninstalls the extension while the script is running. These
 * situations are very niche, and handling them properly would add a lot of complexity that isn't
 * worth it.
 *
 * This constant is mostly for informative purposes, for example to display a message in a UI
 * encouraging the user to install the extension.
 */
export declare const isExtensionPresent: boolean;
/**
 * Configuration that can be passed to {createScClient}.
 */
export interface Config {
    /**
     * If `true`, then the client will always use a node embedded within the page and never use
     * the substrate-connect extension.
     *
     * Defaults to `false`.
     */
    forceEmbeddedNode?: boolean;
    /**
     * Configuration to use for the embedded node. Ignored if the extension is present.
     *
     * If you want to make sure that this configuration isn't ignored, use this option in
     * conjunction with {Config.forceEmbeddedNode}.
     */
    embeddedNodeConfig?: EmbeddedNodeConfig;
}
/**
 * Returns a {@link ScClient} that connects to chains, either through the substrate-connect
 * extension or by executing a light client directly from JavaScript, depending on whether the
 * extension is installed and available.
 */
export declare function createScClient(config?: Config): import("./types.js").ScClient;
