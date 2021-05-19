import { ISliceOptions } from '../../interfaces/i-slice-options';
import { ISequence } from '../../interfaces/i-sequence';
import { Sequence } from '../sequence';

export class SkipSequence<T> extends Sequence<T> {
    private options: ISliceOptions;

    public constructor(inner: ISequence<T>, options: ISliceOptions) {
        super(inner);
        this.options = options;
    }

    protected materialize(): T[] {
        const array = this.innerCollection.toArray();

        if (!this.options.sliceFromEnd) {
            return this.getSliceFromStart(array);
        } else {
            return this.getSliceFromEnd(array);
        }
    }

    private getSliceFromStart(array: T[]): T[] {
        return array.slice(this.options.sliceCount);
    }

    private getSliceFromEnd(array: T[]): T[] {
        return array.slice(0, -this.options.sliceCount);
    }
}
