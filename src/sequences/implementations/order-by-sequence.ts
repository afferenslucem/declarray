import { IThenBySequence } from '../../interfaces/i-then-by-sequence';
import { CompareExpression, SelectExpression } from '../../delegates';
import { ISequence } from '../../interfaces/i-sequence';
import { defaultCompare } from '../../utils/default-compare';
import { Sequence } from '../sequence';

export class OrderBySequence<T> extends Sequence<T> implements IThenBySequence<T> {
    private compareCondition: CompareExpression<T>;

    public constructor(inner: ISequence<T>, compareCondition: CompareExpression<T>) {
        super(inner);
        this.compareCondition = compareCondition;
    }

    private static wrapCompareFunc<TInner, TOuter>(
        selectCondition: SelectExpression<TInner, TOuter>,
        innerCompare: CompareExpression<TInner>,
        wrapperCompare: CompareExpression<TOuter> = defaultCompare,
        descWrapperOrder = false,
    ): CompareExpression<TInner> {
        return (a, b) => {
            const innerResult = innerCompare(a, b);

            if (innerResult !== 0) {
                return innerResult;
            } else {
                const first = selectCondition(a);
                const second = selectCondition(b);

                const result = wrapperCompare(first, second);

                return descWrapperOrder ? -result : result;
            }
        };
    }

    thenBy<TOuter>(compareSelectCondition: SelectExpression<T, TOuter>): IThenBySequence<T> {
        return new OrderBySequence(this.innerCollection, OrderBySequence.wrapCompareFunc(compareSelectCondition, this.compareCondition));
    }

    thenByDescending<TOuter>(compareSelectCondition: SelectExpression<T, TOuter>): IThenBySequence<T> {
        return new OrderBySequence(
            this.innerCollection,
            OrderBySequence.wrapCompareFunc(compareSelectCondition, this.compareCondition, undefined, true),
        );
    }

    protected materialize(): T[] {
        const array = this.innerCollection.toArray();

        const copy = Array.from(array);

        const sorted = copy.sort(this.compareCondition);

        return sorted;
    }
}
