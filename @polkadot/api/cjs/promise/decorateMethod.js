"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.promiseTracker = promiseTracker;
exports.toPromiseMethod = toPromiseMethod;
var _rxjs = require("rxjs");
var _util = require("@polkadot/util");
// Copyright 2017-2022 @polkadot/api authors & contributors
// SPDX-License-Identifier: Apache-2.0

// a Promise completion tracker, wrapping an isComplete variable that ensures
// that the promise only resolves once
function promiseTracker(resolve, reject) {
  let isCompleted = false;
  return {
    reject: error => {
      if (!isCompleted) {
        isCompleted = true;
        reject(error);
      }
      return _rxjs.EMPTY;
    },
    resolve: value => {
      if (!isCompleted) {
        isCompleted = true;
        resolve(value);
      }
    }
  };
}

// extract the arguments and callback params from a value array possibly containing a callback
function extractArgs(args, needsCallback) {
  const actualArgs = args.slice();

  // If the last arg is a function, we pop it, put it into callback.
  // actualArgs will then hold the actual arguments to be passed to `method`
  const callback = args.length && (0, _util.isFunction)(args[args.length - 1]) ? actualArgs.pop() : undefined;

  // When we need a subscription, ensure that a valid callback is actually passed
  if (needsCallback && !(0, _util.isFunction)(callback)) {
    throw new Error('Expected a callback to be passed with subscriptions');
  }
  return [actualArgs, callback];
}

// Decorate a call for a single-shot result - retrieve and then immediate unsubscribe
function decorateCall(method, args) {
  return new Promise((resolve, reject) => {
    // single result tracker - either reject with Error or resolve with Codec result
    const tracker = promiseTracker(resolve, reject);

    // encoding errors reject immediately, any result unsubscribes and resolves
    const subscription = method(...args).pipe((0, _rxjs.catchError)(error => tracker.reject(error))).subscribe(result => {
      tracker.resolve(result);
      (0, _util.nextTick)(() => subscription.unsubscribe());
    });
  });
}

// Decorate a subscription where we have a result callback specified
function decorateSubscribe(method, args, resultCb) {
  return new Promise((resolve, reject) => {
    // either reject with error or resolve with unsubscribe callback
    const tracker = promiseTracker(resolve, reject);

    // errors reject immediately, the first result resolves with an unsubscribe promise, all results via callback
    const subscription = method(...args).pipe((0, _rxjs.catchError)(error => tracker.reject(error)), (0, _rxjs.tap)(() => tracker.resolve(() => subscription.unsubscribe()))).subscribe(result => {
      // queue result (back of queue to clear current)
      (0, _util.nextTick)(() => resultCb(result));
    });
  });
}

/**
 * @description Decorate method for ApiPromise, where the results are converted to the Promise equivalent
 */
function toPromiseMethod(method, options) {
  const needsCallback = !!(options && options.methodName && options.methodName.includes('subscribe'));
  return function () {
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }
    const [actualArgs, resultCb] = extractArgs(args, needsCallback);
    return resultCb ? decorateSubscribe(method, actualArgs, resultCb) : decorateCall((options == null ? void 0 : options.overrideNoSub) || method, actualArgs);
  };
}