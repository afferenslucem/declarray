import { expect } from 'chai';
import { createDefaultCompareFunction, defaultCompare } from '../../../src/utils/default-compare';
import { ICat } from '../../models/i-cat';
import { cats } from '../../models/fixtures';

describe('defaultCompare', () => {
    describe('defaultCompare', () => {
        describe('numbers', () => {
            it('should return -1', () => {
                const result = defaultCompare(-2, 7);

                const expected = -1;

                expect(result).equal(expected);
            });

            it('should return 0', () => {
                const result = defaultCompare(-2, -2);

                const expected = 0;

                expect(result).equal(expected);
            });
            it('should return 1', () => {
                const result = defaultCompare(7, -2);

                const expected = 1;

                expect(result).equal(expected);
            });
        });

        describe('strings', () => {
            it('should return -1', () => {
                const result = defaultCompare('aa', 'ab');

                const expected = -1;

                expect(result).equal(expected);
            });

            it('should return 0', () => {
                const result = defaultCompare('a', 'a');

                const expected = 0;

                expect(result).equal(expected);
            });
            it('should return 1', () => {
                const result = defaultCompare('ba', 'aa');

                const expected = 1;

                expect(result).equal(expected);
            });
        });
    });

    describe('createDefaultCompareFunction', () => {
        it('should return default function', () => {
            const compare = createDefaultCompareFunction();
            const result = compare(-2, 7);

            const expected = -1;

            expect(result).equal(expected);
        });

        it('should return desc function', () => {
            const compare = createDefaultCompareFunction({ isOrderDesc: true });
            const result = compare(-2, 7);

            const expected = 1;

            expect(result).equal(expected);
        });

        it('should return cat compare function', () => {
            const compare = createDefaultCompareFunction<ICat, string>({
                propertySelector: item => item.name,
            });
            const result = compare(cats[2], cats[3]);

            const expected = 1;

            expect(result).equal(expected);
        });

        it('should return cat compare function', () => {
            const compare = createDefaultCompareFunction<ICat, string>({
                propertySelector: item => item.name,
                isOrderDesc: true,
            });
            const result = compare(cats[2], cats[3]);

            const expected = -1;

            expect(result).equal(expected);
        });
    });
});
