import { ISequence } from '../../interfaces/i-sequence';
import { Sequence } from '../sequence';

export class DefaultSequence<T> extends Sequence<T> {
    private $default: T | T[] | ISequence<T>;

    public constructor(inner: ISequence<T>, $default: T | T[] | ISequence<T>) {
        super(inner);
        this.$default = $default;
    }

    protected materialize(): T[] {
        const array = this.innerCollection.toArray();

        if (array.length === 0) {
            return this.readDefault();
        } else {
            return array;
        }
    }

    private readDefault(): T[] {
        if (this.$default instanceof Sequence) {
            return this.$default.toArray();
        } else if (Array.isArray(this.$default)) {
            return this.$default;
        } else {
            return [this.$default as T];
        }
    }
}
