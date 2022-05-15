/**
 * Utilities for working with typescript types
 */
/**
 * Unwrap the type of a promise
 */
export declare type Await<T> = T extends {
    then(onfulfilled?: (value: infer U) => unknown): unknown;
} ? U : T;
/**
 * Assert U is assignable to T.
 */
export declare type Assert<T, U extends T> = U;
//# sourceMappingURL=type-utils.d.ts.map