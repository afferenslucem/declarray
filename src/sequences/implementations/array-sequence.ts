import { Sequence } from '../sequence';

export class ArraySequence<T> extends Sequence<T> {
    public constructor(inner: T[]) {
        super(inner);
    }

    public toArray(): T[] {
        return this._computed;
    }

    public materialize(): T[] {
        return this._computed;
    }
}
