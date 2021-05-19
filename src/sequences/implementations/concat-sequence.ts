import { ISequence } from '../../interfaces/i-sequence';
import { Sequence } from '../sequence';

export class ConcatSequence<T> extends Sequence<T> {
    private additional: ISequence<T>;

    public constructor(inner: ISequence<T>, additional: ISequence<T>) {
        super(inner);
        this.additional = additional;
    }

    protected materialize(): T[] {
        const first = this.innerCollection.toArray();
        const second = this.additional.toArray();

        return first.concat(second);
    }
}
