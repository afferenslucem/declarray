import { expect } from 'chai';
import { Sequence } from '../../../../src/sequences/sequence';
import { ConcatSequence } from '../../../../src/sequences/implementations/concat-sequence';

describe('ConcatSequence', () => {
    describe('Creation', () => {
        it('from other seq with array', () => {
            const temp = new Sequence<number>([1, 2, 3, 4]);
            const result = new ConcatSequence(temp, new Sequence([5, 6, 7]));

            expect(result).not.equal(undefined);
            expect(result.toArray()).deep.equal([1, 2, 3, 4, 5, 6, 7]);
        });
    });
});
