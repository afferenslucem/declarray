import { expect } from 'chai';
import { empty, of, range, repeat } from '../../src/operators';
import { DeclarrayError } from '../../src';

describe('operators', () => {
    it('of', () => {
        const seq = of(5);

        expect(seq.count()).equal(1);
        expect(seq.toArray()).deep.equal([5]);
    });

    it('empty', () => {
        const seq = empty();

        expect(seq.count()).equal(0);
        expect(seq.toArray()).deep.equal([]);
    });

    describe('range', () => {
        it('from 1 to 5', () => {
            const seq = range(1, 5);

            expect(seq.count()).equal(5);
            expect(seq.toArray()).deep.equal([1, 2, 3, 4, 5]);
        });

        it('from 1 to 9 with step 2', () => {
            const seq = range(1, 9, 2);

            expect(seq.count()).equal(5);
            expect(seq.toArray()).deep.equal([1, 3, 5, 7, 9]);
        });

        it('should throw error for incorrect step', () => {
            expect(() => range(1, 9, 3)).throws(DeclarrayError, 'incorrect step for range');
        });
    });

    it('repeat', () => {
        const seq = repeat(3, 3);

        expect(seq.count()).equal(3);
        expect(seq.toArray()).deep.equal([3, 3, 3]);
    });
});
