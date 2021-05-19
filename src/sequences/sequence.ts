import { ISequence } from '../interfaces/i-sequence';
import { AccumulateExpression, ReduceExpression, SelectExpression, WhereCondition, ZipExpression } from '../delegates';
import { IThenBySequence } from '../interfaces/i-then-by-sequence';
import { ILookup } from '../interfaces/i-lookup';
import { IEqualityComparator } from '../interfaces/i-equality-comparator';
import { DefaultComparator } from '../utils/default-comparator';
import { IGroupedData } from '../interfaces/i-grouped-data';
import { HashSet } from '../collections/hash-set';
import { ISequenceFactory } from '../interfaces/i-sequence-factory';
import { Aggregator } from './aggregator';
import { Materializer } from './materializer';
import { Dictionary } from '../collections/dictionary';
import { IPromiseMaterializeSequence } from '../interfaces/i-promise-materialize-sequence';
import { PromisifySequence } from './implementations/promisify-sequence';

export class Sequence<TInner, TOuter = TInner> implements ISequence<TOuter> {
    public static sequenceFactory: ISequenceFactory;
    private static defaultComparator: IEqualityComparator<any> = new DefaultComparator();
    private static defaultZip: ZipExpression<any, any, any> = (a, b) => [a, b];

    protected innerCollection: ISequence<TInner>;
    private _computed: TOuter[];

    public constructor(inner: ISequence<TInner> | TOuter[]) {
        if (Array.isArray(inner)) {
            this._computed = inner;
        } else {
            this.innerCollection = inner;
        }
    }

    [Symbol.iterator](): IterableIterator<TOuter> {
        return this.toArray()[Symbol.iterator]();
    }

    public select<TTarget>(selectCondition: SelectExpression<TOuter, TTarget>): ISequence<TTarget> {
        return Sequence.sequenceFactory.selectSequence(this, selectCondition);
    }

    public selectMany<TTarget>(selectManyCondition: SelectExpression<TOuter, TTarget[]>): ISequence<TTarget> {
        return Sequence.sequenceFactory.selectManySequence(this, selectManyCondition);
    }

    public where(whereCondition: WhereCondition<TOuter>): ISequence<TOuter> {
        return Sequence.sequenceFactory.whereSequence(this, whereCondition);
    }

    public orderBy<TProperty>(
        selectPropertyExpression: SelectExpression<TOuter, TProperty>,
        comparator?: IEqualityComparator<TProperty>,
    ): IThenBySequence<TOuter> {
        return Sequence.sequenceFactory.orderBySequence(this, selectPropertyExpression, comparator);
    }

    public orderByDescending<TProperty>(
        compareSelectCondition: SelectExpression<TOuter, TProperty>,
        comparator?: IEqualityComparator<TProperty>,
    ): IThenBySequence<TOuter> {
        return Sequence.sequenceFactory.orderByDescendingSequence(this, compareSelectCondition, comparator);
    }

    public skip(skipCount: number): ISequence<TOuter> {
        return Sequence.sequenceFactory.skipSequence(this, skipCount);
    }

    public skipLast(skipCount: number): ISequence<TOuter> {
        return Sequence.sequenceFactory.skipLastSequence(this, skipCount);
    }

    public take(takeCount: number): ISequence<TOuter> {
        return Sequence.sequenceFactory.takeSequence(this, takeCount);
    }

    public takeLast(takeCount: number): ISequence<TOuter> {
        return Sequence.sequenceFactory.takeLastSequence(this, takeCount);
    }

    public append(item: TOuter): ISequence<TOuter> {
        return Sequence.sequenceFactory.appendSequence(this, item);
    }

    public prepend(item: TOuter): ISequence<TOuter> {
        return Sequence.sequenceFactory.prependSequence(this, item);
    }

    public reverse(): ISequence<TOuter> {
        return Sequence.sequenceFactory.reverseSequence(this);
    }

    public defaultIfEmpty($default: TOuter | TOuter[] | ISequence<TOuter>): ISequence<TOuter> {
        return Sequence.sequenceFactory.defaultSequence(this, $default);
    }

