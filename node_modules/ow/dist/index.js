"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ArgumentError = exports.AnyPredicate = exports.DataViewPredicate = exports.ArrayBufferPredicate = exports.TypedArrayPredicate = exports.WeakSetPredicate = exports.SetPredicate = exports.WeakMapPredicate = exports.MapPredicate = exports.ErrorPredicate = exports.DatePredicate = exports.ObjectPredicate = exports.ArrayPredicate = exports.BooleanPredicate = exports.NumberPredicate = exports.StringPredicate = exports.Predicate = void 0;
const callsites_1 = require("callsites");
const infer_label_1 = require("./utils/infer-label");
const predicate_1 = require("./predicates/predicate");
Object.defineProperty(exports, "Predicate", { enumerable: true, get: function () { return predicate_1.Predicate; } });
const base_predicate_1 = require("./predicates/base-predicate");
const modifiers_1 = require("./modifiers");
const predicates_1 = require("./predicates");
const test_1 = require("./test");
const ow = (value, labelOrPredicate, predicate) => {
    if (!base_predicate_1.isPredicate(labelOrPredicate) && typeof labelOrPredicate !== 'string') {
        throw new TypeError(`Expected second argument to be a predicate or a string, got \`${typeof labelOrPredicate}\``);
    }
    if (base_predicate_1.isPredicate(labelOrPredicate)) {
        // If the second argument is a predicate, infer the label
        const stackFrames = callsites_1.default();
        test_1.default(value, () => infer_label_1.inferLabel(stackFrames), labelOrPredicate);
        return;
    }
    test_1.default(value, labelOrPredicate, predicate);
};
Object.defineProperties(ow, {
    isValid: {
        value: (value, predicate) => {
            try {
                ow(value, predicate);
                return true;
            }
            catch (_a) {
                return false;
            }
        }
    },
    create: {
        value: (labelOrPredicate, predicate) => (value, label) => {
            if (base_predicate_1.isPredicate(labelOrPredicate)) {
                const stackFrames = callsites_1.default();
                test_1.default(value, label !== null && label !== void 0 ? label : (() => infer_label_1.inferLabel(stackFrames)), labelOrPredicate);
                return;
            }
            test_1.default(value, label !== null && label !== void 0 ? label : labelOrPredicate, predicate);
        }
    }
});
// Can't use `export default predicates(modifiers(ow)) as Ow` because the variable needs a type annotation to avoid a compiler error when used:
// Assertions require every name in the call target to be declared with an explicit type annotation.ts(2775)
// See https://github.com/microsoft/TypeScript/issues/36931 for more details.
const _ow = predicates_1.default(modifiers_1.default(ow));
exports.default = _ow;
var predicates_2 = require("./predicates");
Object.defineProperty(exports, "StringPredicate", { enumerable: true, get: function () { return predicates_2.StringPredicate; } });
Object.defineProperty(exports, "NumberPredicate", { enumerable: true, get: function () { return predicates_2.NumberPredicate; } });
Object.defineProperty(exports, "BooleanPredicate", { enumerable: true, get: function () { return predicates_2.BooleanPredicate; } });
Object.defineProperty(exports, "ArrayPredicate", { enumerable: true, get: function () { return predicates_2.ArrayPredicate; } });
Object.defineProperty(exports, "ObjectPredicate", { enumerable: true, get: function () { return predicates_2.ObjectPredicate; } });
Object.defineProperty(exports, "DatePredicate", { enumerable: true, get: function () { return predicates_2.DatePredicate; } });
Object.defineProperty(exports, "ErrorPredicate", { enumerable: true, get: function () { return predicates_2.ErrorPredicate; } });
Object.defineProperty(exports, "MapPredicate", { enumerable: true, get: function () { return predicates_2.MapPredicate; } });
Object.defineProperty(exports, "WeakMapPredicate", { enumerable: true, get: function () { return predicates_2.WeakMapPredicate; } });
Object.defineProperty(exports, "SetPredicate", { enumerable: true, get: function () { return predicates_2.SetPredicate; } });
Object.defineProperty(exports, "WeakSetPredicate", { enumerable: true, get: function () { return predicates_2.WeakSetPredicate; } });
Object.defineProperty(exports, "TypedArrayPredicate", { enumerable: true, get: function () { return predicates_2.TypedArrayPredicate; } });
Object.defineProperty(exports, "ArrayBufferPredicate", { enumerable: true, get: function () { return predicates_2.ArrayBufferPredicate; } });
Object.defineProperty(exports, "DataViewPredicate", { enumerable: true, get: function () { return predicates_2.DataViewPredicate; } });
Object.defineProperty(exports, "AnyPredicate", { enumerable: true, get: function () { return predicates_2.AnyPredicate; } });
var argument_error_1 = require("./argument-error");
Object.defineProperty(exports, "ArgumentError", { enumerable: true, get: function () { return argument_error_1.ArgumentError; } });
