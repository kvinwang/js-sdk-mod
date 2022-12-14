declare const _default: {
    /**
     * Lookup72: polkadot_runtime_common::claims::pallet::Event<T>
     **/
    PolkadotRuntimeCommonClaimsPalletEvent: {
        _enum: {
            Claimed: {
                who: string;
                ethereumAddress: string;
                amount: string;
            };
        };
    };
    /**
     * Lookup79: polkadot_runtime::ProxyType
     **/
    PolkadotRuntimeProxyType: {
        _enum: string[];
    };
    /**
     * Lookup95: polkadot_runtime_parachains::inclusion::pallet::Event<T>
     **/
    PolkadotRuntimeParachainsInclusionPalletEvent: {
        _enum: {
            CandidateBacked: string;
            CandidateIncluded: string;
            CandidateTimedOut: string;
        };
    };
    /**
     * Lookup96: polkadot_primitives::v2::CandidateReceipt<primitive_types::H256>
     **/
    PolkadotPrimitivesV2CandidateReceipt: {
        descriptor: string;
        commitmentsHash: string;
    };
    /**
     * Lookup97: polkadot_primitives::v2::CandidateDescriptor<primitive_types::H256>
     **/
    PolkadotPrimitivesV2CandidateDescriptor: {
        paraId: string;
        relayParent: string;
        collator: string;
        persistedValidationDataHash: string;
        povHash: string;
        erasureRoot: string;
        signature: string;
        paraHead: string;
        validationCodeHash: string;
    };
    /**
     * Lookup99: polkadot_primitives::v2::collator_app::Public
     **/
    PolkadotPrimitivesV2CollatorAppPublic: string;
    /**
     * Lookup100: polkadot_primitives::v2::collator_app::Signature
     **/
    PolkadotPrimitivesV2CollatorAppSignature: string;
    /**
     * Lookup107: polkadot_runtime_parachains::paras::pallet::Event
     **/
    PolkadotRuntimeParachainsParasPalletEvent: {
        _enum: {
            CurrentCodeUpdated: string;
            CurrentHeadUpdated: string;
            CodeUpgradeScheduled: string;
            NewHeadNoted: string;
            ActionQueued: string;
            PvfCheckStarted: string;
            PvfCheckAccepted: string;
            PvfCheckRejected: string;
        };
    };
    /**
     * Lookup108: polkadot_runtime_parachains::ump::pallet::Event
     **/
    PolkadotRuntimeParachainsUmpPalletEvent: {
        _enum: {
            InvalidFormat: string;
            UnsupportedVersion: string;
            ExecutedUpward: string;
            WeightExhausted: string;
            UpwardMessagesReceived: string;
            OverweightEnqueued: string;
            OverweightServiced: string;
        };
    };
    /**
     * Lookup109: xcm::v2::traits::Outcome
     **/
    XcmV2TraitsOutcome: {
        _enum: {
            Complete: string;
            Incomplete: string;
            Error: string;
        };
    };
    /**
     * Lookup110: xcm::v2::traits::Error
     **/
    XcmV2TraitsError: {
        _enum: {
            Overflow: string;
            Unimplemented: string;
            UntrustedReserveLocation: string;
            UntrustedTeleportLocation: string;
            MultiLocationFull: string;
            MultiLocationNotInvertible: string;
            BadOrigin: string;
            InvalidLocation: string;
            AssetNotFound: string;
            FailedToTransactAsset: string;
            NotWithdrawable: string;
            LocationCannotHold: string;
            ExceedsMaxMessageSize: string;
            DestinationUnsupported: string;
            Transport: string;
            Unroutable: string;
            UnknownClaim: string;
            FailedToDecode: string;
            MaxWeightInvalid: string;
            NotHoldingFees: string;
            TooExpensive: string;
            Trap: string;
            UnhandledXcmVersion: string;
            WeightLimitReached: string;
            Barrier: string;
            WeightNotComputable: string;
        };
    };
    /**
     * Lookup111: polkadot_runtime_parachains::hrmp::pallet::Event<T>
     **/
    PolkadotRuntimeParachainsHrmpPalletEvent: {
        _enum: {
            OpenChannelRequested: string;
            OpenChannelCanceled: string;
            OpenChannelAccepted: string;
            ChannelClosed: string;
            HrmpChannelForceOpened: string;
        };
    };
    /**
     * Lookup112: polkadot_parachain::primitives::HrmpChannelId
     **/
    PolkadotParachainPrimitivesHrmpChannelId: {
        sender: string;
        recipient: string;
    };
    /**
     * Lookup113: polkadot_runtime_parachains::disputes::pallet::Event<T>
     **/
    PolkadotRuntimeParachainsDisputesPalletEvent: {
        _enum: {
            DisputeInitiated: string;
            DisputeConcluded: string;
            DisputeTimedOut: string;
            Revert: string;
        };
    };
    /**
     * Lookup115: polkadot_runtime_parachains::disputes::DisputeLocation
     **/
    PolkadotRuntimeParachainsDisputesDisputeLocation: {
        _enum: string[];
    };
    /**
     * Lookup116: polkadot_runtime_parachains::disputes::DisputeResult
     **/
    PolkadotRuntimeParachainsDisputesDisputeResult: {
        _enum: string[];
    };
    /**
     * Lookup117: polkadot_runtime_common::paras_registrar::pallet::Event<T>
     **/
    PolkadotRuntimeCommonParasRegistrarPalletEvent: {
        _enum: {
            Registered: {
                paraId: string;
                manager: string;
            };
            Deregistered: {
                paraId: string;
            };
            Reserved: {
                paraId: string;
                who: string;
            };
        };
    };
    /**
     * Lookup118: polkadot_runtime_common::slots::pallet::Event<T>
     **/
    PolkadotRuntimeCommonSlotsPalletEvent: {
        _enum: {
            NewLeasePeriod: {
                leasePeriod: string;
            };
            Leased: {
                paraId: string;
                leaser: string;
                periodBegin: string;
                periodCount: string;
                extraReserved: string;
                totalAmount: string;
            };
        };
    };
    /**
     * Lookup119: polkadot_runtime_common::auctions::pallet::Event<T>
     **/
    PolkadotRuntimeCommonAuctionsPalletEvent: {
        _enum: {
            AuctionStarted: {
                auctionIndex: string;
                leasePeriod: string;
                ending: string;
            };
            AuctionClosed: {
                auctionIndex: string;
            };
            Reserved: {
                bidder: string;
                extraReserved: string;
                totalAmount: string;
            };
            Unreserved: {
                bidder: string;
                amount: string;
            };
            ReserveConfiscated: {
                paraId: string;
                leaser: string;
                amount: string;
            };
            BidAccepted: {
                bidder: string;
                paraId: string;
                amount: string;
                firstSlot: string;
                lastSlot: string;
            };
            WinningOffset: {
                auctionIndex: string;
                blockNumber: string;
            };
        };
    };
    /**
     * Lookup120: polkadot_runtime_common::crowdloan::pallet::Event<T>
     **/
    PolkadotRuntimeCommonCrowdloanPalletEvent: {
        _enum: {
            Created: {
                paraId: string;
            };
            Contributed: {
                who: string;
                fundIndex: string;
                amount: string;
            };
            Withdrew: {
                who: string;
                fundIndex: string;
                amount: string;
            };
            PartiallyRefunded: {
                paraId: string;
            };
            AllRefunded: {
                paraId: string;
            };
            Dissolved: {
                paraId: string;
            };
            HandleBidResult: {
                paraId: string;
                result: string;
            };
            Edited: {
                paraId: string;
            };
            MemoUpdated: {
                who: string;
                paraId: string;
                memo: string;
            };
            AddedToNewRaise: {
                paraId: string;
            };
        };
    };
    /**
     * Lookup121: pallet_xcm::pallet::Event<T>
     **/
    PalletXcmEvent: {
        _enum: {
            Attempted: string;
            Sent: string;
            UnexpectedResponse: string;
            ResponseReady: string;
            Notified: string;
            NotifyOverweight: string;
            NotifyDispatchError: string;
            NotifyDecodeFailed: string;
            InvalidResponder: string;
            InvalidResponderVersion: string;
            ResponseTaken: string;
            AssetsTrapped: string;
            VersionChangeNotified: string;
            SupportedVersionChanged: string;
            NotifyTargetSendFail: string;
            NotifyTargetMigrationFail: string;
            AssetsClaimed: string;
        };
    };
    /**
     * Lookup122: xcm::v1::multilocation::MultiLocation
     **/
    XcmV1MultiLocation: {
        parents: string;
        interior: string;
    };
    /**
     * Lookup123: xcm::v1::multilocation::Junctions
     **/
    XcmV1MultilocationJunctions: {
        _enum: {
            Here: string;
            X1: string;
            X2: string;
            X3: string;
            X4: string;
            X5: string;
            X6: string;
            X7: string;
            X8: string;
        };
    };
    /**
     * Lookup124: xcm::v1::junction::Junction
     **/
    XcmV1Junction: {
        _enum: {
            Parachain: string;
            AccountId32: {
                network: string;
                id: string;
            };
            AccountIndex64: {
                network: string;
                index: string;
            };
            AccountKey20: {
                network: string;
                key: string;
            };
            PalletInstance: string;
            GeneralIndex: string;
            GeneralKey: string;
            OnlyChild: string;
            Plurality: {
                id: string;
                part: string;
            };
        };
    };
    /**
     * Lookup126: xcm::v0::junction::NetworkId
     **/
    XcmV0JunctionNetworkId: {
        _enum: {
            Any: string;
            Named: string;
            Polkadot: string;
            Kusama: string;
        };
    };
    /**
     * Lookup128: xcm::v0::junction::BodyId
     **/
    XcmV0JunctionBodyId: {
        _enum: {
            Unit: string;
            Named: string;
            Index: string;
            Executive: string;
            Technical: string;
            Legislative: string;
            Judicial: string;
        };
    };
    /**
     * Lookup129: xcm::v0::junction::BodyPart
     **/
    XcmV0JunctionBodyPart: {
        _enum: {
            Voice: string;
            Members: {
                count: string;
            };
            Fraction: {
                nom: string;
                denom: string;
            };
            AtLeastProportion: {
                nom: string;
                denom: string;
            };
            MoreThanProportion: {
                nom: string;
                denom: string;
            };
        };
    };
    /**
     * Lookup130: xcm::v2::Xcm<RuntimeCall>
     **/
    XcmV2Xcm: string;
    /**
     * Lookup132: xcm::v2::Instruction<RuntimeCall>
     **/
    XcmV2Instruction: {
        _enum: {
            WithdrawAsset: string;
            ReserveAssetDeposited: string;
            ReceiveTeleportedAsset: string;
            QueryResponse: {
                queryId: string;
                response: string;
                maxWeight: string;
            };
            TransferAsset: {
                assets: string;
                beneficiary: string;
            };
            TransferReserveAsset: {
                assets: string;
                dest: string;
                xcm: string;
            };
            Transact: {
                originType: string;
                requireWeightAtMost: string;
                call: string;
            };
            HrmpNewChannelOpenRequest: {
                sender: string;
                maxMessageSize: string;
                maxCapacity: string;
            };
            HrmpChannelAccepted: {
                recipient: string;
            };
            HrmpChannelClosing: {
                initiator: string;
                sender: string;
                recipient: string;
            };
            ClearOrigin: string;
            DescendOrigin: string;
            ReportError: {
                queryId: string;
                dest: string;
                maxResponseWeight: string;
            };
            DepositAsset: {
                assets: string;
                maxAssets: string;
                beneficiary: string;
            };
            DepositReserveAsset: {
                assets: string;
                maxAssets: string;
                dest: string;
                xcm: string;
            };
            ExchangeAsset: {
                give: string;
                receive: string;
            };
            InitiateReserveWithdraw: {
                assets: string;
                reserve: string;
                xcm: string;
            };
            InitiateTeleport: {
                assets: string;
                dest: string;
                xcm: string;
            };
            QueryHolding: {
                queryId: string;
                dest: string;
                assets: string;
                maxResponseWeight: string;
            };
            BuyExecution: {
                fees: string;
                weightLimit: string;
            };
            RefundSurplus: string;
            SetErrorHandler: string;
            SetAppendix: string;
            ClearError: string;
            ClaimAsset: {
                assets: string;
                ticket: string;
            };
            Trap: string;
            SubscribeVersion: {
                queryId: string;
                maxResponseWeight: string;
            };
            UnsubscribeVersion: string;
        };
    };
    /**
     * Lookup133: xcm::v1::multiasset::MultiAssets
     **/
    XcmV1MultiassetMultiAssets: string;
    /**
     * Lookup135: xcm::v1::multiasset::MultiAsset
     **/
    XcmV1MultiAsset: {
        id: string;
        fun: string;
    };
    /**
     * Lookup136: xcm::v1::multiasset::AssetId
     **/
    XcmV1MultiassetAssetId: {
        _enum: {
            Concrete: string;
            Abstract: string;
        };
    };
    /**
     * Lookup137: xcm::v1::multiasset::Fungibility
     **/
    XcmV1MultiassetFungibility: {
        _enum: {
            Fungible: string;
            NonFungible: string;
        };
    };
    /**
     * Lookup138: xcm::v1::multiasset::AssetInstance
     **/
    XcmV1MultiassetAssetInstance: {
        _enum: {
            Undefined: string;
            Index: string;
            Array4: string;
            Array8: string;
            Array16: string;
            Array32: string;
            Blob: string;
        };
    };
    /**
     * Lookup140: xcm::v2::Response
     **/
    XcmV2Response: {
        _enum: {
            Null: string;
            Assets: string;
            ExecutionResult: string;
            Version: string;
        };
    };
    /**
     * Lookup143: xcm::v0::OriginKind
     **/
    XcmV0OriginKind: {
        _enum: string[];
    };
    /**
     * Lookup144: xcm::double_encoded::DoubleEncoded<T>
     **/
    XcmDoubleEncoded: {
        encoded: string;
    };
    /**
     * Lookup145: xcm::v1::multiasset::MultiAssetFilter
     **/
    XcmV1MultiassetMultiAssetFilter: {
        _enum: {
            Definite: string;
            Wild: string;
        };
    };
    /**
     * Lookup146: xcm::v1::multiasset::WildMultiAsset
     **/
    XcmV1MultiassetWildMultiAsset: {
        _enum: {
            All: string;
            AllOf: {
                id: string;
                fun: string;
            };
        };
    };
    /**
     * Lookup147: xcm::v1::multiasset::WildFungibility
     **/
    XcmV1MultiassetWildFungibility: {
        _enum: string[];
    };
    /**
     * Lookup148: xcm::v2::WeightLimit
     **/
    XcmV2WeightLimit: {
        _enum: {
            Unlimited: string;
            Limited: string;
        };
    };
    /**
     * Lookup150: xcm::VersionedMultiAssets
     **/
    XcmVersionedMultiAssets: {
        _enum: {
            V0: string;
            V1: string;
        };
    };
    /**
     * Lookup152: xcm::v0::multi_asset::MultiAsset
     **/
    XcmV0MultiAsset: {
        _enum: {
            None: string;
            All: string;
            AllFungible: string;
            AllNonFungible: string;
            AllAbstractFungible: {
                id: string;
            };
            AllAbstractNonFungible: {
                class: string;
            };
            AllConcreteFungible: {
                id: string;
            };
            AllConcreteNonFungible: {
                class: string;
            };
            AbstractFungible: {
                id: string;
                amount: string;
            };
            AbstractNonFungible: {
                class: string;
                instance: string;
            };
            ConcreteFungible: {
                id: string;
                amount: string;
            };
            ConcreteNonFungible: {
                class: string;
                instance: string;
            };
        };
    };
    /**
     * Lookup153: xcm::v0::multi_location::MultiLocation
     **/
    XcmV0MultiLocation: {
        _enum: {
            Null: string;
            X1: string;
            X2: string;
            X3: string;
            X4: string;
            X5: string;
            X6: string;
            X7: string;
            X8: string;
        };
    };
    /**
     * Lookup154: xcm::v0::junction::Junction
     **/
    XcmV0Junction: {
        _enum: {
            Parent: string;
            Parachain: string;
            AccountId32: {
                network: string;
                id: string;
            };
            AccountIndex64: {
                network: string;
                index: string;
            };
            AccountKey20: {
                network: string;
                key: string;
            };
            PalletInstance: string;
            GeneralIndex: string;
            GeneralKey: string;
            OnlyChild: string;
            Plurality: {
                id: string;
                part: string;
            };
        };
    };
    /**
     * Lookup155: xcm::VersionedMultiLocation
     **/
    XcmVersionedMultiLocation: {
        _enum: {
            V0: string;
            V1: string;
        };
    };
    /**
     * Lookup212: polkadot_runtime::SessionKeys
     **/
    PolkadotRuntimeSessionKeys: {
        grandpa: string;
        babe: string;
        imOnline: string;
        paraValidator: string;
        paraAssignment: string;
        authorityDiscovery: string;
    };
    /**
     * Lookup213: polkadot_primitives::v2::validator_app::Public
     **/
    PolkadotPrimitivesV2ValidatorAppPublic: string;
    /**
     * Lookup214: polkadot_primitives::v2::assignment_app::Public
     **/
    PolkadotPrimitivesV2AssignmentAppPublic: string;
    /**
     * Lookup245: polkadot_runtime_common::claims::pallet::Call<T>
     **/
    PolkadotRuntimeCommonClaimsPalletCall: {
        _enum: {
            claim: {
                dest: string;
                ethereumSignature: string;
            };
            mint_claim: {
                who: string;
                value: string;
                vestingSchedule: string;
                statement: string;
            };
            claim_attest: {
                dest: string;
                ethereumSignature: string;
                statement: string;
            };
            attest: {
                statement: string;
            };
            move_claim: {
                _alias: {
                    new_: string;
                };
                old: string;
                new_: string;
                maybePreclaim: string;
            };
        };
    };
    /**
     * Lookup246: polkadot_runtime_common::claims::EcdsaSignature
     **/
    PolkadotRuntimeCommonClaimsEcdsaSignature: string;
    /**
     * Lookup251: polkadot_runtime_common::claims::StatementKind
     **/
    PolkadotRuntimeCommonClaimsStatementKind: {
        _enum: string[];
    };
    /**
     * Lookup256: polkadot_runtime::OriginCaller
     **/
    PolkadotRuntimeOriginCaller: {
        _enum: {
            system: string;
            __Unused1: string;
            __Unused2: string;
            __Unused3: string;
            __Unused4: string;
            Void: string;
            __Unused6: string;
            __Unused7: string;
            __Unused8: string;
            __Unused9: string;
            __Unused10: string;
            __Unused11: string;
            __Unused12: string;
            __Unused13: string;
            __Unused14: string;
            Council: string;
            TechnicalCommittee: string;
            __Unused17: string;
            __Unused18: string;
            __Unused19: string;
            __Unused20: string;
            __Unused21: string;
            __Unused22: string;
            __Unused23: string;
            __Unused24: string;
            __Unused25: string;
            __Unused26: string;
            __Unused27: string;
            __Unused28: string;
            __Unused29: string;
            __Unused30: string;
            __Unused31: string;
            __Unused32: string;
            __Unused33: string;
            __Unused34: string;
            __Unused35: string;
            __Unused36: string;
            __Unused37: string;
            __Unused38: string;
            __Unused39: string;
            __Unused40: string;
            __Unused41: string;
            __Unused42: string;
            __Unused43: string;
            __Unused44: string;
            __Unused45: string;
            __Unused46: string;
            __Unused47: string;
            __Unused48: string;
            __Unused49: string;
            ParachainsOrigin: string;
            __Unused51: string;
            __Unused52: string;
            __Unused53: string;
            __Unused54: string;
            __Unused55: string;
            __Unused56: string;
            __Unused57: string;
            __Unused58: string;
            __Unused59: string;
            __Unused60: string;
            __Unused61: string;
            __Unused62: string;
            __Unused63: string;
            __Unused64: string;
            __Unused65: string;
            __Unused66: string;
            __Unused67: string;
            __Unused68: string;
            __Unused69: string;
            __Unused70: string;
            __Unused71: string;
            __Unused72: string;
            __Unused73: string;
            __Unused74: string;
            __Unused75: string;
            __Unused76: string;
            __Unused77: string;
            __Unused78: string;
            __Unused79: string;
            __Unused80: string;
            __Unused81: string;
            __Unused82: string;
            __Unused83: string;
            __Unused84: string;
            __Unused85: string;
            __Unused86: string;
            __Unused87: string;
            __Unused88: string;
            __Unused89: string;
            __Unused90: string;
            __Unused91: string;
            __Unused92: string;
            __Unused93: string;
            __Unused94: string;
            __Unused95: string;
            __Unused96: string;
            __Unused97: string;
            __Unused98: string;
            XcmPallet: string;
        };
    };
    /**
     * Lookup260: polkadot_runtime_parachains::origin::pallet::Origin
     **/
    PolkadotRuntimeParachainsOriginPalletOrigin: {
        _enum: {
            Parachain: string;
        };
    };
    /**
     * Lookup261: pallet_xcm::pallet::Origin
     **/
    PalletXcmOrigin: {
        _enum: {
            Xcm: string;
            Response: string;
        };
    };
    /**
     * Lookup312: polkadot_runtime::NposCompactSolution16
     **/
    PolkadotRuntimeNposCompactSolution16: {
        votes1: string;
        votes2: string;
        votes3: string;
        votes4: string;
        votes5: string;
        votes6: string;
        votes7: string;
        votes8: string;
        votes9: string;
        votes10: string;
        votes11: string;
        votes12: string;
        votes13: string;
        votes14: string;
        votes15: string;
        votes16: string;
    };
    /**
     * Lookup375: polkadot_runtime_parachains::configuration::pallet::Call<T>
     **/
    PolkadotRuntimeParachainsConfigurationPalletCall: {
        _enum: {
            set_validation_upgrade_cooldown: {
                _alias: {
                    new_: string;
                };
                new_: string;
            };
            set_validation_upgrade_delay: {
                _alias: {
                    new_: string;
                };
                new_: string;
            };
            set_code_retention_period: {
                _alias: {
                    new_: string;
                };
                new_: string;
            };
            set_max_code_size: {
                _alias: {
                    new_: string;
                };
                new_: string;
            };
            set_max_pov_size: {
                _alias: {
                    new_: string;
                };
                new_: string;
            };
            set_max_head_data_size: {
                _alias: {
                    new_: string;
                };
                new_: string;
            };
            set_parathread_cores: {
                _alias: {
                    new_: string;
                };
                new_: string;
            };
            set_parathread_retries: {
                _alias: {
                    new_: string;
                };
                new_: string;
            };
            set_group_rotation_frequency: {
                _alias: {
                    new_: string;
                };
                new_: string;
            };
            set_chain_availability_period: {
                _alias: {
                    new_: string;
                };
                new_: string;
            };
            set_thread_availability_period: {
                _alias: {
                    new_: string;
                };
                new_: string;
            };
            set_scheduling_lookahead: {
                _alias: {
                    new_: string;
                };
                new_: string;
            };
            set_max_validators_per_core: {
                _alias: {
                    new_: string;
                };
                new_: string;
            };
            set_max_validators: {
                _alias: {
                    new_: string;
                };
                new_: string;
            };
            set_dispute_period: {
                _alias: {
                    new_: string;
                };
                new_: string;
            };
            set_dispute_post_conclusion_acceptance_period: {
                _alias: {
                    new_: string;
                };
                new_: string;
            };
            set_dispute_max_spam_slots: {
                _alias: {
                    new_: string;
                };
                new_: string;
            };
            set_dispute_conclusion_by_time_out_period: {
                _alias: {
                    new_: string;
                };
                new_: string;
            };
            set_no_show_slots: {
                _alias: {
                    new_: string;
                };
                new_: string;
            };
            set_n_delay_tranches: {
                _alias: {
                    new_: string;
                };
                new_: string;
            };
            set_zeroth_delay_tranche_width: {
                _alias: {
                    new_: string;
                };
                new_: string;
            };
            set_needed_approvals: {
                _alias: {
                    new_: string;
                };
                new_: string;
            };
            set_relay_vrf_modulo_samples: {
                _alias: {
                    new_: string;
                };
                new_: string;
            };
            set_max_upward_queue_count: {
                _alias: {
                    new_: string;
                };
                new_: string;
            };
            set_max_upward_queue_size: {
                _alias: {
                    new_: string;
                };
                new_: string;
            };
            set_max_downward_message_size: {
                _alias: {
                    new_: string;
                };
                new_: string;
            };
            set_ump_service_total_weight: {
                _alias: {
                    new_: string;
                };
                new_: string;
            };
            set_max_upward_message_size: {
                _alias: {
                    new_: string;
                };
                new_: string;
            };
            set_max_upward_message_num_per_candidate: {
                _alias: {
                    new_: string;
                };
                new_: string;
            };
            set_hrmp_open_request_ttl: {
                _alias: {
                    new_: string;
                };
                new_: string;
            };
            set_hrmp_sender_deposit: {
                _alias: {
                    new_: string;
                };
                new_: string;
            };
            set_hrmp_recipient_deposit: {
                _alias: {
                    new_: string;
                };
                new_: string;
            };
            set_hrmp_channel_max_capacity: {
                _alias: {
                    new_: string;
                };
                new_: string;
            };
            set_hrmp_channel_max_total_size: {
                _alias: {
                    new_: string;
                };
                new_: string;
            };
            set_hrmp_max_parachain_inbound_channels: {
                _alias: {
                    new_: string;
                };
                new_: string;
            };
            set_hrmp_max_parathread_inbound_channels: {
                _alias: {
                    new_: string;
                };
                new_: string;
            };
            set_hrmp_channel_max_message_size: {
                _alias: {
                    new_: string;
                };
                new_: string;
            };
            set_hrmp_max_parachain_outbound_channels: {
                _alias: {
                    new_: string;
                };
                new_: string;
            };
            set_hrmp_max_parathread_outbound_channels: {
                _alias: {
                    new_: string;
                };
                new_: string;
            };
            set_hrmp_max_message_num_per_candidate: {
                _alias: {
                    new_: string;
                };
                new_: string;
            };
            set_ump_max_individual_weight: {
                _alias: {
                    new_: string;
                };
                new_: string;
            };
            set_pvf_checking_enabled: {
                _alias: {
                    new_: string;
                };
                new_: string;
            };
            set_pvf_voting_ttl: {
                _alias: {
                    new_: string;
                };
                new_: string;
            };
            set_minimum_validation_upgrade_delay: {
                _alias: {
                    new_: string;
                };
                new_: string;
            };
            set_bypass_consistency_check: {
                _alias: {
                    new_: string;
                };
                new_: string;
            };
        };
    };
    /**
     * Lookup376: polkadot_runtime_parachains::shared::pallet::Call<T>
     **/
    PolkadotRuntimeParachainsSharedPalletCall: string;
    /**
     * Lookup377: polkadot_runtime_parachains::inclusion::pallet::Call<T>
     **/
    PolkadotRuntimeParachainsInclusionPalletCall: string;
    /**
     * Lookup378: polkadot_runtime_parachains::paras_inherent::pallet::Call<T>
     **/
    PolkadotRuntimeParachainsParasInherentPalletCall: {
        _enum: {
            enter: {
                data: string;
            };
        };
    };
    /**
     * Lookup379: polkadot_primitives::v2::InherentData<sp_runtime::generic::header::Header<Number, sp_runtime::traits::BlakeTwo256>>
     **/
    PolkadotPrimitivesV2InherentData: {
        bitfields: string;
        backedCandidates: string;
        disputes: string;
        parentHeader: string;
    };
    /**
     * Lookup381: polkadot_primitives::v2::signed::UncheckedSigned<polkadot_primitives::v2::AvailabilityBitfield, polkadot_primitives::v2::AvailabilityBitfield>
     **/
    PolkadotPrimitivesV2SignedUncheckedSigned: {
        payload: string;
        validatorIndex: string;
        signature: string;
    };
    /**
     * Lookup384: bitvec::order::Lsb0
     **/
    BitvecOrderLsb0: string;
    /**
     * Lookup386: polkadot_primitives::v2::validator_app::Signature
     **/
    PolkadotPrimitivesV2ValidatorAppSignature: string;
    /**
     * Lookup388: polkadot_primitives::v2::BackedCandidate<primitive_types::H256>
     **/
    PolkadotPrimitivesV2BackedCandidate: {
        candidate: string;
        validityVotes: string;
        validatorIndices: string;
    };
    /**
     * Lookup389: polkadot_primitives::v2::CommittedCandidateReceipt<primitive_types::H256>
     **/
    PolkadotPrimitivesV2CommittedCandidateReceipt: {
        descriptor: string;
        commitments: string;
    };
    /**
     * Lookup390: polkadot_primitives::v2::CandidateCommitments<N>
     **/
    PolkadotPrimitivesV2CandidateCommitments: {
        upwardMessages: string;
        horizontalMessages: string;
        newValidationCode: string;
        headData: string;
        processedDownwardMessages: string;
        hrmpWatermark: string;
    };
    /**
     * Lookup392: polkadot_core_primitives::OutboundHrmpMessage<polkadot_parachain::primitives::Id>
     **/
    PolkadotCorePrimitivesOutboundHrmpMessage: {
        recipient: string;
        data: string;
    };
    /**
     * Lookup396: polkadot_primitives::v2::ValidityAttestation
     **/
    PolkadotPrimitivesV2ValidityAttestation: {
        _enum: {
            __Unused0: string;
            Implicit: string;
            Explicit: string;
        };
    };
    /**
     * Lookup398: polkadot_primitives::v2::DisputeStatementSet
     **/
    PolkadotPrimitivesV2DisputeStatementSet: {
        candidateHash: string;
        session: string;
        statements: string;
    };
    /**
     * Lookup401: polkadot_primitives::v2::DisputeStatement
     **/
    PolkadotPrimitivesV2DisputeStatement: {
        _enum: {
            Valid: string;
            Invalid: string;
        };
    };
    /**
     * Lookup402: polkadot_primitives::v2::ValidDisputeStatementKind
     **/
    PolkadotPrimitivesV2ValidDisputeStatementKind: {
        _enum: {
            Explicit: string;
            BackingSeconded: string;
            BackingValid: string;
            ApprovalChecking: string;
        };
    };
    /**
     * Lookup403: polkadot_primitives::v2::InvalidDisputeStatementKind
     **/
    PolkadotPrimitivesV2InvalidDisputeStatementKind: {
        _enum: string[];
    };
    /**
     * Lookup404: polkadot_runtime_parachains::paras::pallet::Call<T>
     **/
    PolkadotRuntimeParachainsParasPalletCall: {
        _enum: {
            force_set_current_code: {
                para: string;
                newCode: string;
            };
            force_set_current_head: {
                para: string;
                newHead: string;
            };
            force_schedule_code_upgrade: {
                para: string;
                newCode: string;
                relayParentNumber: string;
            };
            force_note_new_head: {
                para: string;
                newHead: string;
            };
            force_queue_action: {
                para: string;
            };
            add_trusted_validation_code: {
                validationCode: string;
            };
            poke_unused_validation_code: {
                validationCodeHash: string;
            };
            include_pvf_check_statement: {
                stmt: string;
                signature: string;
            };
        };
    };
    /**
     * Lookup405: polkadot_primitives::v2::PvfCheckStatement
     **/
    PolkadotPrimitivesV2PvfCheckStatement: {
        accept: string;
        subject: string;
        sessionIndex: string;
        validatorIndex: string;
    };
    /**
     * Lookup406: polkadot_runtime_parachains::initializer::pallet::Call<T>
     **/
    PolkadotRuntimeParachainsInitializerPalletCall: {
        _enum: {
            force_approve: {
                upTo: string;
            };
        };
    };
    /**
     * Lookup407: polkadot_runtime_parachains::dmp::pallet::Call<T>
     **/
    PolkadotRuntimeParachainsDmpPalletCall: string;
    /**
     * Lookup408: polkadot_runtime_parachains::ump::pallet::Call<T>
     **/
    PolkadotRuntimeParachainsUmpPalletCall: {
        _enum: {
            service_overweight: {
                index: string;
                weightLimit: string;
            };
        };
    };
    /**
     * Lookup409: polkadot_runtime_parachains::hrmp::pallet::Call<T>
     **/
    PolkadotRuntimeParachainsHrmpPalletCall: {
        _enum: {
            hrmp_init_open_channel: {
                recipient: string;
                proposedMaxCapacity: string;
                proposedMaxMessageSize: string;
            };
            hrmp_accept_open_channel: {
                sender: string;
            };
            hrmp_close_channel: {
                channelId: string;
            };
            force_clean_hrmp: {
                para: string;
                inbound: string;
                outbound: string;
            };
            force_process_hrmp_open: {
                channels: string;
            };
            force_process_hrmp_close: {
                channels: string;
            };
            hrmp_cancel_open_request: {
                channelId: string;
                openRequests: string;
            };
            force_open_hrmp_channel: {
                sender: string;
                recipient: string;
                maxCapacity: string;
                maxMessageSize: string;
            };
        };
    };
    /**
     * Lookup410: polkadot_runtime_parachains::disputes::pallet::Call<T>
     **/
    PolkadotRuntimeParachainsDisputesPalletCall: {
        _enum: string[];
    };
    /**
     * Lookup411: polkadot_runtime_common::paras_registrar::pallet::Call<T>
     **/
    PolkadotRuntimeCommonParasRegistrarPalletCall: {
        _enum: {
            register: {
                id: string;
                genesisHead: string;
                validationCode: string;
            };
            force_register: {
                who: string;
                deposit: string;
                id: string;
                genesisHead: string;
                validationCode: string;
            };
            deregister: {
                id: string;
            };
            swap: {
                id: string;
                other: string;
            };
            remove_lock: {
                para: string;
            };
            reserve: string;
            add_lock: {
                para: string;
            };
            schedule_code_upgrade: {
                para: string;
                newCode: string;
            };
            set_current_head: {
                para: string;
                newHead: string;
            };
        };
    };
    /**
     * Lookup412: polkadot_runtime_common::slots::pallet::Call<T>
     **/
    PolkadotRuntimeCommonSlotsPalletCall: {
        _enum: {
            force_lease: {
                para: string;
                leaser: string;
                amount: string;
                periodBegin: string;
                periodCount: string;
            };
            clear_all_leases: {
                para: string;
            };
            trigger_onboard: {
                para: string;
            };
        };
    };
    /**
     * Lookup413: polkadot_runtime_common::auctions::pallet::Call<T>
     **/
    PolkadotRuntimeCommonAuctionsPalletCall: {
        _enum: {
            new_auction: {
                duration: string;
                leasePeriodIndex: string;
            };
            bid: {
                para: string;
                auctionIndex: string;
                firstSlot: string;
                lastSlot: string;
                amount: string;
            };
            cancel_auction: string;
        };
    };
    /**
     * Lookup415: polkadot_runtime_common::crowdloan::pallet::Call<T>
     **/
    PolkadotRuntimeCommonCrowdloanPalletCall: {
        _enum: {
            create: {
                index: string;
                cap: string;
                firstPeriod: string;
                lastPeriod: string;
                end: string;
                verifier: string;
            };
            contribute: {
                index: string;
                value: string;
                signature: string;
            };
            withdraw: {
                who: string;
                index: string;
            };
            refund: {
                index: string;
            };
            dissolve: {
                index: string;
            };
            edit: {
                index: string;
                cap: string;
                firstPeriod: string;
                lastPeriod: string;
                end: string;
                verifier: string;
            };
            add_memo: {
                index: string;
                memo: string;
            };
            poke: {
                index: string;
            };
            contribute_all: {
                index: string;
                signature: string;
            };
        };
    };
    /**
     * Lookup417: sp_runtime::MultiSigner
     **/
    SpRuntimeMultiSigner: {
        _enum: {
            Ed25519: string;
            Sr25519: string;
            Ecdsa: string;
        };
    };
    /**
     * Lookup418: sp_core::ecdsa::Public
     **/
    SpCoreEcdsaPublic: string;
    /**
     * Lookup423: pallet_xcm::pallet::Call<T>
     **/
    PalletXcmCall: {
        _enum: {
            send: {
                dest: string;
                message: string;
            };
            teleport_assets: {
                dest: string;
                beneficiary: string;
                assets: string;
                feeAssetItem: string;
            };
            reserve_transfer_assets: {
                dest: string;
                beneficiary: string;
                assets: string;
                feeAssetItem: string;
            };
            execute: {
                message: string;
                maxWeight: string;
            };
            force_xcm_version: {
                location: string;
                xcmVersion: string;
            };
            force_default_xcm_version: {
                maybeXcmVersion: string;
            };
            force_subscribe_version_notify: {
                location: string;
            };
            force_unsubscribe_version_notify: {
                location: string;
            };
            limited_reserve_transfer_assets: {
                dest: string;
                beneficiary: string;
                assets: string;
                feeAssetItem: string;
                weightLimit: string;
            };
            limited_teleport_assets: {
                dest: string;
                beneficiary: string;
                assets: string;
                feeAssetItem: string;
                weightLimit: string;
            };
        };
    };
    /**
     * Lookup424: xcm::VersionedXcm<RuntimeCall>
     **/
    XcmVersionedXcm: {
        _enum: {
            V0: string;
            V1: string;
            V2: string;
        };
    };
    /**
     * Lookup425: xcm::v0::Xcm<RuntimeCall>
     **/
    XcmV0Xcm: {
        _enum: {
            WithdrawAsset: {
                assets: string;
                effects: string;
            };
            ReserveAssetDeposit: {
                assets: string;
                effects: string;
            };
            TeleportAsset: {
                assets: string;
                effects: string;
            };
            QueryResponse: {
                queryId: string;
                response: string;
            };
            TransferAsset: {
                assets: string;
                dest: string;
            };
            TransferReserveAsset: {
                assets: string;
                dest: string;
                effects: string;
            };
            Transact: {
                originType: string;
                requireWeightAtMost: string;
                call: string;
            };
            HrmpNewChannelOpenRequest: {
                sender: string;
                maxMessageSize: string;
                maxCapacity: string;
            };
            HrmpChannelAccepted: {
                recipient: string;
            };
            HrmpChannelClosing: {
                initiator: string;
                sender: string;
                recipient: string;
            };
            RelayedFrom: {
                who: string;
                message: string;
            };
        };
    };
    /**
     * Lookup427: xcm::v0::order::Order<RuntimeCall>
     **/
    XcmV0Order: {
        _enum: {
            Null: string;
            DepositAsset: {
                assets: string;
                dest: string;
            };
            DepositReserveAsset: {
                assets: string;
                dest: string;
                effects: string;
            };
            ExchangeAsset: {
                give: string;
                receive: string;
            };
            InitiateReserveWithdraw: {
                assets: string;
                reserve: string;
                effects: string;
            };
            InitiateTeleport: {
                assets: string;
                dest: string;
                effects: string;
            };
            QueryHolding: {
                queryId: string;
                dest: string;
                assets: string;
            };
            BuyExecution: {
                fees: string;
                weight: string;
                debt: string;
                haltOnError: string;
                xcm: string;
            };
        };
    };
    /**
     * Lookup429: xcm::v0::Response
     **/
    XcmV0Response: {
        _enum: {
            Assets: string;
        };
    };
    /**
     * Lookup430: xcm::v1::Xcm<RuntimeCall>
     **/
    XcmV1Xcm: {
        _enum: {
            WithdrawAsset: {
                assets: string;
                effects: string;
            };
            ReserveAssetDeposited: {
                assets: string;
                effects: string;
            };
            ReceiveTeleportedAsset: {
                assets: string;
                effects: string;
            };
            QueryResponse: {
                queryId: string;
                response: string;
            };
            TransferAsset: {
                assets: string;
                beneficiary: string;
            };
            TransferReserveAsset: {
                assets: string;
                dest: string;
                effects: string;
            };
            Transact: {
                originType: string;
                requireWeightAtMost: string;
                call: string;
            };
            HrmpNewChannelOpenRequest: {
                sender: string;
                maxMessageSize: string;
                maxCapacity: string;
            };
            HrmpChannelAccepted: {
                recipient: string;
            };
            HrmpChannelClosing: {
                initiator: string;
                sender: string;
                recipient: string;
            };
            RelayedFrom: {
                who: string;
                message: string;
            };
            SubscribeVersion: {
                queryId: string;
                maxResponseWeight: string;
            };
            UnsubscribeVersion: string;
        };
    };
    /**
     * Lookup432: xcm::v1::order::Order<RuntimeCall>
     **/
    XcmV1Order: {
        _enum: {
            Noop: string;
            DepositAsset: {
                assets: string;
                maxAssets: string;
                beneficiary: string;
            };
            DepositReserveAsset: {
                assets: string;
                maxAssets: string;
                dest: string;
                effects: string;
            };
            ExchangeAsset: {
                give: string;
                receive: string;
            };
            InitiateReserveWithdraw: {
                assets: string;
                reserve: string;
                effects: string;
            };
            InitiateTeleport: {
                assets: string;
                dest: string;
                effects: string;
            };
            QueryHolding: {
                queryId: string;
                dest: string;
                assets: string;
            };
            BuyExecution: {
                fees: string;
                weight: string;
                debt: string;
                haltOnError: string;
                instructions: string;
            };
        };
    };
    /**
     * Lookup434: xcm::v1::Response
     **/
    XcmV1Response: {
        _enum: {
            Assets: string;
            Version: string;
        };
    };
    /**
     * Lookup562: polkadot_runtime_common::claims::pallet::Error<T>
     **/
    PolkadotRuntimeCommonClaimsPalletError: {
        _enum: string[];
    };
    /**
     * Lookup639: polkadot_runtime_parachains::configuration::HostConfiguration<BlockNumber>
     **/
    PolkadotRuntimeParachainsConfigurationHostConfiguration: {
        maxCodeSize: string;
        maxHeadDataSize: string;
        maxUpwardQueueCount: string;
        maxUpwardQueueSize: string;
        maxUpwardMessageSize: string;
        maxUpwardMessageNumPerCandidate: string;
        hrmpMaxMessageNumPerCandidate: string;
        validationUpgradeCooldown: string;
        validationUpgradeDelay: string;
        maxPovSize: string;
        maxDownwardMessageSize: string;
        umpServiceTotalWeight: string;
        hrmpMaxParachainOutboundChannels: string;
        hrmpMaxParathreadOutboundChannels: string;
        hrmpSenderDeposit: string;
        hrmpRecipientDeposit: string;
        hrmpChannelMaxCapacity: string;
        hrmpChannelMaxTotalSize: string;
        hrmpMaxParachainInboundChannels: string;
        hrmpMaxParathreadInboundChannels: string;
        hrmpChannelMaxMessageSize: string;
        codeRetentionPeriod: string;
        parathreadCores: string;
        parathreadRetries: string;
        groupRotationFrequency: string;
        chainAvailabilityPeriod: string;
        threadAvailabilityPeriod: string;
        schedulingLookahead: string;
        maxValidatorsPerCore: string;
        maxValidators: string;
        disputePeriod: string;
        disputePostConclusionAcceptancePeriod: string;
        disputeMaxSpamSlots: string;
        disputeConclusionByTimeOutPeriod: string;
        noShowSlots: string;
        nDelayTranches: string;
        zerothDelayTrancheWidth: string;
        neededApprovals: string;
        relayVrfModuloSamples: string;
        umpMaxIndividualWeight: string;
        pvfCheckingEnabled: string;
        pvfVotingTtl: string;
        minimumValidationUpgradeDelay: string;
    };
    /**
     * Lookup642: polkadot_runtime_parachains::configuration::pallet::Error<T>
     **/
    PolkadotRuntimeParachainsConfigurationPalletError: {
        _enum: string[];
    };
    /**
     * Lookup645: polkadot_runtime_parachains::inclusion::AvailabilityBitfieldRecord<N>
     **/
    PolkadotRuntimeParachainsInclusionAvailabilityBitfieldRecord: {
        bitfield: string;
        submittedAt: string;
    };
    /**
     * Lookup646: polkadot_runtime_parachains::inclusion::CandidatePendingAvailability<primitive_types::H256, N>
     **/
    PolkadotRuntimeParachainsInclusionCandidatePendingAvailability: {
        _alias: {
            hash_: string;
        };
        core: string;
        hash_: string;
        descriptor: string;
        availabilityVotes: string;
        backers: string;
        relayParentNumber: string;
        backedInNumber: string;
        backingGroup: string;
    };
    /**
     * Lookup647: polkadot_runtime_parachains::inclusion::pallet::Error<T>
     **/
    PolkadotRuntimeParachainsInclusionPalletError: {
        _enum: string[];
    };
    /**
     * Lookup648: polkadot_primitives::v2::ScrapedOnChainVotes<primitive_types::H256>
     **/
    PolkadotPrimitivesV2ScrapedOnChainVotes: {
        session: string;
        backingValidatorsPerCandidate: string;
        disputes: string;
    };
    /**
     * Lookup653: polkadot_runtime_parachains::paras_inherent::pallet::Error<T>
     **/
    PolkadotRuntimeParachainsParasInherentPalletError: {
        _enum: string[];
    };
    /**
     * Lookup655: polkadot_runtime_parachains::scheduler::ParathreadClaimQueue
     **/
    PolkadotRuntimeParachainsSchedulerParathreadClaimQueue: {
        queue: string;
        nextCoreOffset: string;
    };
    /**
     * Lookup657: polkadot_runtime_parachains::scheduler::QueuedParathread
     **/
    PolkadotRuntimeParachainsSchedulerQueuedParathread: {
        claim: string;
        coreOffset: string;
    };
    /**
     * Lookup658: polkadot_primitives::v2::ParathreadEntry
     **/
    PolkadotPrimitivesV2ParathreadEntry: {
        claim: string;
        retries: string;
    };
    /**
     * Lookup659: polkadot_primitives::v2::ParathreadClaim
     **/
    PolkadotPrimitivesV2ParathreadClaim: string;
    /**
     * Lookup662: polkadot_primitives::v2::CoreOccupied
     **/
    PolkadotPrimitivesV2CoreOccupied: {
        _enum: {
            Parathread: string;
            Parachain: string;
        };
    };
    /**
     * Lookup665: polkadot_runtime_parachains::scheduler::CoreAssignment
     **/
    PolkadotRuntimeParachainsSchedulerCoreAssignment: {
        core: string;
        paraId: string;
        kind: string;
        groupIdx: string;
    };
    /**
     * Lookup666: polkadot_runtime_parachains::scheduler::AssignmentKind
     **/
    PolkadotRuntimeParachainsSchedulerAssignmentKind: {
        _enum: {
            Parachain: string;
            Parathread: string;
        };
    };
    /**
     * Lookup667: polkadot_runtime_parachains::paras::PvfCheckActiveVoteState<BlockNumber>
     **/
    PolkadotRuntimeParachainsParasPvfCheckActiveVoteState: {
        votesAccept: string;
        votesReject: string;
        age: string;
        createdAt: string;
        causes: string;
    };
    /**
     * Lookup669: polkadot_runtime_parachains::paras::PvfCheckCause<BlockNumber>
     **/
    PolkadotRuntimeParachainsParasPvfCheckCause: {
        _enum: {
            Onboarding: string;
            Upgrade: {
                id: string;
                relayParentNumber: string;
            };
        };
    };
    /**
     * Lookup671: polkadot_runtime_parachains::paras::ParaLifecycle
     **/
    PolkadotRuntimeParachainsParasParaLifecycle: {
        _enum: string[];
    };
    /**
     * Lookup673: polkadot_runtime_parachains::paras::ParaPastCodeMeta<N>
     **/
    PolkadotRuntimeParachainsParasParaPastCodeMeta: {
        upgradeTimes: string;
        lastPruned: string;
    };
    /**
     * Lookup675: polkadot_runtime_parachains::paras::ReplacementTimes<N>
     **/
    PolkadotRuntimeParachainsParasReplacementTimes: {
        expectedAt: string;
        activatedAt: string;
    };
    /**
     * Lookup677: polkadot_primitives::v2::UpgradeGoAhead
     **/
    PolkadotPrimitivesV2UpgradeGoAhead: {
        _enum: string[];
    };
    /**
     * Lookup678: polkadot_primitives::v2::UpgradeRestriction
     **/
    PolkadotPrimitivesV2UpgradeRestriction: {
        _enum: string[];
    };
    /**
     * Lookup679: polkadot_runtime_parachains::paras::ParaGenesisArgs
     **/
    PolkadotRuntimeParachainsParasParaGenesisArgs: {
        genesisHead: string;
        validationCode: string;
        paraKind: string;
    };
    /**
     * Lookup680: polkadot_runtime_parachains::paras::pallet::Error<T>
     **/
    PolkadotRuntimeParachainsParasPalletError: {
        _enum: string[];
    };
    /**
     * Lookup682: polkadot_runtime_parachains::initializer::BufferedSessionChange
     **/
    PolkadotRuntimeParachainsInitializerBufferedSessionChange: {
        validators: string;
        queued: string;
        sessionIndex: string;
    };
    /**
     * Lookup684: polkadot_core_primitives::InboundDownwardMessage<BlockNumber>
     **/
    PolkadotCorePrimitivesInboundDownwardMessage: {
        sentAt: string;
        msg: string;
    };
    /**
     * Lookup686: polkadot_runtime_parachains::ump::pallet::Error<T>
     **/
    PolkadotRuntimeParachainsUmpPalletError: {
        _enum: string[];
    };
    /**
     * Lookup687: polkadot_runtime_parachains::hrmp::HrmpOpenChannelRequest
     **/
    PolkadotRuntimeParachainsHrmpHrmpOpenChannelRequest: {
        confirmed: string;
        age: string;
        senderDeposit: string;
        maxMessageSize: string;
        maxCapacity: string;
        maxTotalSize: string;
    };
    /**
     * Lookup689: polkadot_runtime_parachains::hrmp::HrmpChannel
     **/
    PolkadotRuntimeParachainsHrmpHrmpChannel: {
        maxCapacity: string;
        maxTotalSize: string;
        maxMessageSize: string;
        msgCount: string;
        totalSize: string;
        mqcHead: string;
        senderDeposit: string;
        recipientDeposit: string;
    };
    /**
     * Lookup692: polkadot_core_primitives::InboundHrmpMessage<BlockNumber>
     **/
    PolkadotCorePrimitivesInboundHrmpMessage: {
        sentAt: string;
        data: string;
    };
    /**
     * Lookup695: polkadot_runtime_parachains::hrmp::pallet::Error<T>
     **/
    PolkadotRuntimeParachainsHrmpPalletError: {
        _enum: string[];
    };
    /**
     * Lookup697: polkadot_primitives::v2::SessionInfo
     **/
    PolkadotPrimitivesV2SessionInfo: {
        activeValidatorIndices: string;
        randomSeed: string;
        disputePeriod: string;
        validators: string;
        discoveryKeys: string;
        assignmentKeys: string;
        validatorGroups: string;
        nCores: string;
        zerothDelayTrancheWidth: string;
        relayVrfModuloSamples: string;
        nDelayTranches: string;
        noShowSlots: string;
        neededApprovals: string;
    };
    /**
     * Lookup698: polkadot_primitives::v2::IndexedVec<polkadot_primitives::v2::ValidatorIndex, polkadot_primitives::v2::validator_app::Public>
     **/
    PolkadotPrimitivesV2IndexedVecValidatorIndex: string;
    /**
     * Lookup700: polkadot_primitives::v2::IndexedVec<polkadot_primitives::v2::GroupIndex, V>
     **/
    PolkadotPrimitivesV2IndexedVecGroupIndex: string;
    /**
     * Lookup702: polkadot_primitives::v2::DisputeState<N>
     **/
    PolkadotPrimitivesV2DisputeState: {
        validatorsFor: string;
        validatorsAgainst: string;
        start: string;
        concludedAt: string;
    };
    /**
     * Lookup703: polkadot_runtime_parachains::disputes::pallet::Error<T>
     **/
    PolkadotRuntimeParachainsDisputesPalletError: {
        _enum: string[];
    };
    /**
     * Lookup704: polkadot_runtime_common::paras_registrar::ParaInfo<sp_core::crypto::AccountId32, Balance>
     **/
    PolkadotRuntimeCommonParasRegistrarParaInfo: {
        manager: string;
        deposit: string;
        locked: string;
    };
    /**
     * Lookup705: polkadot_runtime_common::paras_registrar::pallet::Error<T>
     **/
    PolkadotRuntimeCommonParasRegistrarPalletError: {
        _enum: string[];
    };
    /**
     * Lookup707: polkadot_runtime_common::slots::pallet::Error<T>
     **/
    PolkadotRuntimeCommonSlotsPalletError: {
        _enum: string[];
    };
    /**
     * Lookup712: polkadot_runtime_common::auctions::pallet::Error<T>
     **/
    PolkadotRuntimeCommonAuctionsPalletError: {
        _enum: string[];
    };
    /**
     * Lookup713: polkadot_runtime_common::crowdloan::FundInfo<sp_core::crypto::AccountId32, Balance, BlockNumber, LeasePeriod>
     **/
    PolkadotRuntimeCommonCrowdloanFundInfo: {
        depositor: string;
        verifier: string;
        deposit: string;
        raised: string;
        end: string;
        cap: string;
        lastContribution: string;
        firstPeriod: string;
        lastPeriod: string;
        fundIndex: string;
    };
    /**
     * Lookup714: polkadot_runtime_common::crowdloan::LastContribution<BlockNumber>
     **/
    PolkadotRuntimeCommonCrowdloanLastContribution: {
        _enum: {
            Never: string;
            PreEnding: string;
            Ending: string;
        };
    };
    /**
     * Lookup715: polkadot_runtime_common::crowdloan::pallet::Error<T>
     **/
    PolkadotRuntimeCommonCrowdloanPalletError: {
        _enum: string[];
    };
    /**
     * Lookup716: pallet_xcm::pallet::QueryStatus<BlockNumber>
     **/
    PalletXcmQueryStatus: {
        _enum: {
            Pending: {
                responder: string;
                maybeNotify: string;
                timeout: string;
            };
            VersionNotifier: {
                origin: string;
                isActive: string;
            };
            Ready: {
                response: string;
                at: string;
            };
        };
    };
    /**
     * Lookup719: xcm::VersionedResponse
     **/
    XcmVersionedResponse: {
        _enum: {
            V0: string;
            V1: string;
            V2: string;
        };
    };
    /**
     * Lookup725: pallet_xcm::pallet::VersionMigrationStage
     **/
    PalletXcmVersionMigrationStage: {
        _enum: {
            MigrateSupportedVersion: string;
            MigrateVersionNotifiers: string;
            NotifyCurrentTargets: string;
            MigrateAndNotifyOldTargets: string;
        };
    };
    /**
     * Lookup727: pallet_xcm::pallet::Error<T>
     **/
    PalletXcmError: {
        _enum: string[];
    };
    /**
     * Lookup738: pallet_transaction_payment::ChargeTransactionPayment<T>
     **/
    PalletTransactionPaymentChargeTransactionPayment: string;
    /**
     * Lookup739: polkadot_runtime_common::claims::PrevalidateAttests<T>
     **/
    PolkadotRuntimeCommonClaimsPrevalidateAttests: string;
    /**
     * Lookup740: polkadot_runtime::Runtime
     **/
    PolkadotRuntimeRuntime: string;
};
export default _default;
