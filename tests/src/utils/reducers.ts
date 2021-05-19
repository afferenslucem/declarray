import { flatten } from '../../../src/utils/reducers';
import { expect } from 'chai';

describe('Reducers', () => {
    describe('flatten', () => {
        it('should reduce arrays', () => {
            const data = [
                [1, 2, 3],
                [4, 5, 6],
                [7, 8, 9, 0],
            ];

            const result = data.reduce(flatten, []);

            expect(result).deep.equal([1, 2, 3, 4, 5, 6, 7, 8, 9, 0]);
        });
    });
});
