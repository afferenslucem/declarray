import { expect } from 'chai';
import { HashSet } from '../../dist';
import { IPerson } from '../models/i-person';
import { IEqualityComparator } from '../../src/interfaces/i-equality-comparator';
import { DefaultComparator } from '../../src/utils/default-comparator';

describe('HashSet', () => {
    describe('Creation', () => {
        it('with default comparator', () => {
            const result = new HashSet<string>();

            expect(result).not.equal(undefined);
            expect(result.length).equal(0);
        });
    });

    describe('With primitives', () => {
        let set: HashSet<string> = null;

        beforeEach(() => {
            set = new HashSet<string>();
        });

        it('add', () => {
            set.add('one');
            set.add('two');
            set.add('two');

            expect(set.length).equal(2);

            const containsOne = set.contains('one');
            const containsTwo = set.contains('two');

            expect(containsOne).equal(true);
            expect(containsTwo).equal(true);
        });

        it('remove', () => {
            set.add('one');
            set.add('two');

            set.remove('one');
            set.remove('two');

            const containsOne = set.contains('one');
            const containsTwo = set.contains('two');

            expect(containsOne).equal(false);
            expect(containsTwo).equal(false);

            expect(set.length).equal(0);
        });

        it('entries', () => {
            set.add('one');
            set.add('two');

            expect(set.entries).deep.equal(['one', 'two']);
        });
    });

    describe('With objects', () => {
        let set: HashSet<IPerson> = null;

        class PersonComparator implements IEqualityComparator<IPerson> {
            compare(first: IPerson, second: IPerson): number {
                return new DefaultComparator().compare(first.name, second.name);
            }

            equals(first: IPerson, second: IPerson): boolean {
                return first.name === second.name && first.age === second.age;
            }

            getHashCode(entity: IPerson): number {
                return new DefaultComparator().getHashCode(entity.name);
            }
        }

        beforeEach(() => {
            set = new HashSet<IPerson>(new PersonComparator());
        });

        it('add', () => {
            set.add({
                name: 'Alex',
                age: 24,
            });
            set.add({
                name: 'Boris',
                age: 33,
            });
            set.add({
                name: 'Boris',
                age: 33,
            });

            expect(set.length).equal(2);

            const containsAlex = set.contains({
                name: 'Alex',
                age: 24,
            });
            const containsBoris = set.contains({
                name: 'Boris',
                age: 33,
            });

            expect(containsAlex).equal(true);
            expect(containsBoris).equal(true);
        });

        it('remove', () => {
            set.add({
                name: 'Alex',
                age: 24,
            });
            set.add({
                name: 'Boris',
                age: 33,
            });

            set.remove({
                name: 'Alex',
                age: 24,
            });
            set.remove({
                name: 'Boris',
                age: 33,
            });

            const containsAlex = set.contains({
                name: 'Alex',
                age: 24,
            });
            const containsBoris = set.contains({
                name: 'Boris',
                age: 33,
            });

            expect(containsAlex).equal(false);
            expect(containsBoris).equal(false);

            expect(set.length).equal(0);
        });

        it('entries', () => {
            set.add({
                name: 'Alex',
                age: 24,
            });
            set.add({
                name: 'Boris',
                age: 33,
            });

            expect(set.entries).deep.equal([
                {
                    name: 'Alex',
                    age: 24,
                },
                {
                    name: 'Boris',
                    age: 33,
                },
            ]);
        });
    });
});
