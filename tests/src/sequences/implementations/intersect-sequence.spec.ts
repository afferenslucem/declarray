import { expect } from 'chai';
import { Sequence } from '../../../../src/sequences/sequence';
import { DefaultComparator } from '../../../../src/utils/default-comparator';
import { ICat } from '../../../models/i-cat';
import { CatComparator } from '../../../utils/cat-comparator';
import { IntersectSequence } from '../../../../src/sequences/implementations/intersect-sequence';

describe('IntersectSequence', () => {
    describe('Creation', () => {
        it('from other seq', () => {
            const temp = new Sequence<number>([1, 2, 3, 4]);
            const result = new IntersectSequence(temp, new Sequence([3, 4, 5]), new DefaultComparator());

            expect(result).not.equal(undefined);
            expect(result.toArray()).deep.equal([3, 4]);
        });

        it('should use comparator', () => {
            const first: ICat[] = [
                {
                    name: 'Bella',
                    age: 2,
                },
                {
                    name: 'Kitty',
                    age: 5,
                },
                {
                    name: 'Lilly',
                    age: 11,
                },
                {
                    name: 'Charlie',
                    age: 10,
                },
            ];
            const second: ICat[] = [
                {
                    name: 'Lilly',
                    age: 11,
                },
                {
                    name: 'Charlie',
                    age: 10,
                },
                {
                    name: 'Kitty',
                    age: 10,
                },
            ];

            const temp = new Sequence(first);
            const result = new IntersectSequence(temp, new Sequence(second), new CatComparator());

            expect(result).not.equal(undefined);
            expect(result.toArray()).deep.equal([
                {
                    name: 'Lilly',
                    age: 11,
                },
                {
                    name: 'Charlie',
                    age: 10,
                },
            ]);
        });
    });
});
