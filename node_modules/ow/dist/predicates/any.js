"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnyPredicate = void 0;
const argument_error_1 = require("../argument-error");
const base_predicate_1 = require("./base-predicate");
/**
@hidden
*/
class AnyPredicate {
    constructor(predicates, options = {}) {
        Object.defineProperty(this, "predicates", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: predicates
        });
        Object.defineProperty(this, "options", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: options
        });
    }
    [base_predicate_1.testSymbol](value, main, label) {
        const errors = [
            'Any predicate failed with the following errors:'
        ];
        for (const predicate of this.predicates) {
            try {
                main(value, label, predicate);
                return;
            }
            catch (error) {
                if (value === undefined && this.options.optional === true) {
                    return;
                }
                errors.push(`- ${error.message}`);
            }
        }
        throw new argument_error_1.ArgumentError(errors.join('\n'), main);
    }
}
exports.AnyPredicate = AnyPredicate;