    public groupBy<TKey, TValue>(
        arg1: SelectExpression<TOuter, TKey>,
        arg2?: SelectExpression<ISequence<TOuter>, TValue> | IEqualityComparator<TKey>,
        arg3?: SelectExpression<ISequence<TOuter>, TValue>,
    ): ISequence<IGroupedData<TKey, TValue>> {
        return Sequence.sequenceFactory.groupBySequence(this, arg1, arg2, arg3);
    }

    public distinct(comparator?: IEqualityComparator<TOuter>): ISequence<TOuter> {
        return Sequence.sequenceFactory.distinctSequence(this, comparator);
    }

    public concat(additional: ISequence<TOuter> | TOuter[]): ISequence<TOuter> {
        return Sequence.sequenceFactory.concatSequence(this, additional);
    }

    public except(additional: ISequence<TOuter> | TOuter[], comparator?: IEqualityComparator<TOuter>): ISequence<TOuter> {
        return Sequence.sequenceFactory.exceptSequence(this, new Sequence(additional), comparator || Sequence.defaultComparator);
    }

    public intersect(additional: ISequence<TOuter> | TOuter[], comparator?: IEqualityComparator<TOuter>): ISequence<TOuter> {
        return Sequence.sequenceFactory.intersectSequence(this, new Sequence(additional), comparator || Sequence.defaultComparator);
    }

    public groupJoin<TJoin, TKey, TResult>(
        outer: ISequence<TJoin> | TJoin[],
        innerKeySelector: SelectExpression<TOuter, TKey>,
        outerKeySelector: SelectExpression<TJoin, TKey>,
        zipFunction: ZipExpression<TOuter, ISequence<TJoin>, TResult>,
        comparer?: IEqualityComparator<TKey>,
    ): ISequence<TResult> {
        return Sequence.sequenceFactory.groupJoinSequence(
            this,
            new Sequence(outer),
            innerKeySelector,
            outerKeySelector,
            zipFunction,
            comparer || Sequence.defaultComparator,
        );
    }

    public join<TJoin, TKey, TResult>(
        outer: ISequence<TJoin> | TJoin[],
        innerKeySelector: SelectExpression<TOuter, TKey>,
        outerKeySelector: SelectExpression<TJoin, TKey>,
        zipFunction: ZipExpression<TOuter, TJoin, TResult>,
        comparer?: IEqualityComparator<TKey>,
    ): ISequence<TResult> {
        return Sequence.sequenceFactory.joinSequence(
            this,
            new Sequence(outer),
            innerKeySelector,
            outerKeySelector,
            zipFunction,
            comparer || Sequence.defaultComparator,
        );
    }

    public union(additional: ISequence<TOuter> | TOuter[], comparator?: IEqualityComparator<TOuter>): ISequence<TOuter> {
        return Sequence.sequenceFactory.unionSequence(this, new Sequence(additional), comparator || Sequence.defaultComparator);
    }

    public zip<TAdditional, TResult = [TOuter, TAdditional]>(
        additional: ISequence<TAdditional> | TAdditional[],
        zipFunction?: ZipExpression<TOuter, TAdditional, TResult>,
    ): ISequence<TResult> {
        return Sequence.sequenceFactory.zipSequence(this, new Sequence(additional), zipFunction || Sequence.defaultZip);
    }

    public aggregate<TResult = TOuter>(
        reduceCondition: ReduceExpression<TOuter> | AccumulateExpression<TOuter, TResult>,
        initial?: TResult,
    ): TResult {
        return Aggregator.aggregate(this, reduceCondition, initial);
    }

    public all(condition: WhereCondition<TOuter>): boolean {
        return Aggregator.all(this, condition);
    }

    public any(condition: WhereCondition<TOuter>): boolean {
        return Aggregator.any(this, condition);
    }

    public average(selectCondition?: SelectExpression<TOuter, number>): number {
        return Aggregator.average(this, selectCondition);
    }

