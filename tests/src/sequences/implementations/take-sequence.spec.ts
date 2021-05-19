import { expect } from 'chai';
import { Sequence } from '../../../../src/sequences/sequence';
import { TakeSequence } from '../../../../src/sequences/implementations/take-sequence';

describe('TakeSequence', () => {
    describe('Creation', () => {
        it('from other seq', () => {
            const temp = new Sequence([1, 2, 3, 4, 5, 6, 7]);
            const result = new TakeSequence(temp, { sliceCount: 4 });

            expect(result).not.equal(undefined);

            expect(result.toArray()).deep.equal([1, 2, 3, 4]);
        });
    });

    describe('Taking', () => {
        it('from start', () => {
            const temp = new Sequence([1, 2, 3, 4, 5, 6, 7]);

            const result = new TakeSequence(temp, { sliceCount: 4 });

            expect(result.toArray()).deep.equal([1, 2, 3, 4]);
        });

        it('from start overflow', () => {
            const temp = new Sequence([1, 2, 3, 4, 5, 6, 7]);

            const result = new TakeSequence(temp, { sliceCount: 12 });

            expect(result.toArray()).deep.equal([1, 2, 3, 4, 5, 6, 7]);
        });

        it('from end', () => {
            const temp = new Sequence([1, 2, 3, 4, 5, 6, 7]);

            const result = new TakeSequence(temp, {
                sliceCount: 4,
                sliceFromEnd: true,
            });

            expect(result.toArray()).deep.equal([4, 5, 6, 7]);
        });

        it('from end overflow', () => {
            const temp = new Sequence([1, 2, 3, 4, 5, 6, 7]);

            const result = new TakeSequence(temp, {
                sliceCount: 12,
                sliceFromEnd: true,
            });

            expect(result.toArray()).deep.equal([1, 2, 3, 4, 5, 6, 7]);
        });
    });
});
