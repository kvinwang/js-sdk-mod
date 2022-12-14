import type { AnyFunction } from '@polkadot/types/types';
import * as accounts from './accounts';
import * as alliance from './alliance';
import * as bagsList from './bagsList';
import * as balances from './balances';
import * as bounties from './bounties';
import * as chain from './chain';
import * as contracts from './contracts';
import * as council from './council';
import * as crowdloan from './crowdloan';
import * as democracy from './democracy';
import * as elections from './elections';
import * as imOnline from './imOnline';
import * as membership from './membership';
import * as parachains from './parachains';
import * as session from './session';
import * as society from './society';
import * as staking from './staking';
import * as technicalCommittee from './technicalCommittee';
import * as treasury from './treasury';
import * as tx from './tx';
export declare const derive: {
    accounts: typeof accounts;
    alliance: typeof alliance;
    bagsList: typeof bagsList;
    balances: typeof balances;
    bounties: typeof bounties;
    chain: typeof chain;
    contracts: typeof contracts;
    council: typeof council;
    crowdloan: typeof crowdloan;
    democracy: typeof democracy;
    elections: typeof elections;
    imOnline: typeof imOnline;
    membership: typeof membership;
    parachains: typeof parachains;
    session: typeof session;
    society: typeof society;
    staking: typeof staking;
    technicalCommittee: typeof technicalCommittee;
    treasury: typeof treasury;
    tx: typeof tx;
};
declare type DeriveSection<Section> = {
    [M in keyof Section]: Section[M] extends AnyFunction ? ReturnType<Section[M]> : never;
};
declare type DeriveAllSections<AllSections> = {
    [S in keyof AllSections]: DeriveSection<AllSections[S]>;
};
export interface ExactDerive extends DeriveAllSections<typeof derive> {
}
export {};
