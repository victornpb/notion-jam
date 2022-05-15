'use strict';
require('../register')('rxjs', {
	Observable: require('rxjs').Observable
});
require('rxjs').of; // eslint-disable-line no-unused-expressions
require('rxjs').from; // eslint-disable-line no-unused-expressions
