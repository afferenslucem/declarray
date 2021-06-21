import { expect } from 'chai';
import sinon from 'sinon';
import { IEqualityComparator } from '../../../src/interfaces/i-equality-comparator';
import { ICat } from '../../models/i-cat';
import { IPerson } from '../../models/i-person';
import { CatComparator } from '../../utils/cat-comparator';
import { cats, persons } from '../../models/fixtures';
import { Dictionary } from '../../../src';

describe('Dictionary', () => {
    describe('With primitives', () => {
        let dictionary: Dictionary<string, number> = null;

        beforeEach(() => {
            dictionary = new Dictionary<string, number>();
        });

        describe('Access methods', () => {
            it('set/get', () => {
                dictionary.set('key', 777);

                const value = dictionary.get('key');

                const expected = 777;

                expect(value).equal(expected);
            });

            it('setIfKeyNotExists/get', () => {
                dictionary.setIfKeyNotExists('key', 777);

                const value = dictionary.get('key');

                const expected = 777;

                expect(value).equal(expected);
            });

            it('set/update', () => {
                dictionary.set('key', 777);
                dictionary.set('key', 888);

                const value = dictionary.get('key');

                const expected = 888;

                expect(value).equal(expected);
            });

            it('set/update', () => {
                dictionary.set('key', 777);
                dictionary.setIfKeyNotExists('key', 888);

                const value = dictionary.get('key');

                const expected = 777;

                expect(value).equal(expected);
            });

            it('set/remove', () => {
                dictionary.set('key', 777);
                dictionary.remove('key');

                const value = dictionary.get('key');

                const expected = undefined;

                expect(value).equal(expected);
            });

            it('set/contains', () => {
                dictionary.set('key', 777);

                const value = dictionary.containsKey('key');

                const expected = true;

                expect(value).equal(expected);
            });

            it('set/clear', () => {
                dictionary.set('key', 777);
                dictionary.set('key2', 888);
                dictionary.set('key3', 999);

                expect(dictionary.length).equal(3);

                dictionary.clear();

                expect(dictionary.length).equal(0);
            });
        });

        describe('properties', () => {
            it('keys', () => {
                dictionary.set('key', 555);
                dictionary.set('key', 777);
                dictionary.set('key2', 888);
                dictionary.set('key3', 999);

                const result = dictionary.keys;

                expect(result).deep.equal(['key', 'key2', 'key3']);
            });

            it('values', () => {
                dictionary.set('key', 555);
                dictionary.set('key', 777);
                dictionary.set('key2', 888);
                dictionary.set('key3', 999);

                const result = dictionary.values;

                expect(result).deep.equal([777, 888, 999]);
            });

            it('entries', () => {
                dictionary.set('key', 555);
                dictionary.set('key', 777);
                dictionary.set('key2', 888);
                dictionary.set('key3', 999);

                const result = dictionary.entries;

                expect(result).deep.equal([
                    ['key', 777],
                    ['key2', 888],
                    ['key3', 999],
                ]);
            });

            it('length', () => {
                dictionary.set('key', 555);
                dictionary.set('key', 777);
                dictionary.set('key2', 888);
                dictionary.set('key3', 999);

                const result = dictionary.length;

                expect(result).equal(3);
            });
        });
    });

    describe('With objects', () => {
        let dictionary: Dictionary<ICat, IPerson> = null;
        const comparer: IEqualityComparator<ICat> = new CatComparator();

        beforeEach(() => {
            dictionary = new Dictionary<ICat, IPerson>(comparer);
        });

        describe('Access methods', () => {
            it('set/get', () => {
                dictionary.set(cats[1], persons[3]);

                const value = dictionary.get({
                    name: 'Kitty',
                    breed: 'American Bobtail Cat Breed',
                    age: 5,
                });

                const expected = {
                    name: 'Emy',
                    age: 19,
                };

                expect(value).deep.equal(expected);
            });

            it('set/update', () => {
                dictionary.set(cats[1], persons[3]);
                dictionary.set(cats[1], persons[2]);

                const value = dictionary.get({
                    name: 'Kitty',
                    breed: 'American Bobtail Cat Breed',
                    age: 5,
                });

                const expected = {
                    name: 'Lola',
                    age: 32,
                };

                expect(value).deep.equal(expected);
            });

            it('set/remove', () => {
                dictionary.set(cats[1], persons[3]);

                const key = {
                    name: 'Kitty',
                    breed: 'American Bobtail Cat Breed',
                    age: 5,
                };

                dictionary.remove(key);
                const value = dictionary.get(key);

                const expected = undefined;

                expect(value).equal(expected);
            });

            it('set/contains', () => {
                dictionary.set(cats[1], persons[3]);

                const value = dictionary.containsKey({
                    name: 'Kitty',
                    breed: 'American Bobtail Cat Breed',
                    age: 5,
                });

                const expected = true;

                expect(value).equal(expected);
            });
        });

        describe('properties', () => {
            it('keys', () => {
                dictionary.set(cats[0], persons[1]);
                dictionary.set(cats[0], persons[2]);
                dictionary.set(cats[1], persons[2]);
                dictionary.set(cats[2], persons[3]);

                const result = dictionary.keys;

                expect(result).deep.equal([cats[0], cats[1], cats[2]]);
            });

            it('values', () => {
                dictionary.set(cats[0], persons[1]);
                dictionary.set(cats[0], persons[2]);
                dictionary.set(cats[1], persons[2]);
                dictionary.set(cats[2], persons[3]);

                const result = dictionary.values;

                expect(result).deep.equal([persons[2], persons[2], persons[3]]);
            });

            it('entries', () => {
                dictionary.set(cats[0], persons[1]);
                dictionary.set(cats[0], persons[2]);
                dictionary.set(cats[1], persons[2]);
                dictionary.set(cats[2], persons[3]);

                const result = dictionary.entries;

                expect(result).deep.equal([
                    [cats[0], persons[2]],
                    [cats[1], persons[2]],
                    [cats[2], persons[3]],
                ]);
            });

            it('length', () => {
                dictionary.set(cats[0], persons[1]);
                dictionary.set(cats[0], persons[2]);
                dictionary.set(cats[1], persons[2]);
                dictionary.set(cats[2], persons[3]);

                const result = dictionary.length;

                expect(result).equal(3);
            });
        });
    });
});
