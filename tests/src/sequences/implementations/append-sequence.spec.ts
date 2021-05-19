import { expect } from 'chai';
import { Sequence } from '../../../../src/sequences/sequence';
import { AppendSequence } from '../../../../src/sequences/implementations/append-sequence';

describe('AppendSequence', () => {
    describe('Creation', () => {
        it('from other seq', () => {
            const temp = new Sequence([1, 2, 3, 4]);
            const result = new AppendSequence(temp, [5]);

            expect(result).not.equal(undefined);

            expect(result.toArray()).deep.equal([1, 2, 3, 4, 5]);
        });
    });

    describe('Methods', () => {
        it('append', () => {
            const temp = new Sequence([1, 2, 3, 4]);
            const temp2 = new AppendSequence(temp, [5]);

            const result = temp2.append(6);

            expect(result).not.equal(undefined);

            expect(result.toArray()).deep.equal([1, 2, 3, 4, 5, 6]);
        });
    });
});
