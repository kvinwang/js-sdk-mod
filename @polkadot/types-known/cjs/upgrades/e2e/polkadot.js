"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
// Copyright 2017-2022 @polkadot/types-known authors & contributors
// SPDX-License-Identifier: Apache-2.0
// Auto-generated from on-chain data & manual definitions, do not edit

/* eslint-disable quotes, comma-spacing */
const upgrades = [[0, 0, [["0xdf6acb689907609b", 3], ["0x37e397fc7c91f5e4", 1], ["0x40fe3ad401f8959a", 4], ["0xd2bc9897eed08f15", 2], ["0xf78b278be53f454c", 2], ["0xaf2c0297a23e6d3d", 3], ["0xed99c5acb25eedf5", 2], ["0xcbca25e39f142387", 2], ["0x687ad44ad37f03c2", 1], ["0xab3c0572291feb8b", 1], ["0xbc9d89904f5b923f", 1], ["0x37c8bb1350a9a2a8", 1]]], [29231, 1, [["0xdf6acb689907609b", 3], ["0x37e397fc7c91f5e4", 1], ["0x40fe3ad401f8959a", 4], ["0xd2bc9897eed08f15", 2], ["0xf78b278be53f454c", 2], ["0xaf2c0297a23e6d3d", 3], ["0xed99c5acb25eedf5", 2], ["0xcbca25e39f142387", 2], ["0x687ad44ad37f03c2", 1], ["0xab3c0572291feb8b", 1], ["0xbc9d89904f5b923f", 1], ["0x37c8bb1350a9a2a8", 1]]], [188836, 5, [["0xdf6acb689907609b", 3], ["0x37e397fc7c91f5e4", 1], ["0x40fe3ad401f8959a", 4], ["0xd2bc9897eed08f15", 2], ["0xf78b278be53f454c", 2], ["0xaf2c0297a23e6d3d", 3], ["0xed99c5acb25eedf5", 2], ["0xcbca25e39f142387", 2], ["0x687ad44ad37f03c2", 1], ["0xab3c0572291feb8b", 1], ["0xbc9d89904f5b923f", 1], ["0x37c8bb1350a9a2a8", 1]]], [199405, 6, [["0xdf6acb689907609b", 3], ["0x37e397fc7c91f5e4", 1], ["0x40fe3ad401f8959a", 4], ["0xd2bc9897eed08f15", 2], ["0xf78b278be53f454c", 2], ["0xaf2c0297a23e6d3d", 3], ["0xed99c5acb25eedf5", 2], ["0xcbca25e39f142387", 2], ["0x687ad44ad37f03c2", 1], ["0xab3c0572291feb8b", 1], ["0xbc9d89904f5b923f", 1], ["0x37c8bb1350a9a2a8", 1]]], [214264, 7, [["0xdf6acb689907609b", 3], ["0x37e397fc7c91f5e4", 1], ["0x40fe3ad401f8959a", 4], ["0xd2bc9897eed08f15", 2], ["0xf78b278be53f454c", 2], ["0xaf2c0297a23e6d3d", 3], ["0xed99c5acb25eedf5", 2], ["0xcbca25e39f142387", 2], ["0x687ad44ad37f03c2", 1], ["0xab3c0572291feb8b", 1], ["0xbc9d89904f5b923f", 1], ["0x37c8bb1350a9a2a8", 1]]], [244358, 8, [["0xdf6acb689907609b", 3], ["0x37e397fc7c91f5e4", 1], ["0x40fe3ad401f8959a", 4], ["0xd2bc9897eed08f15", 2], ["0xf78b278be53f454c", 2], ["0xaf2c0297a23e6d3d", 3], ["0xed99c5acb25eedf5", 2], ["0xcbca25e39f142387", 2], ["0x687ad44ad37f03c2", 1], ["0xab3c0572291feb8b", 1], ["0xbc9d89904f5b923f", 1], ["0x37c8bb1350a9a2a8", 1]]], [303079, 9, [["0xdf6acb689907609b", 3], ["0x37e397fc7c91f5e4", 1], ["0x40fe3ad401f8959a", 4], ["0xd2bc9897eed08f15", 2], ["0xf78b278be53f454c", 2], ["0xaf2c0297a23e6d3d", 3], ["0xed99c5acb25eedf5", 2], ["0xcbca25e39f142387", 2], ["0x687ad44ad37f03c2", 1], ["0xab3c0572291feb8b", 1], ["0xbc9d89904f5b923f", 1], ["0x37c8bb1350a9a2a8", 1]]], [314201, 10, [["0xdf6acb689907609b", 3], ["0x37e397fc7c91f5e4", 1], ["0x40fe3ad401f8959a", 4], ["0xd2bc9897eed08f15", 2], ["0xf78b278be53f454c", 2], ["0xaf2c0297a23e6d3d", 3], ["0xed99c5acb25eedf5", 2], ["0xcbca25e39f142387", 2], ["0x687ad44ad37f03c2", 1], ["0xab3c0572291feb8b", 1], ["0xbc9d89904f5b923f", 1], ["0x37c8bb1350a9a2a8", 1]]], [342400, 11, [["0xdf6acb689907609b", 3], ["0x37e397fc7c91f5e4", 1], ["0x40fe3ad401f8959a", 4], ["0xd2bc9897eed08f15", 2], ["0xf78b278be53f454c", 2], ["0xaf2c0297a23e6d3d", 3], ["0xed99c5acb25eedf5", 2], ["0xcbca25e39f142387", 2], ["0x687ad44ad37f03c2", 1], ["0xab3c0572291feb8b", 1], ["0xbc9d89904f5b923f", 1], ["0x37c8bb1350a9a2a8", 1]]], [443963, 12, [["0xdf6acb689907609b", 3], ["0x37e397fc7c91f5e4", 1], ["0x40fe3ad401f8959a", 4], ["0xd2bc9897eed08f15", 2], ["0xf78b278be53f454c", 2], ["0xaf2c0297a23e6d3d", 3], ["0xed99c5acb25eedf5", 2], ["0xcbca25e39f142387", 2], ["0x687ad44ad37f03c2", 1], ["0xab3c0572291feb8b", 1], ["0xbc9d89904f5b923f", 1], ["0x37c8bb1350a9a2a8", 1]]], [528470, 13, [["0xdf6acb689907609b", 3], ["0x37e397fc7c91f5e4", 1], ["0x40fe3ad401f8959a", 4], ["0xd2bc9897eed08f15", 2], ["0xf78b278be53f454c", 2], ["0xaf2c0297a23e6d3d", 3], ["0xed99c5acb25eedf5", 2], ["0xcbca25e39f142387", 2], ["0x687ad44ad37f03c2", 1], ["0xab3c0572291feb8b", 1], ["0xbc9d89904f5b923f", 1], ["0x37c8bb1350a9a2a8", 1]]], [687751, 14, [["0xdf6acb689907609b", 3], ["0x37e397fc7c91f5e4", 1], ["0x40fe3ad401f8959a", 4], ["0xd2bc9897eed08f15", 2], ["0xf78b278be53f454c", 2], ["0xaf2c0297a23e6d3d", 3], ["0xed99c5acb25eedf5", 2], ["0xcbca25e39f142387", 2], ["0x687ad44ad37f03c2", 1], ["0xab3c0572291feb8b", 1], ["0xbc9d89904f5b923f", 1], ["0x37c8bb1350a9a2a8", 1]]], [746085, 15, [["0xdf6acb689907609b", 3], ["0x37e397fc7c91f5e4", 1], ["0x40fe3ad401f8959a", 4], ["0xd2bc9897eed08f15", 2], ["0xf78b278be53f454c", 2], ["0xaf2c0297a23e6d3d", 3], ["0xed99c5acb25eedf5", 2], ["0xcbca25e39f142387", 2], ["0x687ad44ad37f03c2", 1], ["0xab3c0572291feb8b", 1], ["0xbc9d89904f5b923f", 1], ["0x37c8bb1350a9a2a8", 1]]], [787923, 16, [["0xdf6acb689907609b", 3], ["0x37e397fc7c91f5e4", 1], ["0x40fe3ad401f8959a", 4], ["0xd2bc9897eed08f15", 2], ["0xf78b278be53f454c", 2], ["0xaf2c0297a23e6d3d", 3], ["0xed99c5acb25eedf5", 2], ["0xcbca25e39f142387", 2], ["0x687ad44ad37f03c2", 1], ["0xab3c0572291feb8b", 1], ["0xbc9d89904f5b923f", 1], ["0x37c8bb1350a9a2a8", 1]]], [799302, 17, [["0xdf6acb689907609b", 3], ["0x37e397fc7c91f5e4", 1], ["0x40fe3ad401f8959a", 4], ["0xd2bc9897eed08f15", 2], ["0xf78b278be53f454c", 2], ["0xaf2c0297a23e6d3d", 3], ["0xed99c5acb25eedf5", 2], ["0xcbca25e39f142387", 2], ["0x687ad44ad37f03c2", 1], ["0xab3c0572291feb8b", 1], ["0xbc9d89904f5b923f", 1], ["0x37c8bb1350a9a2a8", 1]]], [1205128, 18, [["0xdf6acb689907609b", 3], ["0x37e397fc7c91f5e4", 1], ["0x40fe3ad401f8959a", 4], ["0xd2bc9897eed08f15", 2], ["0xf78b278be53f454c", 2], ["0xaf2c0297a23e6d3d", 3], ["0xed99c5acb25eedf5", 2], ["0xcbca25e39f142387", 2], ["0x687ad44ad37f03c2", 1], ["0xab3c0572291feb8b", 1], ["0xbc9d89904f5b923f", 1], ["0x37c8bb1350a9a2a8", 1]]], [1603423, 23, [["0xdf6acb689907609b", 3], ["0x37e397fc7c91f5e4", 1], ["0x40fe3ad401f8959a", 4], ["0xd2bc9897eed08f15", 2], ["0xf78b278be53f454c", 2], ["0xaf2c0297a23e6d3d", 3], ["0xed99c5acb25eedf5", 2], ["0xcbca25e39f142387", 2], ["0x687ad44ad37f03c2", 1], ["0xab3c0572291feb8b", 1], ["0xbc9d89904f5b923f", 1], ["0x37c8bb1350a9a2a8", 1]]], [1733218, 24, [["0xdf6acb689907609b", 3], ["0x37e397fc7c91f5e4", 1], ["0x40fe3ad401f8959a", 4], ["0xd2bc9897eed08f15", 2], ["0xf78b278be53f454c", 2], ["0xaf2c0297a23e6d3d", 3], ["0xed99c5acb25eedf5", 2], ["0xcbca25e39f142387", 2], ["0x687ad44ad37f03c2", 1], ["0xab3c0572291feb8b", 1], ["0xbc9d89904f5b923f", 1], ["0x37c8bb1350a9a2a8", 1]]], [2005673, 25, [["0xdf6acb689907609b", 3], ["0x37e397fc7c91f5e4", 1], ["0x40fe3ad401f8959a", 4], ["0xd2bc9897eed08f15", 2], ["0xf78b278be53f454c", 2], ["0xaf2c0297a23e6d3d", 1], ["0xed99c5acb25eedf5", 2], ["0xcbca25e39f142387", 2], ["0x687ad44ad37f03c2", 1], ["0xab3c0572291feb8b", 1], ["0xbc9d89904f5b923f", 1], ["0x37c8bb1350a9a2a8", 1]]], [2436698, 26, [["0xdf6acb689907609b", 3], ["0x37e397fc7c91f5e4", 1], ["0x40fe3ad401f8959a", 4], ["0xd2bc9897eed08f15", 2], ["0xf78b278be53f454c", 2], ["0xaf2c0297a23e6d3d", 1], ["0xed99c5acb25eedf5", 2], ["0xcbca25e39f142387", 2], ["0x687ad44ad37f03c2", 1], ["0xab3c0572291feb8b", 1], ["0xbc9d89904f5b923f", 1], ["0x37c8bb1350a9a2a8", 1]]], [3613564, 27, [["0xdf6acb689907609b", 3], ["0x37e397fc7c91f5e4", 1], ["0x40fe3ad401f8959a", 4], ["0xd2bc9897eed08f15", 2], ["0xf78b278be53f454c", 2], ["0xaf2c0297a23e6d3d", 1], ["0xed99c5acb25eedf5", 2], ["0xcbca25e39f142387", 2], ["0x687ad44ad37f03c2", 1], ["0xab3c0572291feb8b", 1], ["0xbc9d89904f5b923f", 1], ["0x37c8bb1350a9a2a8", 1]]], [3899547, 28, [["0xdf6acb689907609b", 3], ["0x37e397fc7c91f5e4", 1], ["0x40fe3ad401f8959a", 4], ["0xd2bc9897eed08f15", 2], ["0xf78b278be53f454c", 2], ["0xaf2c0297a23e6d3d", 1], ["0xed99c5acb25eedf5", 2], ["0xcbca25e39f142387", 2], ["0x687ad44ad37f03c2", 1], ["0xab3c0572291feb8b", 1], ["0xbc9d89904f5b923f", 1], ["0x37c8bb1350a9a2a8", 1]]], [4345767, 29, [["0xdf6acb689907609b", 3], ["0x37e397fc7c91f5e4", 1], ["0x40fe3ad401f8959a", 4], ["0xd2bc9897eed08f15", 2], ["0xf78b278be53f454c", 2], ["0xaf2c0297a23e6d3d", 1], ["0xed99c5acb25eedf5", 2], ["0xcbca25e39f142387", 2], ["0x687ad44ad37f03c2", 1], ["0xab3c0572291feb8b", 1], ["0xbc9d89904f5b923f", 1], ["0x37c8bb1350a9a2a8", 1]]], [4876134, 30, [["0xdf6acb689907609b", 3], ["0x37e397fc7c91f5e4", 1], ["0x40fe3ad401f8959a", 4], ["0xd2bc9897eed08f15", 2], ["0xf78b278be53f454c", 2], ["0xaf2c0297a23e6d3d", 1], ["0xed99c5acb25eedf5", 2], ["0xcbca25e39f142387", 2], ["0x687ad44ad37f03c2", 1], ["0xab3c0572291feb8b", 1], ["0xbc9d89904f5b923f", 1], ["0x37c8bb1350a9a2a8", 1]]], [5661442, 9050, [["0xdf6acb689907609b", 3], ["0x37e397fc7c91f5e4", 1], ["0x40fe3ad401f8959a", 5], ["0xd2bc9897eed08f15", 2], ["0xf78b278be53f454c", 2], ["0xaf2c0297a23e6d3d", 1], ["0x49eaaf1b548a0cb0", 1], ["0x91d5df18b0d2cf58", 1], ["0xed99c5acb25eedf5", 2], ["0xcbca25e39f142387", 2], ["0x687ad44ad37f03c2", 1], ["0xab3c0572291feb8b", 1], ["0xbc9d89904f5b923f", 1], ["0x37c8bb1350a9a2a8", 1]]], [6321619, 9080, [["0xdf6acb689907609b", 3], ["0x37e397fc7c91f5e4", 1], ["0x40fe3ad401f8959a", 5], ["0xd2bc9897eed08f15", 3], ["0xf78b278be53f454c", 2], ["0xaf2c0297a23e6d3d", 1], ["0x49eaaf1b548a0cb0", 1], ["0x91d5df18b0d2cf58", 1], ["0xed99c5acb25eedf5", 2], ["0xcbca25e39f142387", 2], ["0x687ad44ad37f03c2", 1], ["0xab3c0572291feb8b", 1], ["0xbc9d89904f5b923f", 1], ["0x37c8bb1350a9a2a8", 1]]], [6713249, 9090, [["0xdf6acb689907609b", 3], ["0x37e397fc7c91f5e4", 1], ["0x40fe3ad401f8959a", 5], ["0xd2bc9897eed08f15", 3], ["0xf78b278be53f454c", 2], ["0xaf2c0297a23e6d3d", 1], ["0x49eaaf1b548a0cb0", 1], ["0x91d5df18b0d2cf58", 1], ["0xed99c5acb25eedf5", 3], ["0xcbca25e39f142387", 2], ["0x687ad44ad37f03c2", 1], ["0xab3c0572291feb8b", 1], ["0xbc9d89904f5b923f", 1], ["0x37c8bb1350a9a2a8", 1]]], [7217907, 9100, [["0xdf6acb689907609b", 3], ["0x37e397fc7c91f5e4", 1], ["0x40fe3ad401f8959a", 5], ["0xd2bc9897eed08f15", 3], ["0xf78b278be53f454c", 2], ["0xaf2c0297a23e6d3d", 1], ["0x49eaaf1b548a0cb0", 1], ["0x91d5df18b0d2cf58", 1], ["0xed99c5acb25eedf5", 3], ["0xcbca25e39f142387", 2], ["0x687ad44ad37f03c2", 1], ["0xab3c0572291feb8b", 1], ["0xbc9d89904f5b923f", 1], ["0x37c8bb1350a9a2a8", 1]]], [7229126, 9110, [["0xdf6acb689907609b", 3], ["0x37e397fc7c91f5e4", 1], ["0x40fe3ad401f8959a", 5], ["0xd2bc9897eed08f15", 3], ["0xf78b278be53f454c", 2], ["0xaf2c0297a23e6d3d", 1], ["0x49eaaf1b548a0cb0", 1], ["0x91d5df18b0d2cf58", 1], ["0xed99c5acb25eedf5", 3], ["0xcbca25e39f142387", 2], ["0x687ad44ad37f03c2", 1], ["0xab3c0572291feb8b", 1], ["0xbc9d89904f5b923f", 1], ["0x37c8bb1350a9a2a8", 1]]], [7560558, 9122, [["0xdf6acb689907609b", 3], ["0x37e397fc7c91f5e4", 1], ["0x40fe3ad401f8959a", 5], ["0xd2bc9897eed08f15", 3], ["0xf78b278be53f454c", 2], ["0xaf2c0297a23e6d3d", 1], ["0x49eaaf1b548a0cb0", 1], ["0x91d5df18b0d2cf58", 1], ["0xed99c5acb25eedf5", 3], ["0xcbca25e39f142387", 2], ["0x687ad44ad37f03c2", 1], ["0xab3c0572291feb8b", 1], ["0xbc9d89904f5b923f", 1], ["0x37c8bb1350a9a2a8", 1]]], [8115869, 9140, [["0xdf6acb689907609b", 3], ["0x37e397fc7c91f5e4", 1], ["0x40fe3ad401f8959a", 5], ["0xd2bc9897eed08f15", 3], ["0xf78b278be53f454c", 2], ["0xaf2c0297a23e6d3d", 1], ["0x49eaaf1b548a0cb0", 1], ["0x91d5df18b0d2cf58", 1], ["0xed99c5acb25eedf5", 3], ["0xcbca25e39f142387", 2], ["0x687ad44ad37f03c2", 1], ["0xab3c0572291feb8b", 1], ["0xbc9d89904f5b923f", 1], ["0x37c8bb1350a9a2a8", 1]]], [8638103, 9151, [["0xdf6acb689907609b", 3], ["0x37e397fc7c91f5e4", 1], ["0x40fe3ad401f8959a", 5], ["0xd2bc9897eed08f15", 3], ["0xf78b278be53f454c", 2], ["0xaf2c0297a23e6d3d", 1], ["0x49eaaf1b548a0cb0", 1], ["0x91d5df18b0d2cf58", 1], ["0xed99c5acb25eedf5", 3], ["0xcbca25e39f142387", 2], ["0x687ad44ad37f03c2", 1], ["0xab3c0572291feb8b", 1], ["0xbc9d89904f5b923f", 1], ["0x37c8bb1350a9a2a8", 1]]], [9280179, 9170, [["0xdf6acb689907609b", 4], ["0x37e397fc7c91f5e4", 1], ["0x40fe3ad401f8959a", 5], ["0xd2bc9897eed08f15", 3], ["0xf78b278be53f454c", 2], ["0xaf2c0297a23e6d3d", 2], ["0x49eaaf1b548a0cb0", 1], ["0x91d5df18b0d2cf58", 1], ["0xed99c5acb25eedf5", 3], ["0xcbca25e39f142387", 2], ["0x687ad44ad37f03c2", 1], ["0xab3c0572291feb8b", 1], ["0xbc9d89904f5b923f", 1], ["0x37c8bb1350a9a2a8", 1]]], [9738717, 9180, [["0xdf6acb689907609b", 4], ["0x37e397fc7c91f5e4", 1], ["0x40fe3ad401f8959a", 5], ["0xd2bc9897eed08f15", 3], ["0xf78b278be53f454c", 2], ["0xaf2c0297a23e6d3d", 2], ["0x49eaaf1b548a0cb0", 1], ["0x91d5df18b0d2cf58", 1], ["0xed99c5acb25eedf5", 3], ["0xcbca25e39f142387", 2], ["0x687ad44ad37f03c2", 1], ["0xab3c0572291feb8b", 1], ["0xbc9d89904f5b923f", 1], ["0x37c8bb1350a9a2a8", 1]]], [10156856, 9190, [["0xdf6acb689907609b", 4], ["0x37e397fc7c91f5e4", 1], ["0x40fe3ad401f8959a", 6], ["0xd2bc9897eed08f15", 3], ["0xf78b278be53f454c", 2], ["0xaf2c0297a23e6d3d", 2], ["0x49eaaf1b548a0cb0", 1], ["0x91d5df18b0d2cf58", 1], ["0xed99c5acb25eedf5", 3], ["0xcbca25e39f142387", 2], ["0x687ad44ad37f03c2", 1], ["0xab3c0572291feb8b", 1], ["0xbc9d89904f5b923f", 1], ["0x37c8bb1350a9a2a8", 1]]], [10458576, 9200, [["0xdf6acb689907609b", 4], ["0x37e397fc7c91f5e4", 1], ["0x40fe3ad401f8959a", 6], ["0xd2bc9897eed08f15", 3], ["0xf78b278be53f454c", 2], ["0xaf2c0297a23e6d3d", 2], ["0x49eaaf1b548a0cb0", 1], ["0x91d5df18b0d2cf58", 1], ["0xed99c5acb25eedf5", 3], ["0xcbca25e39f142387", 2], ["0x687ad44ad37f03c2", 1], ["0xab3c0572291feb8b", 1], ["0xbc9d89904f5b923f", 1], ["0x37c8bb1350a9a2a8", 1]]], [10655116, 9220, [["0xdf6acb689907609b", 4], ["0x37e397fc7c91f5e4", 1], ["0x40fe3ad401f8959a", 6], ["0xd2bc9897eed08f15", 3], ["0xf78b278be53f454c", 2], ["0xaf2c0297a23e6d3d", 2], ["0x49eaaf1b548a0cb0", 1], ["0x91d5df18b0d2cf58", 1], ["0xed99c5acb25eedf5", 3], ["0xcbca25e39f142387", 2], ["0x687ad44ad37f03c2", 1], ["0xab3c0572291feb8b", 1], ["0xbc9d89904f5b923f", 1], ["0x37c8bb1350a9a2a8", 1]]], [10879371, 9230, [["0xdf6acb689907609b", 4], ["0x37e397fc7c91f5e4", 1], ["0x40fe3ad401f8959a", 6], ["0xd2bc9897eed08f15", 3], ["0xf78b278be53f454c", 2], ["0xaf2c0297a23e6d3d", 2], ["0x49eaaf1b548a0cb0", 1], ["0x91d5df18b0d2cf58", 1], ["0xed99c5acb25eedf5", 3], ["0xcbca25e39f142387", 2], ["0x687ad44ad37f03c2", 1], ["0xab3c0572291feb8b", 1], ["0xbc9d89904f5b923f", 1], ["0x37c8bb1350a9a2a8", 1]]], [11328884, 9250, [["0xdf6acb689907609b", 4], ["0x37e397fc7c91f5e4", 1], ["0x40fe3ad401f8959a", 6], ["0xd2bc9897eed08f15", 3], ["0xf78b278be53f454c", 2], ["0xaf2c0297a23e6d3d", 2], ["0x49eaaf1b548a0cb0", 1], ["0x91d5df18b0d2cf58", 1], ["0xed99c5acb25eedf5", 3], ["0xcbca25e39f142387", 2], ["0x687ad44ad37f03c2", 1], ["0xab3c0572291feb8b", 1], ["0xbc9d89904f5b923f", 1], ["0x37c8bb1350a9a2a8", 1]]], [11532856, 9260, [["0xdf6acb689907609b", 4], ["0x37e397fc7c91f5e4", 1], ["0x40fe3ad401f8959a", 6], ["0xd2bc9897eed08f15", 3], ["0xf78b278be53f454c", 2], ["0xaf2c0297a23e6d3d", 2], ["0x49eaaf1b548a0cb0", 1], ["0x91d5df18b0d2cf58", 1], ["0xed99c5acb25eedf5", 3], ["0xcbca25e39f142387", 2], ["0x687ad44ad37f03c2", 1], ["0xab3c0572291feb8b", 1], ["0xbc9d89904f5b923f", 1], ["0x37c8bb1350a9a2a8", 1]]], [11933818, 9270, [["0xdf6acb689907609b", 4], ["0x37e397fc7c91f5e4", 1], ["0x40fe3ad401f8959a", 6], ["0xd2bc9897eed08f15", 3], ["0xf78b278be53f454c", 2], ["0xaf2c0297a23e6d3d", 2], ["0x49eaaf1b548a0cb0", 1], ["0x91d5df18b0d2cf58", 1], ["0xed99c5acb25eedf5", 3], ["0xcbca25e39f142387", 2], ["0x687ad44ad37f03c2", 1], ["0xab3c0572291feb8b", 1], ["0xbc9d89904f5b923f", 1], ["0x37c8bb1350a9a2a8", 1]]]];
var _default = upgrades;
exports.default = _default;