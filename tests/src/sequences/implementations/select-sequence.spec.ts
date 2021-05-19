import { expect } from 'chai';
import { Sequence } from '../../../../src/sequences/sequence';
import { SelectSequence } from '../../../../src/sequences/implementations/select-sequence';

describe('SelectSequence', () => {
    describe('Creation', () => {
        it('from other seq', () => {
            const temp = new Sequence([1, 2, 3, 4]);
            const result = new SelectSequence(temp, item => item * item);

            expect(result).not.equal(undefined);

            expect(result.toArray()).deep.equal([1, 4, 9, 16]);
        });
    });

    describe('Methods', () => {
        it('select', () => {
            const temp = new Sequence([1, 2, 3, 4]);
            const result = new SelectSequence(temp, item => item * item).select(item => item * 2);

            expect(result).not.equal(undefined);
            expect(result.toArray()).deep.equal([2, 8, 18, 32]);
        });
    });
});
