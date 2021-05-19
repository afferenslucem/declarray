import { expect } from 'chai';
import { Sequence } from '../../../../src/sequences/sequence';
import { createDefaultCompareFunction } from '../../../../src/utils/default-compare';
import { ICat } from '../../../models/i-cat';
import { OrderBySequence } from '../../../../src/sequences/implementations/order-by-sequence';

describe('OrderSequence', () => {
    describe('Creation', () => {
        it('from other seq', () => {
            const temp = new Sequence([1, 2, 3, 4]);
            const result = new OrderBySequence(temp, createDefaultCompareFunction({ isOrderDesc: true }));

            expect(result).not.equal(undefined);

            expect(result.toArray()).deep.equal([4, 3, 2, 1]);
        });
    });

    describe('Methods', () => {
        it('thenBy', () => {
            const temp = new Sequence<unknown, ICat>([
                {
                    name: 'Lilly',
                    breed: 'American Curl Cat Breed',
                    age: 11,
                },
                {
                    name: 'Ace',
                    breed: 'Balinese-Javanese Cat Breed',
                    age: 5,
                },
                {
                    name: 'John',
                    breed: 'American Bobtail Cat Breed',
                    age: 3,
                },
                {
                    name: 'Ace',
                    breed: 'American Bobtail Cat Breed',
                    age: 3,
                },
            ]);

            const orderBy = new OrderBySequence(
                temp,
                createDefaultCompareFunction({
                    propertySelector: item => item.breed,
                    isOrderDesc: true,
                }),
            );

            expect(orderBy).not.equal(undefined);
            expect(orderBy.toArray()).deep.equal([
                {
                    name: 'Ace',
                    breed: 'Balinese-Javanese Cat Breed',
                    age: 5,
                },
                {
                    name: 'Lilly',
                    breed: 'American Curl Cat Breed',
                    age: 11,
                },
                {
                    name: 'John',
                    breed: 'American Bobtail Cat Breed',
                    age: 3,
                },
                {
                    name: 'Ace',
                    breed: 'American Bobtail Cat Breed',
                    age: 3,
                },
            ]);

            const result = orderBy.thenBy(item => item.name);

            expect(result).not.equal(undefined);
            expect(result.toArray()).deep.equal([
                {
                    name: 'Ace',
                    breed: 'Balinese-Javanese Cat Breed',
                    age: 5,
                },
                {
                    name: 'Lilly',
                    breed: 'American Curl Cat Breed',
                    age: 11,
                },
                {
                    name: 'Ace',
                    breed: 'American Bobtail Cat Breed',
                    age: 3,
                },
                {
                    name: 'John',
                    breed: 'American Bobtail Cat Breed',
                    age: 3,
                },
            ]);
        });

        it('thenByDescending', () => {
            const temp = new Sequence<unknown, ICat>([
                {
                    name: 'Lilly',
                    breed: 'American Curl Cat Breed',
                    age: 11,
                },
                {
                    name: 'Ace',
                    breed: 'Balinese-Javanese Cat Breed',
                    age: 5,
                },
                {
                    name: 'Ace',
                    breed: 'American Bobtail Cat Breed',
                    age: 3,
                },
                {
                    name: 'John',
                    breed: 'American Bobtail Cat Breed',
                    age: 3,
                },
            ]);

            const orderBy = new OrderBySequence(temp, createDefaultCompareFunction({ propertySelector: item => item.age }));

            expect(orderBy).not.equal(undefined);
            expect(orderBy.toArray()).deep.equal([
                {
                    name: 'Ace',
                    breed: 'American Bobtail Cat Breed',
                    age: 3,
                },
                {
                    name: 'John',
                    breed: 'American Bobtail Cat Breed',
                    age: 3,
                },
                {
                    name: 'Ace',
                    breed: 'Balinese-Javanese Cat Breed',
                    age: 5,
                },
                {
                    name: 'Lilly',
                    breed: 'American Curl Cat Breed',
                    age: 11,
                },
            ]);

            const result = orderBy.thenByDescending(item => item.name);

            expect(result).not.equal(undefined);
            expect(result.toArray()).deep.equal([
                {
                    name: 'John',
                    breed: 'American Bobtail Cat Breed',
                    age: 3,
                },
                {
                    name: 'Ace',
                    breed: 'American Bobtail Cat Breed',
                    age: 3,
                },
                {
                    name: 'Ace',
                    breed: 'Balinese-Javanese Cat Breed',
                    age: 5,
                },
                {
                    name: 'Lilly',
                    breed: 'American Curl Cat Breed',
                    age: 11,
                },
            ]);
        });
    });
});
