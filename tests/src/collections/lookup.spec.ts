import { expect } from 'chai';
import { Lookup } from '../../../src/collections/lookup';
import { DefaultComparator } from '../../../src/utils/default-comparator';
import { ICat } from '../../models/i-cat';
import { cats } from '../../models/fixtures';
import { CatComparator } from '../../utils/cat-comparator';

describe('Lookup', () => {
    describe('With primitives', () => {
        let lookup: Lookup<[string, number], string, number> = null;

        beforeEach(() => {
            lookup = new Lookup<[string, number], string, number>(
                [
                    ['one', 1],
                    ['two', 2],
                    ['one', 1],
                    ['two', 2],
                    ['three', 3],
                ],
                item => item[0],
                new DefaultComparator(),
                item => item[1],
            );
        });

        describe('Methods', () => {
            it('get', () => {
                const valueOne = lookup.get('one');
                const expectedOne = [1, 1];
                expect(valueOne).deep.equal(expectedOne);

                const valueThree = lookup.get('three');
                const expectedThree = [3];
                expect(valueThree).deep.equal(expectedThree);
            });

            it('contains', () => {
                const containsOne = lookup.containsKey('one');
                expect(containsOne).equal(true);

                const containsFour = lookup.containsKey('four');
                expect(containsFour).equal(false);
            });
        });

        describe('Properties', () => {
            it('length', () => {
                const length = lookup.length;

                expect(length).equal(3);
            });

            it('entries', () => {
                const entries = lookup.entries;

                expect(entries).deep.equal([
                    ['one', [1, 1]],
                    ['two', [2, 2]],
                    ['three', [3]],
                ]);
            });
        });
    });
    describe('With objects', () => {
        let lookup: Lookup<[ICat, string], ICat, string> = null;

        beforeEach(() => {
            lookup = new Lookup<[ICat, string], ICat, string>(
                [
                    [cats[0], 'trackball'],
                    [cats[1], 'laser'],
                    [cats[2], 'mouse'],
                    [cats[0], 'laser'],
                    [cats[1], 'mouse'],
                ],
                item => item[0],
                new CatComparator(),
                item => item[1],
            );
        });

        describe('Methods', () => {
            it('get', () => {
                const value = lookup.get(cats[0]);
                const expected = ['trackball', 'laser'];
                expect(value).deep.equal(expected);
            });

            it('contains', () => {
                let contains = lookup.containsKey(cats[1]);
                expect(contains).equal(true);

                contains = lookup.containsKey(cats[4]);
                expect(contains).equal(false);
            });
        });

        describe('Properties', () => {
            it('length', () => {
                const length = lookup.length;

                expect(length).equal(3);
            });

            it('entries', () => {
                const entries = lookup.entries;

                expect(entries).deep.equal([
                    [cats[0], ['trackball', 'laser']],
                    [cats[1], ['laser', 'mouse']],
                    [cats[2], ['mouse']],
                ]);
            });
        });
    });
});
