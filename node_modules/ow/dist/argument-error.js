"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ArgumentError = void 0;
/**
@hidden
*/
class ArgumentError extends Error {
    constructor(message, context) {
        super(message);
        if (Error.captureStackTrace) {
            // TODO: Node.js does not preserve the error name in output when using the below, why?
            Error.captureStackTrace(this, context);
        }
        else {
            this.stack = (new Error()).stack;
        }
        this.name = 'ArgumentError';
    }
}
exports.ArgumentError = ArgumentError;
