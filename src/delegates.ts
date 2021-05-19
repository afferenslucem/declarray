export type SelectExpression<TSource, TTarget> = (item: TSource) => TTarget;
export type WhereCondition<T> = (item: T, index?: number) => boolean | number | string;
export type CompareExpression<T> = (first: T, second: T) => number;
export type ReduceExpression<T> = (first: T, second: T) => T;
export type AccumulateExpression<TInner, TOuter = TInner> = (accumulator: TOuter, item: TInner) => TOuter;
export type ZipExpression<T1, T2, TResult> = (first: T1, second: T2) => TResult;
