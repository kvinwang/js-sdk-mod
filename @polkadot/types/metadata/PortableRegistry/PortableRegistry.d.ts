import type { Option, Text, Vec } from '@polkadot/types-codec';
import type { Registry } from '@polkadot/types-codec/types';
import type { ILookup, TypeDef } from '@polkadot/types-create/types';
import type { PortableType } from '../../interfaces/metadata';
import type { SiLookupTypeId, SiType } from '../../interfaces/scaleInfo';
import { Struct } from '@polkadot/types-codec';
export declare class PortableRegistry extends Struct implements ILookup {
    #private;
    constructor(registry: Registry, value?: Uint8Array, isContract?: boolean);
    get names(): string[];
    /**
     * @description The types of the registry
     */
    get types(): Vec<PortableType>;
    register(): void;
    /**
     * @description Returns the name for a specific lookup
     */
    getName(lookupId: SiLookupTypeId | string | number): string | undefined;
    /**
     * @description Finds a specific type in the registry
     */
    getSiType(lookupId: SiLookupTypeId | string | number): SiType;
    /**
     * @description Lookup the type definition for the index
     */
    getTypeDef(lookupId: SiLookupTypeId | string | number): TypeDef;
    sanitizeField(name: Option<Text>): [string | null, string | null];
}
