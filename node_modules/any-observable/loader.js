'use strict';

const REGISTRATION_KEY = Symbol('@@any-observable/REGISTRATION');

let isRegistered;

module.exports = (global, loadImplementation) => {
	return (implementation, options = {}) => {
		// Global registration unless explicitly `{global: false}`` in options (default true)
		const registerGlobal = options.global !== false;

		// Load any previous global registration
		if (registerGlobal && !isRegistered) {
			isRegistered = global[REGISTRATION_KEY];
		}

		if (isRegistered && implementation && isRegistered.implementation !== implementation) {
			throw new Error(`any-observable already defined as \`${isRegistered.implementation}\`. You can only register an implementation before the first call to \`require('any-observable')\` and an implementation cannot be changed`);
		}

		if (!isRegistered) {
			// Use provided implementation
			if (implementation && options.Observable) {
				isRegistered = {
					Observable: options.Observable,
					implementation
				};
			} else {
				// Require implementation if implementation is specified but not provided
				isRegistered = loadImplementation(implementation);
			}

			if (registerGlobal) {
				// Register preference globally in case multiple installations
				global[REGISTRATION_KEY] = isRegistered;
			}
		}

		return isRegistered;
	};
};
