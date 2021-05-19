import { Sequence } from '../../../../src/sequences/sequence';
import { expect } from 'chai';
import { ZipSequence } from '../../../../src/sequences/implementations/zip-sequence';

describe('ZipSequence', () => {
    describe('Creation', () => {
        it('should zip', () => {
            const first = new Sequence([1, 2, 3, 4]);
            const second = new Sequence([4, 3, 2, 1]);

            const zipped = new ZipSequence(first, second, (a, b) => [a, b]).toArray();

            expect(zipped).deep.equal([
                [1, 4],
                [2, 3],
                [3, 2],
                [4, 1],
            ]);
        });

        it('should zip with shorter array', () => {
            const first = new Sequence([1, 2, 3, 4]);
            const second = new Sequence([4, 3, 2]);

            const zipped = new ZipSequence(first, second, (a, b) => [a, b]).toArray();

            expect(zipped).deep.equal([
                [1, 4],
                [2, 3],
                [3, 2],
            ]);
        });

        it('should zip with longer array', () => {
            const first = new Sequence([1, 2, 3, 4]);
            const second = new Sequence([4, 3, 2, 1, 0]);

            const zipped = new ZipSequence(first, second, (a, b) => [a, b]).toArray();

            expect(zipped).deep.equal([
                [1, 4],
                [2, 3],
                [3, 2],
                [4, 1],
            ]);
        });
    });
});
