import type { GenericVote } from '@polkadot/types';
import type { Compact, Enum, Struct, u32 } from '@polkadot/types-codec';
import type { AccountId, Balance } from '@polkadot/types/interfaces/runtime';
/** @name ApprovalFlag */
export interface ApprovalFlag extends u32 {
}
/** @name DefunctVoter */
export interface DefunctVoter extends Struct {
    readonly who: AccountId;
    readonly voteCount: Compact<u32>;
    readonly candidateCount: Compact<u32>;
}
/** @name Renouncing */
export interface Renouncing extends Enum {
    readonly isMember: boolean;
    readonly isRunnerUp: boolean;
    readonly isCandidate: boolean;
    readonly asCandidate: Compact<u32>;
    readonly type: 'Member' | 'RunnerUp' | 'Candidate';
}
/** @name SetIndex */
export interface SetIndex extends u32 {
}
/** @name Vote */
export interface Vote extends GenericVote {
}
/** @name VoteIndex */
export interface VoteIndex extends u32 {
}
/** @name VoterInfo */
export interface VoterInfo extends Struct {
    readonly lastActive: VoteIndex;
    readonly lastWin: VoteIndex;
    readonly pot: Balance;
    readonly stake: Balance;
}
/** @name VoteThreshold */
export interface VoteThreshold extends Enum {
    readonly isSuperMajorityApprove: boolean;
    readonly isSuperMajorityAgainst: boolean;
    readonly isSimpleMajority: boolean;
    readonly type: 'SuperMajorityApprove' | 'SuperMajorityAgainst' | 'SimpleMajority';
}
export declare type PHANTOM_ELECTIONS = 'elections';
