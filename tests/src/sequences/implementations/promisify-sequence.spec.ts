import { expect } from 'chai';
import { Sequence } from '../../../../src/sequences/sequence';
import { PromisifySequence } from '../../../../src/sequences/implementations/promisify-sequence';

describe('PromisifySequence', () => {
    describe('Creation', () => {
        it('from other seq', () => {
            const temp = new Sequence([1, 2, 3, 4]);
            const result = new PromisifySequence(temp);

            expect(result).not.equal(undefined);
        });
    });

    describe('Methods', () => {
        it('toArray', async () => {
            const temp = new Sequence([1, 2, 3, 4]);
            const result = await new PromisifySequence(temp).toArray();

            expect(result).deep.equal([1, 2, 3, 4]);
        });
    });
});
