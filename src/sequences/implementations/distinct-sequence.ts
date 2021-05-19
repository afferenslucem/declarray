import { IEqualityComparator } from '../../interfaces/i-equality-comparator';
import { ISequence } from '../../interfaces/i-sequence';
import { Sequence } from '../sequence';

export class DistinctSequence<T> extends Sequence<T> {
    private comparator: IEqualityComparator<T>;

    public constructor(inner: ISequence<T>, comparator: IEqualityComparator<T>) {
        super(inner);
        this.comparator = comparator;
    }

    protected materialize(): T[] {
        const hashSet = this.innerCollection.toHashSet(this.comparator);

        return hashSet.entries;
    }
}
