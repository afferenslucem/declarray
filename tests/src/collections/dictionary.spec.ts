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

            it('set/update', () => {
                dictionary.set('key', 777);
                dictionary.set('key', 888);

                const value = dictionary.get('key');

                const expected = 888;

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

                expect(result).deep.equal(['key3', 'key', 'key2']);
            });

            it('values', () => {
                dictionary.set('key', 555);
                dictionary.set('key', 777);
                dictionary.set('key2', 888);
                dictionary.set('key3', 999);

                const result = dictionary.values;

                expect(result).deep.equal([999, 777, 888]);
            });

            it('entries', () => {
                dictionary.set('key', 555);
                dictionary.set('key', 777);
                dictionary.set('key2', 888);
                dictionary.set('key3', 999);

                const result = dictionary.entries;

                expect(result).deep.equal([
                    ['key3', 999],
                    ['key', 777],
                    ['key2', 888],
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

                expect(result).deep.equal([cats[2], cats[0], cats[1]]);
            });

            it('values', () => {
                dictionary.set(cats[0], persons[1]);
                dictionary.set(cats[0], persons[2]);
                dictionary.set(cats[1], persons[2]);
                dictionary.set(cats[2], persons[3]);

                const result = dictionary.values;

                expect(result).deep.equal([persons[3], persons[2], persons[2]]);
            });

            it('entries', () => {
                dictionary.set(cats[0], persons[1]);
                dictionary.set(cats[0], persons[2]);
                dictionary.set(cats[1], persons[2]);
                dictionary.set(cats[2], persons[3]);

                const result = dictionary.entries;

                expect(result).deep.equal([
                    [cats[2], persons[3]],
                    [cats[0], persons[2]],
                    [cats[1], persons[2]],
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

    describe('rehash', () => {
        it('Insert with rehash', () => {
            const dictionary = new Dictionary<string, number>();

            // @ts-ignore;
            const origin = dictionary.rehash;

            // @ts-ignore
            const spy = sinon.stub(dictionary, 'rehash').callsFake(function (...args) {
                // @ts-ignore
                origin.apply(this, args);
            });

            for (let i = 0; i < 1000; i++) {
                dictionary.set(i.toString(), i);
            }

            expect(spy.callCount).equal(1);
        });

        it('Remove with rehash', () => {
            const dictionary = new Dictionary<string, number>();

            for (let i = 0; i < 1000; i++) {
                dictionary.set(i.toString(), i);
            }

            // @ts-ignore;
            const origin = dictionary.rehash;

            // @ts-ignore
            const spy = sinon.stub(dictionary, 'rehash').callsFake(function (...args) {
                // @ts-ignore
                origin.apply(this, args);
            });

            for (let i = 0; i < 990; i++) {
                dictionary.remove(i.toString());
            }

            expect(spy.callCount).equal(1);
        });

        it('rehash should save all values', () => {
            const dictionary = new Dictionary<string, number>();

            for (let i = 0; i < 10000; i++) {
                dictionary.set(i.toString(), i);
            }

            for (let i = 0; i < 10000; i++) {
                const result = dictionary.containsKey(i.toString());

                expect(result).equal(true);
            }
        });
    });
});
