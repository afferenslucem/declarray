import { expect } from 'chai';
import { Dictionary } from '../../dist';
import { IPerson } from '../models/i-person';
import { ICat } from '../models/i-cat';
import { IEqualityComparator } from '../../src/interfaces/i-equality-comparator';
import { DefaultComparator } from '../../src/utils/default-comparator';

describe('Dictionary', () => {
    describe('Creation', () => {
        it('with default comparator', () => {
            const result = new Dictionary<string, number>();

            expect(result).not.equal(undefined);
            expect(result.length).equal(0);
        });
    });

    describe('With primitives', () => {
        let dictionary: Dictionary<string, number> = null;

        beforeEach(() => {
            dictionary = new Dictionary<string, number>();
        });

        it('set like insert', () => {
            dictionary.set('one', 1);
            dictionary.set('two', 2);

            expect(dictionary.length).equal(2);

            const one = dictionary.get('one');
            const two = dictionary.get('two');

            expect(one).equal(1);
            expect(two).equal(2);
        });

        it('set like update', () => {
            dictionary.set('one', 1);
            dictionary.set('one', 2);

            expect(dictionary.length).equal(1);

            const one = dictionary.get('one');

            expect(one).equal(2);
        });

        it('remove', () => {
            dictionary.set('one', 1);
            expect(dictionary.length).equal(1);

            let containsOne = dictionary.containsKey('one');
            expect(containsOne).equal(true);

            dictionary.remove('one');
            expect(dictionary.length).equal(0);

            containsOne = dictionary.containsKey('one');
            expect(containsOne).equal(false);
        });

        it('values', () => {
            dictionary.set('one', 1);
            dictionary.set('two', 2);

            expect(dictionary.values).deep.equal([2, 1]);
        });

        it('keys', () => {
            dictionary.set('one', 1);
            dictionary.set('two', 2);

            expect(dictionary.keys).deep.equal(['two', 'one']);
        });

        it('entries', () => {
            dictionary.set('one', 1);
            dictionary.set('two', 2);

            expect(dictionary.entries).deep.equal([
                ['two', 2],
                ['one', 1],
            ]);
        });
    });

    describe('With objects', () => {
        let dictionary: Dictionary<IPerson, ICat> = null;

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
            dictionary = new Dictionary<IPerson, ICat>(new PersonComparator());
        });

        it('set like insert', () => {
            dictionary.set(
                {
                    name: 'Boris',
                    age: 33,
                },
                {
                    name: 'Bella',
                    breed: 'Abyssinian Cat',
                    age: 2,
                },
            );
            dictionary.set(
                {
                    name: 'Alex',
                    age: 24,
                },
                {
                    name: 'Lilly',
                    breed: 'American Curl Cat Breed',
                    age: 11,
                },
            );

            expect(dictionary.length).equal(2);

            const bella = dictionary.get({
                name: 'Boris',
                age: 33,
            });

            const lilly = dictionary.get({
                name: 'Alex',
                age: 24,
            });

            expect(bella).deep.equal({
                name: 'Bella',
                breed: 'Abyssinian Cat',
                age: 2,
            });
            expect(lilly).deep.equal({
                name: 'Lilly',
                breed: 'American Curl Cat Breed',
                age: 11,
            });
        });

        it('set like update', () => {
            dictionary.set(
                {
                    name: 'Boris',
                    age: 33,
                },
                {
                    name: 'Bella',
                    breed: 'Abyssinian Cat',
                    age: 2,
                },
            );
            dictionary.set(
                {
                    name: 'Boris',
                    age: 33,
                },
                {
                    name: 'Lilly',
                    breed: 'American Curl Cat Breed',
                    age: 11,
                },
            );

            expect(dictionary.length).equal(1);

            const lilly = dictionary.get({
                name: 'Boris',
                age: 33,
            });

            expect(lilly).deep.equal({
                name: 'Lilly',
                breed: 'American Curl Cat Breed',
                age: 11,
            });
        });

        it('remove', () => {
            dictionary.set(
                {
                    name: 'Boris',
                    age: 33,
                },
                {
                    name: 'Lilly',
                    breed: 'American Curl Cat Breed',
                    age: 11,
                },
            );
            expect(dictionary.length).equal(1);

            let containsBoris = dictionary.containsKey({
                name: 'Boris',
                age: 33,
            });
            expect(containsBoris).equal(true);

            dictionary.remove({
                name: 'Boris',
                age: 33,
            });
            expect(dictionary.length).equal(0);

            containsBoris = dictionary.containsKey({
                name: 'Boris',
                age: 33,
            });
            expect(containsBoris).equal(false);
        });

        it('values', () => {
            dictionary.set(
                {
                    name: 'Boris',
                    age: 33,
                },
                {
                    name: 'Bella',
                    breed: 'Abyssinian Cat',
                    age: 2,
                },
            );
            dictionary.set(
                {
                    name: 'Alex',
                    age: 24,
                },
                {
                    name: 'Lilly',
                    breed: 'American Curl Cat Breed',
                    age: 11,
                },
            );

            expect(dictionary.values).deep.equal([
                {
                    name: 'Bella',
                    breed: 'Abyssinian Cat',
                    age: 2,
                },
                {
                    name: 'Lilly',
                    breed: 'American Curl Cat Breed',
                    age: 11,
                },
            ]);
        });

        it('keys', () => {
            dictionary.set(
                {
                    name: 'Boris',
                    age: 33,
                },
                {
                    name: 'Bella',
                    breed: 'Abyssinian Cat',
                    age: 2,
                },
            );
            dictionary.set(
                {
                    name: 'Alex',
                    age: 24,
                },
                {
                    name: 'Lilly',
                    breed: 'American Curl Cat Breed',
                    age: 11,
                },
            );

            expect(dictionary.keys).deep.equal([
                {
                    name: 'Boris',
                    age: 33,
                },
                {
                    name: 'Alex',
                    age: 24,
                },
            ]);
        });

        it('entries', () => {
            dictionary.set(
                {
                    name: 'Boris',
                    age: 33,
                },
                {
                    name: 'Bella',
                    breed: 'Abyssinian Cat',
                    age: 2,
                },
            );
            dictionary.set(
                {
                    name: 'Alex',
                    age: 24,
                },
                {
                    name: 'Lilly',
                    breed: 'American Curl Cat Breed',
                    age: 11,
                },
            );

            expect(dictionary.entries).deep.equal([
                [
                    {
                        name: 'Boris',
                        age: 33,
                    },
                    {
                        name: 'Bella',
                        breed: 'Abyssinian Cat',
                        age: 2,
                    },
                ],
                [
                    {
                        name: 'Alex',
                        age: 24,
                    },
                    {
                        name: 'Lilly',
                        breed: 'American Curl Cat Breed',
                        age: 11,
                    },
                ],
            ]);
        });
    });
});
