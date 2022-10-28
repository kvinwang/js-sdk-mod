import type { Option, Text } from '@polkadot/types-codec';
import type { ICompact, INumber } from '@polkadot/types-codec/types';
import type { TypeDef } from './types';
export interface ILookup {
    getSiType(lookupId: ICompact<INumber> | string | number): {
        def: {
            asTuple: ICompact<INumber>[];
        };
    };
    getTypeDef(lookupId: ICompact<INumber> | string | number): TypeDef;
    sanitizeField(name: Option<Text>): [string | null, string | null];
}