    public contains(target: TOuter, comparator?: IEqualityComparator<TOuter>): boolean {
        return Aggregator.contains(this, target, comparator || Sequence.defaultComparator);
    }

    public count(whereCondition?: WhereCondition<TOuter>): number {
        return Aggregator.count(this, whereCondition);
    }

    public elementAt(index: number): TOuter {
        return Aggregator.elementAt(this, index);
    }

    public elementAtOrDefault(index: number, $default: TOuter = null): TOuter {
        return Aggregator.elementAtOrDefault(this, index, $default);
    }

    public first(whereCondition?: WhereCondition<TOuter>): TOuter {
        return Aggregator.first(this, whereCondition);
    }

    public firstOrDefault(arg1?: WhereCondition<TOuter> | TOuter, arg2: TOuter = null): TOuter {
        if (typeof arg1 === 'function') {
            // @ts-ignore
            return Aggregator.firstOrDefault(this, arg2, arg1);
        } else {
            return Aggregator.firstOrDefault(this, arg1 || null, undefined);
        }
    }

    public last(whereCondition?: WhereCondition<TOuter>): TOuter {
        return Aggregator.last(this, whereCondition);
    }

    public lastOrDefault(arg1?: WhereCondition<TOuter> | TOuter, arg2: TOuter = null): TOuter {
        if (typeof arg1 === 'function') {
            // @ts-ignore
            return Aggregator.lastOrDefault(this, arg2, arg1);
        } else {
            return Aggregator.lastOrDefault(this, arg1 || null, undefined);
        }
    }

    public max<TProperty>(selectPropertyExpression?: SelectExpression<TOuter, TProperty>): TOuter {
        return Aggregator.max(this, selectPropertyExpression);
    }

    public min<TProperty>(selectPropertyExpression?: SelectExpression<TOuter, TProperty>): TOuter {
        return Aggregator.min(this, selectPropertyExpression);
    }

    public sequenceEqual(sequence: ISequence<TOuter> | TOuter[], comparator?: IEqualityComparator<TOuter>): boolean {
        return Aggregator.sequenceEqual(this, new Sequence(sequence), comparator || Sequence.defaultComparator);
    }

    public single(): TOuter {
        return Aggregator.single(this);
    }

    public singleOrDefault($default: TOuter = null): TOuter {
        return Aggregator.singleOrDefault(this, $default);
    }

    public sum(selectCondition?: SelectExpression<TOuter, number>): number {
        return Aggregator.sum(this, selectCondition);
    }

    public promisify(): IPromiseMaterializeSequence<TOuter> {
        return new PromisifySequence(this);
    }

    public toArray(): TOuter[] {
        if (!this._computed) {
            this._computed = this.materialize();
        }
        return this._computed;
    }

    public toLookup<TKey, TValue>(
        arg1: SelectExpression<TOuter, TKey>,
        arg2?: IEqualityComparator<TKey> | SelectExpression<TOuter, TValue>,
        arg3?: SelectExpression<TOuter, TValue>,
    ): ILookup<TKey, TValue> {
        return Materializer.toLookup(this, arg1, arg2, arg3);
    }

    public toHashSet(comparator?: IEqualityComparator<TOuter>): HashSet<TOuter> {
        const result = new HashSet<TOuter>(comparator || Sequence.defaultComparator);

        const array = this.toArray();

        for (let i = 0, len = array.length; i < len; i++) {
            result.add(array[i]);
        }

        return result;
    }

    public toDictionary<TKey, TValue>(
        arg1: SelectExpression<TOuter, TKey>,
        arg2?: IEqualityComparator<TKey> | SelectExpression<TOuter, TValue>,
        arg3?: SelectExpression<TOuter, TValue>,
    ): Dictionary<TKey, TValue> {
        return Materializer.toDictionary(this, arg1, arg2, arg3);
    }

    protected materialize(): TOuter[] {
        const result: TInner[] = this.innerCollection.toArray();

        return result as unknown as TOuter[];
    }
}
