import { createScClient as smoldotScClient, } from "./smoldot-light.js";
import { createScClient as extensionScClient } from "./extension.js";
import { DOM_ELEMENT_ID } from "@substrate/connect-extension-protocol";
export * from "./types.js";
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
export const isExtensionPresent = typeof document === "object" &&
    typeof document.getElementById === "function" &&
    !!document.getElementById(DOM_ELEMENT_ID);
/**
 * Returns a {@link ScClient} that connects to chains, either through the substrate-connect
 * extension or by executing a light client directly from JavaScript, depending on whether the
 * extension is installed and available.
 */
export function createScClient(config) {
    const forceEmbedded = config === null || config === void 0 ? void 0 : config.forceEmbeddedNode;
    if (!forceEmbedded && isExtensionPresent)
        return extensionScClient();
    return smoldotScClient(config === null || config === void 0 ? void 0 : config.embeddedNodeConfig);
}
//# sourceMappingURL=index.js.map