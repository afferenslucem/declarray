import { IMaterializeSequence } from './i-materialize-sequence';
import { IIterable } from './i-iterable';
import { AccumulateExpression, ReduceExpression, SelectExpression, WhereCondition, ZipExpression } from '../delegates';
import { IThenBySequence } from './i-then-by-sequence';
import { IGroupedData } from './i-grouped-data';
import { IEqualityComparator } from './i-equality-comparator';
import { IPromiseMaterializeSequence } from './i-promise-materialize-sequence';

export interface ISequence<T> extends IMaterializeSequence<T>, IIterable<T> {
    select<TOuter>(condition: SelectExpression<T, TOuter>): ISequence<TOuter>;

    selectMany<TOuter>(selectManyCondition: SelectExpression<T, TOuter[]>): ISequence<TOuter>;

    where(condition: WhereCondition<T>): ISequence<T>;

    orderBy<TProperty>(condition: SelectExpression<T, TProperty>): IThenBySequence<T>;

    orderBy<TProperty>(condition: SelectExpression<T, TProperty>, comparator?: IEqualityComparator<TProperty>): IThenBySequence<T>;

    orderByDescending<TProperty>(condition: SelectExpression<T, TProperty>): IThenBySequence<T>;

    orderByDescending<TProperty>(
        condition: SelectExpression<T, TProperty>,
        comparator?: IEqualityComparator<TProperty>,
    ): IThenBySequence<T>;

    skip(skipCount: number): ISequence<T>;

    skipLast(skipCount: number): ISequence<T>;

    take(takeCount: number): ISequence<T>;

    takeLast(takeCount: number): ISequence<T>;

    append(item: T): ISequence<T>;

    prepend(item: T): ISequence<T>;

    reverse(): ISequence<T>;

    defaultIfEmpty($default: T | T[] | ISequence<T>): ISequence<T>;

    groupBy<TKey>(keySelector: SelectExpression<T, TKey>): ISequence<IGroupedData<TKey, ISequence<T>>>;

    groupBy<TKey>(
        keySelector: SelectExpression<T, TKey>,
        eqalityComparer: IEqualityComparator<TKey>,
    ): ISequence<IGroupedData<TKey, ISequence<T>>>;

    groupBy<TKey, TValue>(
        keySelector: SelectExpression<T, TKey>,
        groupMap: SelectExpression<ISequence<T>, TValue>,
    ): ISequence<IGroupedData<TKey, TValue>>;

    groupBy<TKey, TValue>(
        keySelector: SelectExpression<T, TKey>,
        eqalityComparer: IEqualityComparator<TKey>,
        groupMap: SelectExpression<ISequence<T>, TValue>,
    ): ISequence<IGroupedData<TKey, TValue>>;

    distinct(): ISequence<T>;

    distinct(comparator: IEqualityComparator<T>): ISequence<T>;

    concat(additional: ISequence<T> | T[]): ISequence<T>;

    except(additional: ISequence<T> | T[]): ISequence<T>;

    except(additional: ISequence<T> | T[], comparator?: IEqualityComparator<T>): ISequence<T>;

    intersect(additional: ISequence<T> | T[]): ISequence<T>;

    intersect(additional: ISequence<T> | T[], comparator?: IEqualityComparator<T>): ISequence<T>;

    groupJoin<TOuter, TKey, TResult>(
        outer: ISequence<TOuter> | TOuter[],
        innerKeySelector: SelectExpression<T, TKey>,
        outerKeySelector: SelectExpression<TOuter, TKey>,
        zipFunction: ZipExpression<T, ISequence<TOuter>, TResult>,
    ): ISequence<TResult>;

    groupJoin<TOuter, TKey, TResult>(
        outer: ISequence<TOuter> | TOuter[],
        innerKeySelector: SelectExpression<T, TKey>,
        outerKeySelector: SelectExpression<TOuter, TKey>,
        zipFunction: ZipExpression<T, ISequence<TOuter>, TResult>,
        comparer: IEqualityComparator<TKey>,
    ): ISequence<TResult>;

    join<TOuter, TKey, TResult>(
        outer: ISequence<TOuter> | TOuter[],
        innerKeySelector: SelectExpression<T, TKey>,
        outerKeySelector: SelectExpression<TOuter, TKey>,
        zipFunction: ZipExpression<T, TOuter, TResult>,
    ): ISequence<TResult>;

    join<TOuter, TKey, TResult>(
        outer: ISequence<TOuter> | TOuter[],
        innerKeySelector: SelectExpression<T, TKey>,
        outerKeySelector: SelectExpression<TOuter, TKey>,
        zipFunction: ZipExpression<T, TOuter, TResult>,
        comparer: IEqualityComparator<TKey>,
    ): ISequence<TResult>;

    union(additional: ISequence<T> | T[]): ISequence<T>;

    union(additional: ISequence<T> | T[], comparator: IEqualityComparator<T>): ISequence<T>;

    zip<TOuter, TResult = [T, TOuter]>(additional: ISequence<TOuter> | TOuter[]): ISequence<TResult>;

    zip<TOuter, TResult = [T, TOuter]>(
        additional: ISequence<TOuter> | TOuter[],
        zipFunction: ZipExpression<T, TOuter, TResult>,
    ): ISequence<TResult>;

    aggregate(reduceCondition: ReduceExpression<T>): T;

    aggregate(reduceCondition: ReduceExpression<T>, initial: T): T;

    aggregate<TOuter>(reduceCondition: AccumulateExpression<T, TOuter>, initial: TOuter): TOuter;

    all(condition: WhereCondition<T>): boolean;

    any(condition: WhereCondition<T>): boolean;

    average(): number;
    average(selectCondition?: SelectExpression<T, number>): number;

    contains(target: T): boolean;

    contains(target: T, comparator: IEqualityComparator<T>): boolean;

    count(): number;

    count(whereCondition?: WhereCondition<T>): number;

    elementAt(index: number): T;

    elementAtOrDefault(index: number): T | null;

    elementAtOrDefault(index: number, $default: T): T;

    first(): T;

    first(whereCondition: WhereCondition<T>): T;

    firstOrDefault(): T;

    firstOrDefault($default: T): T;

    firstOrDefault(whereCondition: WhereCondition<T>): T;

    firstOrDefault(whereCondition: WhereCondition<T>, $default: T): T;

    last(): T;

    last(whereCondition: WhereCondition<T>): T;

    lastOrDefault(): T;

    lastOrDefault($default: T): T;

    lastOrDefault(whereCondition: WhereCondition<T>): T;

    lastOrDefault(whereCondition: WhereCondition<T> | T, $default: T): T;

    max(): T;

    max<TProperty>(selectPropertyExpression: SelectExpression<T, TProperty>): T;

    min(): T;

    min<TProperty>(selectPropertyExpression: SelectExpression<T, TProperty>): T;

    sequenceEqual(sequence: ISequence<T>): boolean;

    sequenceEqual(sequence: T[]): boolean;

    sequenceEqual(sequence: ISequence<T>, comparator: IEqualityComparator<T>): boolean;
    sequenceEqual(sequence: T[], comparator: IEqualityComparator<T>): boolean;

    single(): T;

    singleOrDefault(): T;

    singleOrDefault($default: T): T;

    sum(): number;

    sum(selectCondition: SelectExpression<T, number>): number;

    promisify(): IPromiseMaterializeSequence<T>;
}
