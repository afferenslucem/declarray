import { ISequence } from '../interfaces/i-sequence';
import { SelectSequence } from './implementations/select-sequence';
import { CompareExpression, SelectExpression, WhereCondition, ZipExpression } from '../delegates';
import { ISequenceFactory } from '../interfaces/i-sequence-factory';
import { SelectManySequence } from './implementations/select-many-sequence';
import { WhereSequence } from './implementations/where-sequence';
import { IThenBySequence } from '../interfaces/i-then-by-sequence';
import { OrderBySequence } from './implementations/order-by-sequence';
import { createCompareFunction, createDefaultCompareFunction } from '../utils/default-compare';
import { SkipSequence } from './implementations/skip-sequence';
import { TakeSequence } from './implementations/take-sequence';
import { AppendSequence } from './implementations/append-sequence';
import { PrependSequence } from './implementations/prepend-sequence';
import { ReverseSequence } from './implementations/reverse-sequence';
import { DefaultSequence } from './implementations/default-sequence';
import { IEqualityComparator } from '../interfaces/i-equality-comparator';
import { IGroupedData } from '../interfaces/i-grouped-data';
import { GroupSequence } from './implementations/group-sequence';
import { DistinctSequence } from './implementations/distinct-sequence';
import { DefaultComparator } from '../utils/default-comparator';
import { IOrderOptions } from '../interfaces/i-order-options';
import { Sequence } from './sequence';
import { ConcatSequence } from './implementations/concat-sequence';
import { ExceptSequence } from './implementations/except-sequence';
import { IntersectSequence } from './implementations/intersect-sequence';
import { GroupJoinSequence } from './implementations/group-join-sequence';
import { JoinSequence } from './implementations/join-sequence';
import { UnionSequence } from './implementations/union-sequence';
import { ZipSequence } from './implementations/zip-sequence';

export class SequenceFactory implements ISequenceFactory {
    public selectSequence<TInner, TOuter>(
        sequence: ISequence<TInner>,
        selectCondition: SelectExpression<TInner, TOuter>,
    ): ISequence<TOuter> {
        return new SelectSequence(sequence, selectCondition);
    }

    public selectManySequence<TInner, TOuter>(
        sequence: ISequence<TInner>,
        selectManyCondition: SelectExpression<TInner, TOuter[]>,
    ): ISequence<TOuter> {
        return new SelectManySequence<TInner, TOuter>(sequence, selectManyCondition);
    }

    public whereSequence<TInner>(sequence: ISequence<TInner>, whereCondition: WhereCondition<TInner>): ISequence<TInner> {
        return new WhereSequence<TInner>(sequence, whereCondition);
    }

    public orderBySequence<TInner, TProperty>(
        sequence: ISequence<TInner>,
        compareSelectCondition: SelectExpression<TInner, TProperty>,
        comparator?: IEqualityComparator<TProperty>,
    ): IThenBySequence<TInner> {
        const compare = SequenceFactory.createComparingFunction(compareSelectCondition, comparator);
        return new OrderBySequence(sequence, compare);
    }

    public orderByDescendingSequence<TInner, TProperty>(
        sequence: ISequence<TInner>,
        compareSelectCondition: SelectExpression<TInner, TProperty>,
        comparator?: IEqualityComparator<TProperty>,
    ): IThenBySequence<TInner> {
        const compare = SequenceFactory.createComparingFunction(compareSelectCondition, comparator, true);

        return new OrderBySequence(sequence, compare);
    }

    private static createComparingFunction<TInner, TProperty>(
        compareSelectCondition: SelectExpression<TInner, TProperty>,
        comparator?: IEqualityComparator<TProperty>,
        isOrderDesc = false,
    ): CompareExpression<TInner> {
        const options: IOrderOptions<TInner, TProperty> = {
            propertySelector: compareSelectCondition,
            isOrderDesc,
        };

        return comparator ? createCompareFunction(comparator, options) : createDefaultCompareFunction(options);
    }

    public skipSequence<TInner>(sequence: ISequence<TInner>, skipCount: number): ISequence<TInner> {
        return new SkipSequence(sequence, { sliceCount: skipCount });
    }

    public skipLastSequence<TInner>(sequence: ISequence<TInner>, skipCount: number): ISequence<TInner> {
        return new SkipSequence(sequence, {
            sliceCount: skipCount,
            sliceFromEnd: true,
        });
    }

    public takeSequence<TInner>(sequence: ISequence<TInner>, takeCount: number): ISequence<TInner> {
        return new TakeSequence(sequence, { sliceCount: takeCount });
    }

