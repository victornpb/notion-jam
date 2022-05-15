/* eslint-env node, browser */
'use strict';
module.exports = require('./loader')(window, loadImplementation);

/**
Browser specific `loadImplementation`. Always uses `window.Observable`.

To register a custom implementation, use the `Observable` option.
*/
function loadImplementation() {
	if (typeof window.Observable === 'undefined') {
		throw new TypeError(
			'any-observable browser requires a polyfill or explicit registration, for example:\nrequire("any-observable/register")("rxjs", {Observable: require("rxjs").Observable})'
		);
	}

	return {
		Observable: window.Observable,
		implementation: 'window.Observable'
	};
}
