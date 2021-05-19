import { IEqualityComparator } from '../../interfaces/i-equality-comparator';
import { ISequence } from '../../interfaces/i-sequence';
import { Sequence } from '../sequence';

export class UnionSequence<T> extends Sequence<T> {
    private outer: ISequence<T>;
    private comparator: IEqualityComparator<T>;

    public constructor(inner: ISequence<T>, outer: ISequence<T>, comparator: IEqualityComparator<T>) {
        super(inner);
        this.outer = outer;
        this.comparator = comparator;
    }

    protected materialize(): T[] {
        const temp = this.innerCollection.concat(this.outer);

        const set = temp.toHashSet(this.comparator);

        const result = set.entries;

        return result;
    }
}
