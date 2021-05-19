import { DefaultComparator } from '../../../src/utils/default-comparator';
import { expect } from 'chai';

describe('DefaultComparator', () => {
    let comparator: DefaultComparator = null;

    beforeEach(() => {
        comparator = new DefaultComparator();
    });

    describe('compare', () => {
        describe('numbers', () => {
            it('should return -1', () => {
                const result = comparator.compare(-2, 7);

                const expected = -1;

                expect(result).equal(expected);
            });

            it('should return 0', () => {
                const result = comparator.compare(-2, -2);

                const expected = 0;

                expect(result).equal(expected);
            });
            it('should return 1', () => {
                const result = comparator.compare(7, -2);

                const expected = 1;

                expect(result).equal(expected);
            });
        });

        describe('strings', () => {
            it('should return -1', () => {
                const result = comparator.compare('aa', 'ab');

                const expected = -1;

                expect(result).equal(expected);
            });

            it('should return 0', () => {
                const result = comparator.compare('a', 'a');

                const expected = 0;

                expect(result).equal(expected);
            });
            it('should return 1', () => {
                const result = comparator.compare('ba', 'aa');

                const expected = 1;

                expect(result).equal(expected);
            });
        });
    });
});
