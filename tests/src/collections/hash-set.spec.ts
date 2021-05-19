import { expect } from 'chai';
import { HashSet } from '../../../src/collections/hash-set';
import { ICat } from '../../models/i-cat';
import { CatComparator } from '../../utils/cat-comparator';
import { cats } from '../../models/fixtures';

describe('HashSet', () => {
    describe('With primitives', () => {
        let set: HashSet<string> = null;

        beforeEach(() => {
            set = new HashSet<string>();
        });

        describe('Access methods', () => {
            it('add/contains', () => {
                set.add('entity1');

                expect(set.contains('entity1')).equal(true);
            });

            it('add/remove/contains', () => {
                set.add('entity1');
                set.remove('entity1');

                expect(set.contains('entity1')).equal(false);
            });

            it('add/clear/contains', () => {
                set.add('entity1');
                set.add('entity2');

                set.clear();

                expect(set.contains('entity1')).equal(false);
                expect(set.contains('entity2')).equal(false);
            });
        });

        describe('properties', () => {
            it('entries', () => {
                set.add('entity1');
                set.add('entity1');
                set.add('entity2');

                const result = set.entries;

                expect(result).deep.equal(['entity2', 'entity1']);
            });

            it('length', () => {
                set.add('entity1');
                set.add('entity1');
                set.add('entity2');

                expect(set.length).equal(2);
            });
        });
    });

    describe('With objects', () => {
        let set: HashSet<ICat> = null;

        beforeEach(() => {
            set = new HashSet<ICat>(new CatComparator());
        });

        describe('Access methods', () => {
            it('add/contains', () => {
                set.add(cats[0]);

                expect(
                    set.contains({
                        name: 'Bella',
                        breed: 'Abyssinian Cat',
                        age: 2,
                    }),
                ).equal(true);
            });

            it('add/remove/contains', () => {
                set.add(cats[0]);
                set.remove({
                    name: 'Bella',
                    breed: 'Abyssinian Cat',
                    age: 2,
                });

                expect(set.contains(cats[0])).equal(false);
            });

            it('add/clear/contains', () => {
                set.add(cats[0]);
                set.add(cats[0]);

                set.clear();

                expect(set.contains(cats[0])).equal(false);
                expect(set.contains(cats[0])).equal(false);
            });
        });

        describe('properties', () => {
            it('entries', () => {
                set.add(cats[0]);
                set.add(cats[2]);

                const result = set.entries;

                expect(result).deep.equal([
                    {
                        name: 'Lilly',
                        breed: 'American Curl Cat Breed',
                        age: 11,
                    },
                    cats[0],
                ]);
            });

            it('length', () => {
                set.add(cats[0]);
                set.add(cats[2]);

                expect(set.length).equal(2);
            });
        });
    });
});
