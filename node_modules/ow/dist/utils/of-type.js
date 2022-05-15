"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const __1 = require("..");
/**
Test all the values in the collection against a provided predicate.

@hidden
@param source Source collection to test.
@param predicate Predicate to test every item in the source collection against.
*/
exports.default = (source, predicate) => {
    try {
        for (const item of source) {
            __1.default(item, predicate);
        }
        return true;
    }
    catch (error) {
        return error.message;
    }
};
