import { expect } from 'chai';
import { Sequence } from '../../../../src/sequences/sequence';
import { PrependSequence } from '../../../../src/sequences/implementations/prepend-sequence';

describe('PrependSequence', () => {
    describe('Creation', () => {
        it('from other seq', () => {
            const temp = new Sequence([1, 2, 3, 4]);
            const result = new PrependSequence(temp, [0]);

            expect(result).not.equal(undefined);

            expect(result.toArray()).deep.equal([0, 1, 2, 3, 4]);
        });
    });

    describe('Methods', () => {
        it('prepend', () => {
            const temp = new Sequence([1, 2, 3, 4]);
            const temp2 = new PrependSequence(temp, [0]);

            const result = temp2.prepend(-1);

            expect(result.toArray()).deep.equal([-1, 0, 1, 2, 3, 4]);
        });
    });
});
