import { expect } from 'chai';
import { Sequence } from '../../../../src/sequences/sequence';
import { WhereSequence } from '../../../../src/sequences/implementations/where-sequence';

describe('WhereSequence', () => {
    describe('Creation', () => {
        it('from other seq', () => {
            const temp = new Sequence([1, 2, 3, 4]);
            const result = new WhereSequence(temp, item => item % 2);

            expect(result).not.equal(undefined);

            expect(result.toArray()).deep.equal([1, 3]);
        });
    });

    describe('Methods', () => {
        it('where', () => {
            const temp = new Sequence([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]);
            const result = new WhereSequence(temp, item => !(item % 2)).where(item => !(item % 3));

            expect(result).not.equal(undefined);
            expect(result.toArray()).deep.equal([6, 12]);
        });
    });
});
