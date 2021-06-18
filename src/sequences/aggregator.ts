import { ISequence } from '../interfaces/i-sequence';
import { AccumulateExpression, CompareExpression, ReduceExpression, SelectExpression, WhereCondition } from '../delegates';
import { IEqualityComparator } from '../interfaces/i-equality-comparator';
import { DefaultComparator } from '../utils/default-comparator';
import { createDefaultCompareFunction } from '../utils/default-compare';
import { DeclarrayError } from '../errors/declarray-error';

export class Aggregator {
    public static aggregate<TInner, TOuter>(
        sequence: ISequence<TInner>,
        reduceCondition: ReduceExpression<TInner> | AccumulateExpression<TInner, TOuter>,
        initialValue?: TOuter,
    ): TOuter {
        const data = sequence.toArray();

        if (initialValue != null) {
            return data.reduce(reduceCondition as any, initialValue);
        } else {
            // @ts-ignore
            return data.reduce(reduceCondition);
        }
    }

    public static all<TInner>(sequence: ISequence<TInner>, condition: WhereCondition<TInner>): boolean {
        const data = sequence.toArray();

        return data.every(condition);
    }

    public static any<TInner>(sequence: ISequence<TInner>, condition: WhereCondition<TInner>): boolean {
        const data = sequence.toArray();

        return data.some(condition);
    }

    public static average<TInner>(sequence: ISequence<TInner>, condition?: SelectExpression<TInner, number>): number {
        const data = condition ? sequence.select(condition).toArray() : (sequence.toArray() as unknown as number[]);

        const sum = data.reduce((a, b: number) => a + Number(b), 0);

        return sum / data.length;
    }

    public static contains<TInner>(sequence: ISequence<TInner>, target: TInner, comparator: IEqualityComparator<TInner>): boolean {
        const data = sequence.toArray();

        return data.findIndex(item => comparator.equals(item, target)) !== -1;
    }

    public static count<TInner>(sequence: ISequence<TInner>, whereCondition?: WhereCondition<TInner>): number {
        const data = whereCondition ? sequence.where(whereCondition).toArray() : sequence.toArray();

        return data.length;
    }

    public static elementAt<TInner>(sequence: ISequence<TInner>, index: number): TInner {
        const data = sequence.toArray();

        if (data.length <= index) {
            throw new DeclarrayError('Index out of bounds');
        }

        return data[index];
    }

    public static elementAtOrDefault<TInner>(sequence: ISequence<TInner>, index: number, $default: TInner): TInner {
        try {
            return Aggregator.elementAt(sequence, index);
        } catch (e) {
            return $default;
        }
    }

    public static first<TInner>(sequence: ISequence<TInner>, whereCondition?: WhereCondition<TInner>): TInner {
        const data = sequence.toArray();

        const result = whereCondition ? Aggregator.findFirstMatchingElement(data, whereCondition) : Aggregator.getFirstElement(data);

        if (result == null) {
            throw new DeclarrayError('Sequence is empty');
        } else {
            return result;
        }
    }

    public static firstOrDefault<TInner>(sequence: ISequence<TInner>, $default: TInner, whereCondition?: WhereCondition<TInner>): TInner {
        try {
            return Aggregator.first(sequence, whereCondition);
        } catch (e) {
            return $default;
        }
    }

    public static last<TInner>(sequence: ISequence<TInner>, whereCondition?: WhereCondition<TInner>): TInner {
        const data = sequence.toArray();

        const result = whereCondition ? Aggregator.findLastMatchingElement(data, whereCondition) : Aggregator.getLastElement(data);

        if (result == null) {
            throw new DeclarrayError('Sequence is empty');
        } else {
            return result;
        }
    }

    public static lastOrDefault<TInner>(sequence: ISequence<TInner>, $default: TInner, whereCondition?: WhereCondition<TInner>): TInner {
        try {
            return Aggregator.last(sequence, whereCondition);
        } catch (e) {
            return $default;
        }
    }

    public static max<TInner, TProperty>(
        sequence: ISequence<TInner>,
        selectPropertyExpression?: SelectExpression<TInner, TProperty>,
    ): TInner {
        const data = sequence.toArray();

        if (data.length === 0) {
            throw new DeclarrayError('Sequence is empty');
        } else {
            return this.findMaxAtArray(
                data,
                createDefaultCompareFunction({
                    propertySelector: selectPropertyExpression,
                }),
            );
        }
    }

    public static min<TInner, TProperty>(
        sequence: ISequence<TInner>,
        selectPropertyExpression?: SelectExpression<TInner, TProperty>,
    ): TInner {
        const data = sequence.toArray();

        if (data.length === 0) {
            throw new DeclarrayError('Sequence is empty');
        } else {
            return this.findMaxAtArray(
                data,
                createDefaultCompareFunction({
                    propertySelector: selectPropertyExpression,
                    isOrderDesc: true,
                }),
            );
        }
    }

    public static sequenceEqual<TInner>(
        sequence: ISequence<TInner>,
        otherSequence: ISequence<TInner>,
        comparer: IEqualityComparator<TInner>,
    ): boolean {
        const first = sequence.toArray();
        const second = otherSequence.toArray();

        if (first.length !== second.length) return false;

        return first.every((item, index) => comparer.equals(item, second[index]));
    }

    public static single<TInner>(sequence: ISequence<TInner>): TInner {
        const data = sequence.toArray();

        if (data.length > 1) {
            throw new DeclarrayError('Sequence length greater then 1');
        } else if (data.length === 0) {
            throw new DeclarrayError('Sequence is empty');
        } else {
            return data[0];
        }
    }

    public static singleOrDefault<TInner>(sequence: ISequence<TInner>, $default: TInner): TInner {
        try {
            return Aggregator.single(sequence);
        } catch (e) {
            if (e.message === 'Sequence is empty') {
                return $default;
            } else {
                throw e;
            }
        }
    }

    public static sum<TInner>(sequence: ISequence<TInner>, condition?: SelectExpression<TInner, number>): number {
        const data = condition ? sequence.select(condition).toArray() : (sequence.toArray() as unknown as number[]);

        return data.reduce((a, b: number) => a + Number(b), 0);
    }

    private static findMaxAtArray<TInner>(array: TInner[], compareCondition: CompareExpression<TInner>): TInner {
        return array.reduce((a, b) => {
            const comparing = compareCondition(a, b);

            if (comparing >= 0) {
                return a;
            } else {
                return b;
            }
        }, array[0]);
    }

    private static findFirstMatchingElement<TInner>(array: TInner[], whereCondition: WhereCondition<TInner>): TInner {
        for (let i = 0, len = array.length; i < len; i++) {
            if (whereCondition(array[i])) {
                return array[i];
            }
        }

        return null;
    }

    private static findLastMatchingElement<TInner>(array: TInner[], whereCondition: WhereCondition<TInner>): TInner {
        for (let i = array.length - 1; i >= 0; i--) {
            if (whereCondition(array[i])) {
                return array[i];
            }
        }

        return null;
    }

    private static getFirstElement<TInner>(array: TInner[]): TInner {
        if (array.length === 0) {
            return null;
        } else {
            return array[0];
        }
    }

    private static getLastElement<TInner>(array: TInner[]): TInner {
        if (array.length === 0) {
            return null;
        } else {
            return array[array.length - 1];
        }
    }
}
