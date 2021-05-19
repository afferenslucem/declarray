import { expect } from 'chai';
import { Sequence } from '../../../../src/sequences/sequence';
import { SkipSequence } from '../../../../src/sequences/implementations/skip-sequence';

describe('SkipSequence', () => {
    describe('Creation', () => {
        it('from other seq', () => {
            const temp = new Sequence([1, 2, 3, 4, 5, 6, 7]);
            const result = new SkipSequence(temp, { sliceCount: 4 });

            expect(result).not.equal(undefined);

            expect(result.toArray()).deep.equal([5, 6, 7]);
        });
    });

    describe('Skipping', () => {
        it('from start', () => {
            const temp = new Sequence([1, 2, 3, 4, 5, 6, 7]);

            const result = new SkipSequence(temp, { sliceCount: 4 });

            expect(result.toArray()).deep.equal([5, 6, 7]);
        });

        it('from start overflow', () => {
            const temp = new Sequence([1, 2, 3, 4, 5, 6, 7]);

            const result = new SkipSequence(temp, { sliceCount: 12 });

            expect(result.toArray()).deep.equal([]);
        });

        it('from end', () => {
            const temp = new Sequence([1, 2, 3, 4, 5, 6, 7]);

            const result = new SkipSequence(temp, {
                sliceCount: 4,
                sliceFromEnd: true,
            });

            expect(result.toArray()).deep.equal([1, 2, 3]);
        });

        it('from end overflow', () => {
            const temp = new Sequence([1, 2, 3, 4, 5, 6, 7]);

            const result = new SkipSequence(temp, {
                sliceCount: 12,
                sliceFromEnd: true,
            });

            expect(result.toArray()).deep.equal([]);
        });
    });
});
