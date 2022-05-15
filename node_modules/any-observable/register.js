'use strict';
module.exports = require('./loader')(global, loadImplementation);

function loadImplementation(implementation) {
	let finalImplementation;

	if (implementation === 'global.Observable') {
		// If no implementation or env specified use global.Observable
		finalImplementation = {
			Observable: global.Observable,
			implementation: 'global.Observable'
		};
	} else if (implementation) {
		// If implementation specified, require it
		const package_ = require(implementation);

		finalImplementation = {
			Observable: package_.Observable || package_.default || package_,
			implementation
		};
	} else {
		// Try to auto detect implementation. This is non-deterministic
		// and should prefer other branches, but this is our last chance
		// to load something without throwing error.
		finalImplementation = tryAutoDetect();
	}

	if (!finalImplementation) {
		throw new Error('Cannot find any-observable implementation nor `global.Observable`. You must install polyfill or call `require(\'any-observable/register\') with your preferred implementation, for example, `require(\'any-observable/register\')(\'rxjs\')` on app load prior to any `require(\'any-observable\').');
	}

	return finalImplementation;
}

function tryAutoDetect() {
	const packages = [
		'rxjs',
		'zen-observable'
	];

	for (const package_ of packages) {
		try {
			return loadImplementation(package_);
		} catch (_) {}
	}
}
