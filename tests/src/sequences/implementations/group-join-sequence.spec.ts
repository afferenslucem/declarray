import { GroupJoinSequence } from '../../../../src/sequences/implementations/group-join-sequence';
import { DefaultComparator } from '../../../../src/utils/default-comparator';
import { ICat } from '../../../models/i-cat';
import { Sequence } from '../../../../src/sequences/sequence';
import { IAge } from '../../../models/i-age';
import { IEqualityComparator } from '../../../../src/interfaces/i-equality-comparator';
import { expect } from 'chai';

describe('GroupJoinSequence', () => {
    describe('Creation', () => {
        it('should group by primitive key with group modifier', () => {
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

            const joined = new GroupJoinSequence(
                new Sequence(ages),
                new Sequence(cats),
                age => age.years,
                cat => cat.age,
                (age, cats) => ({ age: age.name, cats: cats.select(cat => cat.name).toArray() }),
                new DefaultComparator() as IEqualityComparator<number>,
            ).toArray();

            expect(joined).deep.equal([
                { age: 'Young', cats: ['Lulya'] },
                { age: 'Middle', cats: ['Cherry', 'Feya'] },
                { age: 'Old', cats: ['Barsik'] },
            ]);
        });
    });
});
