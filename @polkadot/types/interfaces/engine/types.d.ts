import type { Struct, bool } from '@polkadot/types-codec';
import type { BlockHash } from '@polkadot/types/interfaces/chain';
/** @name CreatedBlock */
export interface CreatedBlock extends Struct {
    readonly blockHash: BlockHash;
    readonly aux: ImportedAux;
}
/** @name ImportedAux */
export interface ImportedAux extends Struct {
    readonly headerOnly: bool;
    readonly clearJustificationRequests: bool;
    readonly needsJustification: bool;
    readonly badJustification: bool;
    readonly needsFinalityProof: bool;
    readonly isNewBest: bool;
}
export declare type PHANTOM_ENGINE = 'engine';
