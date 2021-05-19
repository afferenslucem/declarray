import { ISequence } from '../../interfaces/i-sequence';
import { SelectExpression, ZipExpression } from '../../delegates';
import { IEqualityComparator } from '../../interfaces/i-equality-comparator';
import { Sequence } from '../sequence';

export class GroupJoinSequence<TInner, TOuter, TKey, TResult> extends Sequence<TInner, TResult> {
    private outer: ISequence<TOuter>;
    private innerKeySelector: SelectExpression<TInner, TKey>;
    private outerKeySelector: SelectExpression<TOuter, TKey>;
    private zipper: ZipExpression<TInner, ISequence<TOuter>, TResult>;

    private comparer: IEqualityComparator<TKey>;

    public constructor(
        inner: ISequence<TInner>,
        outer: ISequence<TOuter>,
        innerKeySelector: SelectExpression<TInner, TKey>,
        outerKeySelector: SelectExpression<TOuter, TKey>,
        zipFunction: ZipExpression<TInner, ISequence<TOuter>, TResult>,
        comparer: IEqualityComparator<TKey>,
    ) {
        super(inner);
        this.outer = outer;
        this.innerKeySelector = innerKeySelector;
        this.outerKeySelector = outerKeySelector;
        this.zipper = zipFunction;
        this.comparer = comparer;
    }

    protected materialize(): TResult[] {
        const outerLookup = this.outer.toLookup(this.outerKeySelector, this.comparer);

        const inner = this.innerCollection.toArray();

        const result = [];

        for (let i = 0, len = inner.length; i < len; i++) {
            const key = this.innerKeySelector(inner[i]);

            if (outerLookup.containsKey(key)) {
                const outers = outerLookup.get(key);

                const value = this.zipper(inner[i], new Sequence(outers));

                result.push(value);
            }
        }

        return result;
    }
}
