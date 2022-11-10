declare const versioned: ({
    minmax: number[];
    types: {
        Address: string;
        LookupSource: string;
        DispatchErrorModule: string;
        Keys: string;
        BridgeChainId: string;
        BridgeEvent: {
            _enum: {
                FungibleTransfer: string;
                NonFungibleTransfer: string;
                GenericTransfer: string;
            };
        };
        FungibleTransfer: {
            destId: string;
            nonce: string;
            resourceId: string;
            amount: string;
            recipient: string;
        };
        NonFungibleTransfer: {
            destId: string;
            nonce: string;
            resourceId: string;
            tokenId: string;
            recipient: string;
            metadata: string;
        };
        GenericTransfer: {
            destId: string;
            nonce: string;
            resourceId: string;
            metadata: string;
        };
        ResourceId: string;
        TokenId: string;
        DepositNonce: string;
        ProposalStatus: {
            _enum: {
                Initiated: null;
                Approved: null;
                Rejected: null;
            };
        };
        ProposalVotes: {
            votesFor: string;
            votesAgainst: string;
            status: string;
            expiry: string;
        };
        AssetInfo: {
            destId: string;
            assetIdentity: string;
        };
        ProxyType: {
            _enum: string[];
        };
        Sr25519PublicKey: string;
        MasterPublicKey: string;
        WorkerPublicKey: string;
        ContractPublicKey: string;
        EcdhPublicKey: string;
        MessageOrigin: {
            _enum: {
                Pallet: string;
                Contract: string;
                Worker: string;
                AccountId: string;
                MultiLocation: string;
                Gatekeeper: null;
            };
        };
        Attestation: {
            _enum: {
                SgxIas: string;
            };
        };
        AttestationSgxIas: {
            raReport: string;
            signature: string;
            rawSigningCert: string;
        };
        SenderId: string;
        Path: string;
        Topic: string;
        Message: {
            sender: string;
            destination: string;
            payload: string;
        };
        SignedMessage: {
            message: string;
            sequence: string;
            signature: string;
        };
        WorkerRegistrationInfo: {
            version: string;
            machineId: string;
            pubkey: string;
            ecdhPubkey: string;
            genesisBlockHash: string;
            features: string;
            operator: string;
        };
        PoolInfo: {
            pid: string;
            owner: string;
            payoutCommission: string;
            ownerReward: string;
            cap: string;
            rewardAcc: string;
            totalShares: string;
            totalStake: string;
            freeStake: string;
            releasingStake: string;
            workers: string;
            withdrawQueue: string;
        };
        WithdrawInfo: {
            user: string;
            shares: string;
            startTime: string;
        };
        WorkerInfo: {
            pubkey: string;
            ecdhPubkey: string;
            runtimeVersion: string;
            lastUpdated: string;
            operator: string;
            confidenceLevel: string;
            initialScore: string;
            features: string;
        };
        MinerInfo: {
            state: string;
            ve: string;
            v: string;
            vUpdatedAt: string;
            benchmark: string;
            coolDownStart: string;
            stats: string;
        };
        Benchmark: {
            pInit: string;
            pInstant: string;
            iterations: string;
            miningStartTime: string;
            challengeTimeLast: string;
        };
        MinerState: {
            _enum: {
                Ready: null;
                MiningIdle: null;
                MiningActive: null;
                MiningUnresponsive: null;
                MiningCoolingDown: null;
            };
        };
        MinerStats: {
            totalReward: string;
        };
        HeartbeatChallenge: {
            seed: string;
            onlineTarget: string;
        };
        KeyDistribution: {
            _enum: {
                MasterKeyDistribution: string;
            };
        };
        GatekeeperLaunch: {
            _enum: {
                FirstGatekeeper: string;
                MasterPubkeyOnChain: null;
            };
        };
        GatekeeperChange: {
            _enum: {
                GatekeeperRegistered: string;
            };
        };
        GatekeeperEvent: {
            _enum: {
                NewRandomNumber: string;
                TokenomicParametersChanged: string;
            };
        };
        NewGatekeeperEvent: {
            pubkey: string;
            ecdhPubkey: string;
        };
        DispatchMasterKeyEvent: {
            dest: string;
            ecdhPubkey: string;
            encryptedMasterKey: string;
            iv: string;
        };
        RandomNumberEvent: {
            blockNumber: string;
            randomNumber: string;
            lastRandomNumber: string;
        };
        TokenomicParameters: {
            phaRate: string;
            rho: string;
            budgetPerBlock: string;
            vMax: string;
            costK: string;
            costB: string;
            slashRate: string;
            treasuryRatio: string;
            heartbeatWindow: string;
            rigK: string;
            rigB: string;
            re: string;
            k: string;
            kappa: string;
        };
        TokenomicParams: string;
        U64F64Bits: string;
        UserStakeInfo: {
            user: string;
            locked: string;
            shares: string;
            availableRewards: string;
            rewardDebt: string;
        };
        ChainId: string;
    };
} | {
    minmax: (number | undefined)[];
    types: {
        Address: string;
        LookupSource: string;
        DispatchErrorModule: string;
        Keys: string;
        BridgeChainId: string;
        BridgeEvent: {
            _enum: {
                FungibleTransfer: string;
                NonFungibleTransfer: string;
                GenericTransfer: string;
            };
        };
        FungibleTransfer: {
            destId: string;
            nonce: string;
            resourceId: string;
            amount: string;
            recipient: string;
        };
        NonFungibleTransfer: {
            destId: string;
            nonce: string;
            resourceId: string;
            tokenId: string;
            recipient: string;
            metadata: string;
        };
        GenericTransfer: {
            destId: string;
            nonce: string;
            resourceId: string;
            metadata: string;
        };
        ResourceId: string;
        TokenId: string;
        DepositNonce: string;
        ProposalStatus: {
            _enum: {
                Initiated: null;
                Approved: null;
                Rejected: null;
            };
        };
        ProposalVotes: {
            votesFor: string;
            votesAgainst: string;
            status: string;
            expiry: string;
        };
        AssetInfo: {
            destId: string;
            assetIdentity: string;
        };
        ProxyType: {
            _enum: string[];
        };
        Sr25519PublicKey: string;
        MasterPublicKey: string;
        WorkerPublicKey: string;
        ContractPublicKey: string;
        EcdhPublicKey: string;
        MessageOrigin: {
            _enum: {
                Pallet: string;
                Contract: string;
                Worker: string;
                AccountId: string;
                MultiLocation: string;
                Gatekeeper: null;
            };
        };
        Attestation: {
            _enum: {
                SgxIas: string;
            };
        };
        AttestationSgxIas: {
            raReport: string;
            signature: string;
            rawSigningCert: string;
        };
        SenderId: string;
        Path: string;
        Topic: string;
        Message: {
            sender: string;
            destination: string;
            payload: string;
        };
        SignedMessage: {
            message: string;
            sequence: string;
            signature: string;
        };
        WorkerRegistrationInfo: {
            version: string;
            machineId: string;
            pubkey: string;
            ecdhPubkey: string;
            genesisBlockHash: string;
            features: string;
            operator: string;
        };
        PoolInfo: {
            pid: string;
            owner: string;
            payoutCommission: string;
            ownerReward: string;
            cap: string;
            rewardAcc: string;
            totalShares: string;
            totalStake: string;
            freeStake: string;
            releasingStake: string;
            workers: string;
            withdrawQueue: string;
        };
        WithdrawInfo: {
            user: string;
            shares: string;
            startTime: string;
        };
        WorkerInfo: {
            pubkey: string;
            ecdhPubkey: string;
            runtimeVersion: string;
            lastUpdated: string;
            operator: string;
            confidenceLevel: string;
            initialScore: string;
            features: string;
        };
        MinerInfo: {
            state: string;
            ve: string;
            v: string;
            vUpdatedAt: string;
            benchmark: string;
            coolDownStart: string;
            stats: string;
        };
        Benchmark: {
            pInit: string;
            pInstant: string;
            iterations: string;
            miningStartTime: string;
            challengeTimeLast: string;
        };
        MinerState: {
            _enum: {
                Ready: null;
                MiningIdle: null;
                MiningActive: null;
                MiningUnresponsive: null;
                MiningCoolingDown: null;
            };
        };
        MinerStats: {
            totalReward: string;
        };
        HeartbeatChallenge: {
            seed: string;
            onlineTarget: string;
        };
        KeyDistribution: {
            _enum: {
                MasterKeyDistribution: string;
            };
        };
        GatekeeperLaunch: {
            _enum: {
                FirstGatekeeper: string;
                MasterPubkeyOnChain: null;
            };
        };
        GatekeeperChange: {
            _enum: {
                GatekeeperRegistered: string;
            };
        };
        GatekeeperEvent: {
            _enum: {
                NewRandomNumber: string;
                TokenomicParametersChanged: string;
            };
        };
        NewGatekeeperEvent: {
            pubkey: string;
            ecdhPubkey: string;
        };
        DispatchMasterKeyEvent: {
            dest: string;
            ecdhPubkey: string;
            encryptedMasterKey: string;
            iv: string;
        };
        RandomNumberEvent: {
            blockNumber: string;
            randomNumber: string;
            lastRandomNumber: string;
        };
        TokenomicParameters: {
            phaRate: string;
            rho: string;
            budgetPerBlock: string;
            vMax: string;
            costK: string;
            costB: string;
            slashRate: string;
            treasuryRatio: string;
            heartbeatWindow: string;
            rigK: string;
            rigB: string;
            re: string;
            k: string;
            kappa: string;
        };
        TokenomicParams: string;
        U64F64Bits: string;
        UserStakeInfo: {
            user: string;
            locked: string;
            shares: string;
            availableRewards: string;
            rewardDebt: string;
        };
    };
})[];
export default versioned;
//# sourceMappingURL=versioned-khala.d.ts.map