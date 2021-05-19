import { ISequence } from '../../interfaces/i-sequence';
import { Sequence } from '../sequence';

export class ReverseSequence<T> extends Sequence<T> {
    public constructor(inner: ISequence<T>) {
        super(inner);
    }

    protected materialize(): T[] {
        const array = this.innerCollection.toArray();

        const copy = Array.from(array);

        return copy.reverse();
    }
}
