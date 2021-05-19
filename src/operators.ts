import { ISequence } from './interfaces/i-sequence';
import { Sequence } from './sequences/sequence';
import { DeclarrayError } from './errors/declarray-error';

export function of<T>(item: T): ISequence<T> {
    return new Sequence([item]);
}

export function empty(): ISequence<unknown> {
    return new Sequence([]);
}

export function range(from: number, to: number, step = 1): ISequence<number> {
    const length = (to - from) / step + 1;

    if (length !== (length | 0)) {
        throw new DeclarrayError('incorrect step for range');
    }

    const array = new Array(length).fill(0).map((item, index) => from + index * step);

    return new Sequence(array);
}

export function repeat<T>(item: T, count: number): ISequence<T> {
    const array = new Array(count).fill(count);

    return new Sequence(array);
}
