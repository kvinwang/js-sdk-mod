import type { Observable } from 'rxjs';
import type { HeaderExtended } from '../type/types';
import type { DeriveApi } from '../types';
/**
 * @name getHeader
 * @param {( Uint8Array | string )} hash - A block hash as U8 array or string.
 * @returns An array containing the block header and the block author
 * @description Get a specific block header and extend it with the author
 * @example
 * <BR>
 *
 * ```javascript
 * const { author, number } = await api.derive.chain.getHeader('0x123...456');
 *
 * console.log(`block #${number} was authored by ${author}`);
 * ```
 */
export declare function getHeader(instanceId: string, api: DeriveApi): (blockHash: Uint8Array | string) => Observable<HeaderExtended>;
