import { ISequence } from '../../interfaces/i-sequence';
import { Sequence } from '../sequence';

export class AppendSequence<T> extends Sequence<T> {
    private appendElements: T[] = null;

    public constructor(inner: ISequence<T>, appendElements: T[]) {
        super(inner);
        this.appendElements = appendElements;
    }

    public append(item: T): ISequence<T> {
        return new AppendSequence(this.innerCollection, this.appendElements.concat(item));
    }

    protected materialize(): T[] {
        const array = this.innerCollection.toArray();

        return array.concat(this.appendElements);
    }
}
