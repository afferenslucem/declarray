import { ISequence } from './interfaces/i-sequence';
import { Sequence } from './sequences/sequence';
import { SequenceFactory } from './sequences/sequence-factory';
import { empty, of, range, repeat } from './operators';
import { ArraySequence } from './sequences/implementations/array-sequence';

Sequence.sequenceFactory = new SequenceFactory();

export * from './collections/dictionary';
export * from './collections/hash-set';
export * from './interfaces/i-lookup';
export * from './interfaces/i-sequence';
export * from './interfaces/i-then-by-sequence';
export * from './errors/declarray-error';
export * from './interfaces/i-grouped-data';
export * from './interfaces/i-equality-comparator';
export * from './utils/default-comparator';

const lib = function <T>(collection: ArrayLike<T>): ISequence<T> {
    const copy = Array.from(collection);
    return new ArraySequence(copy);
};

lib.of = of;
lib.empty = empty;
lib.range = range;
lib.repeat = repeat;

export default lib;
