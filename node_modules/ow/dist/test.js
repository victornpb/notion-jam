"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const base_predicate_1 = require("./predicates/base-predicate");
/**
Validate the value against the provided predicate.

@hidden

@param value - Value to test.
@param label - Label which should be used in error messages.
@param predicate - Predicate to test to value against.
*/
function test(value, label, predicate) {
    predicate[base_predicate_1.testSymbol](value, test, label);
}
exports.default = test;
