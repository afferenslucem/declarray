import { expect } from 'chai';
import { Sequence } from '../../../../src/sequences/sequence';
import { ReverseSequence } from '../../../../src/sequences/implementations/reverse-sequence';

describe('ReverseSequence', () => {
    describe('Creation', () => {
        it('from other seq', () => {
            const temp = new Sequence([1, 2, 3, 4]);
            const result = new ReverseSequence(temp);

            expect(result).not.equal(undefined);

            expect(result.toArray()).deep.equal([4, 3, 2, 1]);
        });
    });
});
