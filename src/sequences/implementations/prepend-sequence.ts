import { ISequence } from '../../interfaces/i-sequence';
import { Sequence } from '../sequence';

export class PrependSequence<T> extends Sequence<T> {
    private prependElements: T[] = null;

    public constructor(inner: ISequence<T>, appendElements: T[]) {
        super(inner);
        this.prependElements = appendElements;
    }

    public prepend(item: T): ISequence<T> {
        return new PrependSequence(this.innerCollection, [item].concat(this.prependElements));
    }

    protected materialize(): T[] {
        const array = this.innerCollection.toArray();

        return this.prependElements.concat(array);
    }
}
