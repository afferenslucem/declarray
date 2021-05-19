import { expect } from 'chai';
import { Sequence } from '../../../../src/sequences/sequence';
import { DefaultSequence } from '../../../../src/sequences/implementations/default-sequence';

describe('DefaultSequence', () => {
    describe('Creation', () => {
        it('from other seq with single element', () => {
            const temp = new Sequence([1, 2, 3, 4]);
            const result = new DefaultSequence(temp, 5);

            expect(result).not.equal(undefined);
        });

        it('from other seq with array', () => {
            const temp = new Sequence([1, 2, 3, 4]);
            const result = new DefaultSequence(temp, [5, 6, 7]);

            expect(result).not.equal(undefined);
        });

        it('from other seq with another seq', () => {
            const temp = new Sequence([1, 2, 3, 4]);
            const result = new DefaultSequence(temp, [5, 6, 7]);

            expect(result).not.equal(undefined);
        });
    });

    describe('Computing', () => {
        it('should return inner seq', () => {
            const temp = new Sequence([1, 2, 3, 4]);
            const seq = new DefaultSequence(temp, 5);

            const result = seq.toArray();

            expect(result).deep.equal([1, 2, 3, 4]);
        });

        it('should return array from default value', () => {
            const temp = new Sequence([1, 2, 3, 4]).where(item => item > 6);
            const seq = new DefaultSequence(temp, 5);

            const result = seq.toArray();

            expect(result).deep.equal([5]);
        });

        it('should return default array', () => {
            const temp = new Sequence([1, 2, 3, 4]).where(item => item > 6);
            const seq = new DefaultSequence(temp, [5, 6, 7, 8]);

            const result = seq.toArray();

            expect(result).deep.equal([5, 6, 7, 8]);
        });

        it('should return default seq', () => {
            const temp = new Sequence([1, 2, 3, 4]).where(item => item > 6);

            const $default = new Sequence([5, 6, 7, 8]);

            const seq = new DefaultSequence(temp, $default);

            const result = seq.toArray();

            expect(result).deep.equal([5, 6, 7, 8]);
        });
    });
});
