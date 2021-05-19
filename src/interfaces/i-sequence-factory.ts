import { ISequence } from './i-sequence';
import { SelectExpression, WhereCondition, ZipExpression } from '../delegates';
import { IThenBySequence } from './i-then-by-sequence';
import { IEqualityComparator } from './i-equality-comparator';
import { IGroupedData } from './i-grouped-data';

export interface ISequenceFactory {
    selectSequence<TInner, TOuter>(sequence: ISequence<TInner>, selectCondition: SelectExpression<TInner, TOuter>): ISequence<TOuter>;

    selectManySequence<TInner, TOuter>(
        sequence: ISequence<TInner>,
        selectManyCondition: SelectExpression<TInner, TOuter[]>,
    ): ISequence<TOuter>;

    whereSequence<TInner>(sequence: ISequence<TInner>, whereCondition: WhereCondition<TInner>): ISequence<TInner>;

    orderBySequence<TInner, TProperty>(
        sequence: ISequence<TInner>,
        selectPropertyExpression: SelectExpression<TInner, TProperty>,
        comparator?: IEqualityComparator<TProperty>,
    ): IThenBySequence<TInner>;

    orderByDescendingSequence<TInner, TProperty>(
        sequence: ISequence<TInner>,
        selectPropertyExpression: SelectExpression<TInner, TProperty>,
        comparator?: IEqualityComparator<TProperty>,
    ): IThenBySequence<TInner>;

    skipSequence<TInner>(sequence: ISequence<TInner>, skipCount: number): ISequence<TInner>;

    skipLastSequence<TInner>(sequence: ISequence<TInner>, skipCount: number): ISequence<TInner>;

    takeSequence<TInner>(sequence: ISequence<TInner>, takeCount: number): ISequence<TInner>;

    takeLastSequence<TInner>(sequence: ISequence<TInner>, takeCount: number): ISequence<TInner>;

    appendSequence<TInner>(sequence: ISequence<TInner>, item: TInner): ISequence<TInner>;

    prependSequence<TInner>(sequence: ISequence<TInner>, item: TInner): ISequence<TInner>;

    reverseSequence<TInner>(sequence: ISequence<TInner>): ISequence<TInner>;

    defaultSequence<TInner>(sequence: ISequence<TInner>, $default: TInner | TInner[] | ISequence<TInner>): ISequence<TInner>;

    groupBySequence<TInner, TKey, TValue>(
        sequence: ISequence<TInner>,
        key: SelectExpression<TInner, TKey>,
        comparer?: SelectExpression<ISequence<TInner>, TValue> | IEqualityComparator<TKey>,
        group?: SelectExpression<ISequence<TInner>, TValue>,
    ): ISequence<IGroupedData<TKey, TValue>>;

    distinctSequence<TInner>(sequence: ISequence<TInner>, comparator?: IEqualityComparator<TInner>): ISequence<TInner>;

    concatSequence<TInner>(sequence: ISequence<TInner>, additional: ISequence<TInner> | TInner[]): ISequence<TInner>;

    exceptSequence<TInner>(
        sequence: ISequence<TInner>,
        additional: ISequence<TInner> | TInner[],
        comparator: IEqualityComparator<TInner>,
    ): ISequence<TInner>;

    intersectSequence<TInner>(
        sequence: ISequence<TInner>,
        additional: ISequence<TInner> | TInner[],
        comparator: IEqualityComparator<TInner>,
    ): ISequence<TInner>;

    groupJoinSequence<TInner, TOuter, TKey, TResult>(
        sequence: ISequence<TInner>,
        outer: ISequence<TOuter> | TOuter[],
        innerKeySelector: SelectExpression<TInner, TKey>,
        outerKeySelector: SelectExpression<TOuter, TKey>,
        zipFunction: ZipExpression<TInner, ISequence<TOuter>, TResult>,
        comparer: IEqualityComparator<TKey>,
    ): ISequence<TResult>;

    joinSequence<TInner, TOuter, TKey, TResult>(
        sequence: ISequence<TInner>,
        outer: ISequence<TOuter> | TOuter[],
        innerKeySelector: SelectExpression<TInner, TKey>,
        outerKeySelector: SelectExpression<TOuter, TKey>,
        zipFunction: ZipExpression<TInner, TOuter, TResult>,
        comparer: IEqualityComparator<TKey>,
    ): ISequence<TResult>;

    unionSequence<TInner>(
        sequence: ISequence<TInner>,
        additional: ISequence<TInner> | TInner[],
        comparator: IEqualityComparator<TInner>,
    ): ISequence<TInner>;

    zipSequence<TInner, TOuter, TResult>(
        sequence: ISequence<TInner>,
        additional: ISequence<TOuter> | TOuter[],
        zipFunction: ZipExpression<TInner, TOuter, TResult>,
    ): ISequence<TResult>;
}
