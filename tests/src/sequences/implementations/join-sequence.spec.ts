import { DefaultComparator } from '../../../../src/utils/default-comparator';
import { ICat } from '../../../models/i-cat';
import { Sequence } from '../../../../src/sequences/sequence';
import { IAge } from '../../../models/i-age';
import { IEqualityComparator } from '../../../../src/interfaces/i-equality-comparator';
import { expect } from 'chai';
import { JoinSequence } from '../../../../src/sequences/implementations/join-sequence';

describe('JoinSequence', () => {
    describe('Creation', () => {
        it('should join by primitive key', () => {
            const cats: ICat[] = [
                {
                    name: 'Barsik',
                    age: 9,
                },
                {
                    name: 'Cherry',
                    age: 4,
                },
                {
                    name: 'Feya',
                    age: 4,
                },
                {
                    name: 'Lulya',
                    age: 1,
                },
            ];

            const ages: IAge[] = [
                {
                    years: 1,
                    name: 'Young',
                },
                {
                    years: 4,
                    name: 'Middle',
                },
                {
                    years: 9,
                    name: 'Old',
                },
            ];

            const joined = new JoinSequence(
                new Sequence(cats),
                new Sequence(ages),
                cat => cat.age,
                age => age.years,
                (cat, age) => ({ name: cat.name, age: age.name }),
                new DefaultComparator() as IEqualityComparator<number>,
            ).toArray();

            expect(joined).deep.equal([
                { name: 'Barsik', age: 'Old' },
                { name: 'Cherry', age: 'Middle' },
                { name: 'Feya', age: 'Middle' },
                { name: 'Lulya', age: 'Young' },
            ]);
        });
    });
});
