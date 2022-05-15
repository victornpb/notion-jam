"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const is_1 = require("@sindresorhus/is");
const __1 = require("..");
const ofTypeDeep = (object, predicate) => {
    if (!is_1.default.plainObject(object)) {
        __1.default(object, predicate);
        return true;
    }
    return Object.values(object).every(value => ofTypeDeep(value, predicate));
};
/**
Test all the values in the object against a provided predicate.

@hidden

@param predicate - Predicate to test every value in the given object against.
*/
exports.default = (object, predicate) => {
    try {
        return ofTypeDeep(object, predicate);
    }
    catch (error) {
        return error.message;
    }
};
