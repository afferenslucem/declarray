import { IEqualityComparator } from '../../interfaces/i-equality-comparator';
import { ISequence } from '../../interfaces/i-sequence';
import { Sequence } from '../sequence';
import { Materializer } from '../materializer';

export class ExceptSequence<T> extends Sequence<T> {
    private outer: ISequence<T>;
    private comparator: IEqualityComparator<T>;

    public constructor(inner: ISequence<T>, outer: ISequence<T>, comparator: IEqualityComparator<T>) {
        super(inner);
        this.outer = outer;
        this.comparator = comparator;
    }

    protected materialize(): T[] {
        const first = this.innerCollection.toArray();
        const second = this.outer.toArray();

        const temp = Materializer.createCompareDictionary(second, this.comparator, second.length);

        const result = [];

        for (let i = 0, len = first.length; i < len; i++) {
            if (!temp.containsKey(first[i])) {
                result.push(first[i]);
            }
        }

        return result;
    }
}
