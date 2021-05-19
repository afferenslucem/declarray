import { expect } from 'chai';
import { Sequence } from '../../../../src/sequences/sequence';
import { cats } from '../../../models/fixtures';
import { IPerson } from '../../../models/i-person';
import { SelectManySequence } from '../../../../src/sequences/implementations/select-many-sequence';

describe('SelectManySequence', () => {
    describe('Creation', () => {
        it('from other seq', () => {
            const temp = new Sequence<IPerson>([
                {
                    name: 'Alex',
                    age: 24,
                    cats: [cats[0], cats[1]],
                },
                {
                    name: 'Boris',
                    age: 33,
                    cats: [],
                },
                {
                    name: 'Leo',
                    age: 15,
                    cats: [cats[3]],
                },
            ]);
            const result = new SelectManySequence(temp, item => item.cats);

            expect(result).not.equal(undefined);

            expect(result.toArray()).deep.equal([cats[0], cats[1], cats[3]]);
        });
    });

    describe('Methods', () => {
        it('selectMany', () => {
            const temp = new Sequence<IPerson>([
                {
                    name: 'Alex',
                    age: 24,
                    cats: [cats[0], cats[1]],
                },
                {
                    name: 'Boris',
                    age: 33,
                    cats: [cats[6]],
                },
            ]);
            const result = new SelectManySequence(temp, item => item.cats).selectMany(item => item.favoriteToys || []).toArray();

            expect(result).not.equal(undefined);
            expect(result).deep.equal(['mouse', 'track ball', 'laser']);
        });
    });
});
