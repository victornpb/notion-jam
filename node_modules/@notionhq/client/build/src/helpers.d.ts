/**
 * Utility for enforcing exhaustiveness checks in the type system.
 *
 * @see https://basarat.gitbook.io/typescript/type-system/discriminated-unions#throw-in-exhaustive-checks
 *
 * @param value The variable with no remaining values
 */
export declare function assertNever(value: never): never;
declare type AllKeys<T> = T extends unknown ? keyof T : never;
export declare function pick<O extends unknown, K extends AllKeys<O>>(base: O, keys: readonly K[]): Pick<O, K>;
export declare function isObject(o: unknown): o is Record<PropertyKey, unknown>;
export {};
//# sourceMappingURL=helpers.d.ts.map