    public takeLastSequence<TInner>(sequence: ISequence<TInner>, takeCount: number): ISequence<TInner> {
        return new TakeSequence(sequence, {
            sliceCount: takeCount,
            sliceFromEnd: true,
        });
    }

    public appendSequence<TInner>(sequence: ISequence<TInner>, item: TInner): ISequence<TInner> {
        return new AppendSequence(sequence, [item]);
    }

    public prependSequence<TInner>(sequence: ISequence<TInner>, item: TInner): ISequence<TInner> {
        return new PrependSequence(sequence, [item]);
    }

    public reverseSequence<TInner>(sequence: ISequence<TInner>): ISequence<TInner> {
        return new ReverseSequence(sequence);
    }

    public defaultSequence<TInner>(sequence: ISequence<TInner>, $default: TInner | TInner[] | ISequence<TInner>): ISequence<TInner> {
        return new DefaultSequence(sequence, $default);
    }

    public groupBySequence<TInner, TKey, TValue>(
        sequence: ISequence<TInner>,
        arg1: SelectExpression<TInner, TKey>,
        arg2?: SelectExpression<ISequence<TInner>, TValue> | IEqualityComparator<TKey>,
        arg3?: SelectExpression<ISequence<TInner>, TValue>,
    ): ISequence<IGroupedData<TKey, TValue>> {
        if (typeof arg2 === 'function') {
            return new GroupSequence<TInner, TKey, TValue>(sequence, arg1, undefined, arg2);
        } else if (typeof arg2 === 'object') {
            return new GroupSequence<TInner, TKey, TValue>(sequence, arg1, arg2, arg3);
        } else {
            return new GroupSequence<TInner, TKey, TValue>(sequence, arg1, undefined, arg3);
        }
    }

    public distinctSequence<TInner>(sequence: ISequence<TInner>, comparator?: IEqualityComparator<TInner>): ISequence<TInner> {
        return new DistinctSequence<TInner>(sequence, comparator || (new DefaultComparator() as IEqualityComparator<any>));
    }

    public concatSequence<TInner>(sequence: ISequence<TInner>, additional: ISequence<TInner> | TInner[]): ISequence<TInner> {
        return new ConcatSequence<TInner>(sequence, new Sequence(additional));
    }

    public exceptSequence<TInner>(
        sequence: ISequence<TInner>,
        additional: ISequence<TInner> | TInner[],
        comparator: IEqualityComparator<TInner>,
    ): ISequence<TInner> {
        return new ExceptSequence<TInner>(sequence, new Sequence(additional), comparator);
    }

    public intersectSequence<TInner>(
        sequence: ISequence<TInner>,
        additional: ISequence<TInner> | TInner[],
        comparator: IEqualityComparator<TInner>,
    ): ISequence<TInner> {
        return new IntersectSequence<TInner>(sequence, new Sequence(additional), comparator);
    }

    public groupJoinSequence<TInner, TOuter, TKey, TResult>(
        sequence: ISequence<TInner>,
        outer: ISequence<TOuter> | TOuter[],
        innerKeySelector: SelectExpression<TInner, TKey>,
        outerKeySelector: SelectExpression<TOuter, TKey>,
        zipFunction: ZipExpression<TInner, ISequence<TOuter>, TResult>,
        comparer: IEqualityComparator<TKey>,
    ): ISequence<TResult> {
        return new GroupJoinSequence(sequence, new Sequence(outer), innerKeySelector, outerKeySelector, zipFunction, comparer);
    }

    public joinSequence<TInner, TOuter, TKey, TResult>(
        sequence: ISequence<TInner>,
        outer: ISequence<TOuter> | TOuter[],
        innerKeySelector: SelectExpression<TInner, TKey>,
        outerKeySelector: SelectExpression<TOuter, TKey>,
        zipFunction: ZipExpression<TInner, TOuter, TResult>,
        comparer: IEqualityComparator<TKey>,
    ): ISequence<TResult> {
        return new JoinSequence(sequence, new Sequence(outer), innerKeySelector, outerKeySelector, zipFunction, comparer);
    }

    public unionSequence<TInner>(
        sequence: ISequence<TInner>,
        additional: ISequence<TInner> | TInner[],
        comparator: IEqualityComparator<TInner>,
    ): ISequence<TInner> {
        return new UnionSequence<TInner>(sequence, new Sequence(additional), comparator);
    }

    public zipSequence<TInner, TOuter, TResult>(
        sequence: ISequence<TInner>,
        additional: ISequence<TOuter> | TOuter[],
        zipFunction: ZipExpression<TInner, TOuter, TResult>,
    ): ISequence<TResult> {
        return new ZipSequence(sequence, new Sequence(additional), zipFunction);
    }
}
