import { BasePredicate } from '../predicates/base-predicate';
declare const _default: <T>(source: IterableIterator<T> | Set<T> | T[], predicate: BasePredicate<T>) => boolean | string;
/**
Test all the values in the collection against a provided predicate.

@hidden
@param source Source collection to test.
@param predicate Predicate to test every item in the source collection against.
*/
export default _default;
